"use client";

import * as React from "react";

// Fire-and-forget client helper for tracking usage of fully-client-side tools.
// Returns a function that, when called, records one use of `tool` against
// the user's daily allowance. Errors are logged and swallowed — the tool
// itself shouldn't break if usage tracking fails.
export function useTrackUsage(tool: string) {
  return React.useCallback(async () => {
    try {
      const res = await fetch("/api/usage/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
          ok: false as const,
          status: res.status,
          error:
            typeof data?.error === "string"
              ? data.error
              : "Usage tracking failed",
        };
      }
      const data = await res.json();
      return { ok: true as const, ...data };
    } catch (e) {
      console.warn("[usage] track failed", e);
      return { ok: false as const, status: 0, error: "Network error" };
    }
  }, [tool]);
}
