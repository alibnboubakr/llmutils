"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { TRACKED_TOOLS } from "@/lib/usage";

type UsageResponse = {
  plan: "free" | "pro";
  limit: number | null;
  usage: { tool: string; count: number }[];
};

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [createdAt, setCreatedAt] = React.useState<string>("");
  const [upgrading, setUpgrading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [usage, setUsage] = React.useState<UsageResponse | null>(null);
  const [usageLoading, setUsageLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        if (user.created_at) {
          setCreatedAt(
            new Date(user.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })
          );
        }
      }
    });

    fetch("/api/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: UsageResponse | null) => setUsage(data))
      .catch(() => setUsage(null))
      .finally(() => setUsageLoading(false));
  }, []);

  async function onUpgrade() {
    setError(null);
    setUpgrading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "monthly" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("Missing checkout URL");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setUpgrading(false);
    }
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const plan = usage?.plan ?? "free";
  const limit = usage?.limit ?? 5;
  const isPro = plan === "pro";

  const countByTool = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const u of usage?.usage ?? []) map.set(u.tool, u.count);
    return map;
  }, [usage]);

  // Sort: tools with usage first, then alphabetical.
  const orderedTools = React.useMemo(() => {
    return [...TRACKED_TOOLS].sort((a, b) => {
      const ua = countByTool.get(a) ?? 0;
      const ub = countByTool.get(b) ?? 0;
      if (ua !== ub) return ub - ua;
      return a.localeCompare(b);
    });
  }, [countByTool]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your plan</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{isPro ? "Pro plan" : "Free plan"}</CardTitle>
                <CardDescription>
                  {isPro
                    ? "Unlimited use, full history, custom schemas."
                    : "You're currently on the free plan."}
                </CardDescription>
              </div>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                {isPro ? "Unlimited uses" : "5 uses per tool, per day"}
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Standard copy / paste
              </li>
              <li
                className={
                  isPro
                    ? "flex items-center gap-2"
                    : "flex items-center gap-2 text-muted-foreground"
                }
              >
                <Check
                  className={
                    isPro ? "h-4 w-4 text-green-500" : "h-4 w-4"
                  }
                />
                <span className={isPro ? "" : "line-through"}>
                  Pipeline Continuity
                </span>
              </li>
              <li
                className={
                  isPro
                    ? "flex items-center gap-2"
                    : "flex items-center gap-2 text-muted-foreground"
                }
              >
                <Check
                  className={
                    isPro ? "h-4 w-4 text-green-500" : "h-4 w-4"
                  }
                />
                <span className={isPro ? "" : "line-through"}>
                  Full history
                </span>
              </li>
            </ul>
            {!isPro && (
              <Button onClick={onUpgrade} disabled={upgrading}>
                {upgrading ? "Redirecting…" : "Upgrade to Pro ($9/month)"}
              </Button>
            )}
            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily usage (today)</h2>
        <Card>
          <CardContent className="pt-6">
            {usageLoading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : !usage ? (
              <p className="text-sm text-muted-foreground">
                Usage tracking is not yet configured.
              </p>
            ) : (
              <div className="space-y-3">
                {orderedTools.map((tool) => {
                  const count = countByTool.get(tool) ?? 0;
                  const pct =
                    isPro || !limit
                      ? Math.min(100, count * 10)
                      : Math.min(100, (count / limit) * 100);
                  return (
                    <div
                      key={tool}
                      className="flex items-center justify-between"
                    >
                      <span className="capitalize text-sm">
                        {tool.replace(/-/g, " ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-12 text-right tabular-nums">
                          {isPro || !limit ? count : `${count}/${limit}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-sm text-muted-foreground">{email || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Member since</p>
              <p className="text-sm text-muted-foreground">
                {createdAt || "—"}
              </p>
            </div>
            <Button variant="outline" className="mt-4" onClick={onSignOut}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
