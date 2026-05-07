"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Shield, FileJson, History, ArrowRight } from "lucide-react";
import { useToolStore } from "@/store/use-tool-store";

export default function DashboardPage() {
  const { history } = useToolStore();

  const recentTools = [
    {
      name: "Markdown",
      href: "/markdown",
      icon: FileText,
      description: "Convert URLs to markdown",
    },
    {
      name: "Sanitize",
      href: "/sanitize",
      icon: Shield,
      description: "Mask API keys and PII",
    },
    {
      name: "JSON",
      href: "/json",
      icon: FileJson,
      description: "Unstructured to JSON",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recentTools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader>
                  <tool.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent History */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent History</h2>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No tool runs yet. Start using tools to see your history here.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((item, index) => (
              <Card key={index}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{item.tool}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{item.tool}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upgrade CTA */}
      <section className="mt-12">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">
              Unlock Pipeline Continuity
            </h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro to chain tools together and save your history.
            </p>
            <Button>
              Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
