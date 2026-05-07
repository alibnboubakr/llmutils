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

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState<string>("");
  const [createdAt, setCreatedAt] = React.useState<string>("");
  const [upgrading, setUpgrading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* Plan Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>
                  You&apos;re currently on the free plan
                </CardDescription>
              </div>
              <Badge variant="secondary">Current Plan</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                5 uses per tool, per day
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Standard copy/paste
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4" />
                <span className="line-through">Pipeline Continuity</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4" />
                <span className="line-through">Full History</span>
              </li>
            </ul>
            <Button onClick={onUpgrade} disabled={upgrading}>
              {upgrading ? "Redirecting..." : "Upgrade to Pro ($9/month)"}
            </Button>
            {error && (
              <p className="mt-3 text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Usage Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Usage</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {["markdown", "sanitize", "json"].map((tool) => (
                <div key={tool} className="flex items-center justify-between">
                  <span className="capitalize">{tool}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(2 / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">2/5</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Account Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">Email</p>
              <p className="text-sm text-muted-foreground">
                {email || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Member Since</p>
              <p className="text-sm text-muted-foreground">
                {createdAt || "—"}
              </p>
            </div>
            <Button variant="outline" className="mt-4" onClick={onSignOut}>
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
