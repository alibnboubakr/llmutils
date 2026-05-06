"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function SettingsPage() {
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
                  You're currently on the free plan
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
            <Button>
              Upgrade to Pro ($9/month)
            </Button>
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
                        style={{ width: `${(2 / 5) * 100}%` }} // Example: 2/5 used
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
              <p className="text-sm text-muted-foreground">user@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Member Since</p>
              <p className="text-sm text-muted-foreground">May 2026</p>
            </div>
            <Button variant="outline" className="mt-4">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
