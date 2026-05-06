// API routes for extension
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, addRateLimitHeaders } from "@/lib/rate-limit";

// Sanitize endpoint for extension
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { text, userId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Validate input length to prevent abuse
    if (text.length > 100000) {
      return NextResponse.json(
        { error: "Text too long. Maximum 100,000 characters." },
        { status: 400 }
      );
    }

    // Check usage limits for free users
    if (userId) {
      // TODO: Check usage in Supabase
      // For now, simulate limit check
    }

    // Mask PII
    let sanitized = text;
    
    // Mask API keys (OpenAI, Anthropic, etc.)
    sanitized = sanitized.replace(/sk-[a-zA-Z0-9]{32,}/g, "sk-***MASKED***");
    sanitized = sanitized.replace(/pk-[a-zA-Z0-9]{32,}/g, "pk-***MASKED***");
    sanitized = sanitized.replace(/api[_-]?key[_-]?[a-zA-Z0-9]{16,}/gi, "api_key_***MASKED***");
    
    // Mask emails
    sanitized = sanitized.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "***EMAIL_MASKED***"
    );
    
    // Mask phone numbers (simple pattern)
    sanitized = sanitized.replace(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
      "***PHONE_MASKED***"
    );

    const response = NextResponse.json({ sanitized });
    return addRateLimitHeaders(response, request);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
