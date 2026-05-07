import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";
import { rateLimit, addRateLimitHeaders } from "@/lib/rate-limit";
import { trackUsage } from "@/lib/usage-server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const limited = rateLimit(request);
  if (limited) return limited;

  const usage = await trackUsage("transcribe");
  if (!usage.ok) {
    return NextResponse.json({ error: usage.error }, { status: usage.status });
  }

  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A YouTube URL or video ID is required" },
        { status: 400 }
      );
    }

    let segments;
    try {
      segments = await YoutubeTranscript.fetchTranscript(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not fetch transcript";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const transcript = segments.map((s) => s.text).join(" ").trim();
    const segmentsOut = segments.map((s) => ({
      text: s.text,
      offset: s.offset,
      duration: s.duration,
    }));

    const response = NextResponse.json({
      transcript,
      segments: segmentsOut,
    });
    return addRateLimitHeaders(response, request);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transcript";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
