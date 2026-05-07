import { createServerSupabaseClient } from "@/lib/supabase-server";
import { FREE_DAILY_LIMIT, type UsageRow } from "@/lib/usage";

type TrackResult =
  | { ok: true; count: number; limit: number | null; plan: "free" | "pro" }
  | { ok: false; status: number; error: string };

// Increment usage for the authenticated user. Returns ok=false with a 401 if
// the user is not signed in, or 429 if they've hit the free daily limit.
// If the `tool_usage` table doesn't exist yet (migration not run), we log
// once and let the request through — usage caps simply aren't enforced.
export async function trackUsage(tool: string): Promise<TrackResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();

  const plan: "free" | "pro" = profile?.plan === "pro" ? "pro" : "free";
  const limit = plan === "pro" ? null : FREE_DAILY_LIMIT;

  const { data, error } = await supabase.rpc("increment_tool_usage", {
    p_tool: tool,
  });

  if (error) {
    // Missing table / function — fail open so the rest of the app keeps working.
    console.warn(
      "[usage] increment_tool_usage failed; running unenforced.",
      error.message
    );
    return { ok: true, count: 0, limit, plan };
  }

  const count = typeof data === "number" ? data : Number(data) || 0;

  if (limit !== null && count > limit) {
    return {
      ok: false,
      status: 429,
      error: `Daily limit reached (${limit}). Upgrade to Pro for unlimited use.`,
    };
  }

  return { ok: true, count, limit, plan };
}

export async function getTodayUsage(): Promise<{
  rows: UsageRow[];
  plan: "free" | "pro";
}> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { rows: [], plan: "free" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();
  const plan: "free" | "pro" = profile?.plan === "pro" ? "pro" : "free";

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tool_usage")
    .select("tool, count")
    .eq("user_id", user.id)
    .eq("day", today);

  if (error) {
    return { rows: [], plan };
  }

  return {
    rows: (data ?? []).map((r) => ({ tool: r.tool, count: r.count })),
    plan,
  };
}
