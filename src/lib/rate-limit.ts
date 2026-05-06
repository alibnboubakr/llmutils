import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {};

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute per IP

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  
  const key = `rate-limit:${ip}`;
  const now = Date.now();
  
  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }
  
  // Initialize or get existing entry
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }
  
  store[key].count++;
  
  // Check if limit exceeded
  if (store[key].count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { 
        status: 429,
        headers: {
          "Retry-After": Math.ceil((store[key].resetTime - now) / 1000).toString(),
          "X-RateLimit-Limit": MAX_REQUESTS.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(store[key].resetTime).toISOString(),
        }
      }
    );
  }
  
  return null; // No rate limit applied
}

// Helper to add rate limit headers to successful responses
export function addRateLimitHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  
  const key = `rate-limit:${ip}`;
  const entry = store[key];
  
  if (entry) {
    response.headers.set("X-RateLimit-Limit", MAX_REQUESTS.toString());
    response.headers.set(
      "X-RateLimit-Remaining", 
      Math.max(0, MAX_REQUESTS - entry.count).toString()
    );
    response.headers.set("X-RateLimit-Reset", new Date(entry.resetTime).toISOString());
  }
  
  return response;
}
