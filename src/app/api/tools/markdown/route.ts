import { NextRequest, NextResponse } from "next/server";
import TurndownService from "turndown";
import { rateLimit, addRateLimitHeaders } from "@/lib/rate-limit";
import { trackUsage } from "@/lib/usage-server";

export const runtime = "nodejs";

// Block private / link-local / loopback / cloud-metadata addresses to prevent
// SSRF. We accept any other public hostname.
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "metadata.google.internal",
]);

function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(h)) return true;

  // Bare-IP literals: block private / loopback / link-local ranges.
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(h)) {
    const [a, b] = h.split(".").map(Number);
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // AWS / link-local
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a >= 224) return true; // multicast / reserved
  }

  // IPv6 loopback / link-local / unique-local.
  if (h === "::1" || h.startsWith("fe80:") || h.startsWith("fc") || h.startsWith("fd")) {
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  const usage = await trackUsage("markdown");
  if (!usage.ok) {
    return NextResponse.json({ error: usage.error }, { status: usage.status });
  }

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Valid URL is required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only http and https URLs are supported" },
        { status: 400 }
      );
    }

    if (isBlockedHostname(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: "URL points to a private or local address" },
        { status: 403 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    let html: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; LLMUtilsBot/1.0; +https://llmutils.co)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
          { status: 502 }
        );
      }

      // Only accept HTML / text content; skip binaries.
      const contentType = response.headers.get("content-type") ?? "";
      if (
        !contentType.includes("text/html") &&
        !contentType.includes("application/xhtml") &&
        !contentType.includes("text/plain")
      ) {
        return NextResponse.json(
          { error: `Unsupported content type: ${contentType || "unknown"}` },
          { status: 415 }
        );
      }

      html = await response.text();
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === "AbortError") {
        return NextResponse.json(
          { error: "Request timed out" },
          { status: 408 }
        );
      }
      throw err;
    }

    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });
    const markdown = turndown.turndown(html);

    const response2 = NextResponse.json({ markdown });
    return addRateLimitHeaders(response2, request);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to convert URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
