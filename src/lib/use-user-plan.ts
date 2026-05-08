"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";

export type UserPlan = "free" | "pro";

type Result = {
  plan: UserPlan;
  loading: boolean;
  isPro: boolean;
  refresh: () => void;
};

// Reads the current user's plan from /api/usage (which is plan-aware) so we
// don't need a second round-trip just for plan info. Falls back to "free".
export function useUserPlan(): Result {
  const [plan, setPlan] = React.useState<UserPlan>("free");
  const [loading, setLoading] = React.useState(true);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/usage", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const p = data?.plan === "pro" ? "pro" : "free";
        setPlan(p);
      })
      .catch(() => {
        if (!cancelled) setPlan("free");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setTick((t) => t + 1);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [tick]);

  return {
    plan,
    loading,
    isPro: plan === "pro",
    refresh: () => setTick((t) => t + 1),
  };
}
