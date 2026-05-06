import { NextRequest, NextResponse } from "next/server";
import TurndownService from "turndown";
import { rateLimit, addRateLimitHeaders } from "@/lib/rate-limit";

// Allowed URL patterns - only fetch from known safe domains
const ALLOWED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  'docs.github.com',
  'developer.mozilla.org',
  'stackoverflow.com',
  'medium.com',
  'dev.to',
  '*.vercel.app',
  '*.netlify.app',
];

function isUrlAllowed(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Check against allowed domains
    return ALLOWED_DOMAINS.some(domain => {
      if (domain.startsWith('*.')) {
        const suffix = domain.slice(2);
        return parsedUrl.hostname === suffix || parsedUrl.hostname.endsWith('.' + suffix);
      }
      return parsedUrl.hostname === domain;
    });
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: "Valid URL is required" }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Check if URL is allowed (SSRF protection)
    if (!isUrlAllowed(url)) {
      return NextResponse.json({ error: "URL domain not allowed" }, { status: 403 });
    }

    // Prevent fetching internal resources
    const hostname = parsedUrl.hostname;
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname === '169.254.169.254' // AWS metadata service
    ) {
      return NextResponse.json({ error: "Internal URLs not allowed" }, { status: 403 });
    }

    // Fetch the webpage with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();

      // Convert HTML to Markdown using Turndown
      const turndownService = new TurndownService({
        headingStyle: "atx",
        codeBlockStyle: "fenced",
      });

      const markdown = turndownService.turndown(html);

      const response2 = NextResponse.json({ markdown });
      return addRateLimitHeaders(response2, request);
    } catch (fetchError: any) {
      clearTimeout(timeout);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ error: "Request timeout" }, { status: 408 });
      }
      throw fetchError;
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to convert URL to markdown" },
      { status: 500 }
    );
  }
}
