"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Shield, 
  FileJson, 
  History, 
  ArrowRight,
  Zap,
  Sparkles,
  Clock,
} from "lucide-react";
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

  const stats = [
    { label: "Tools Used", value: new Set(history.map(h => h.tool)).size, icon: Zap },
    { label: "Total Runs", value: history.length, icon: Sparkles },
    { label: "This Week", value: history.filter(h => {
      const d = new Date(h.timestamp);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).length, icon: Clock },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Welcome back!
        </h1>
        <p className="text-muted-foreground text-lg">
          Here&apos;s your productivity overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all hover:-translate-y-0.5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {recentTools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tool.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent History */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No tool runs yet. Start using tools to see your history here.
              </p>
              <Link href="/markdown">
                <Button>
                  Try Markdown Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((item, index) => (
              <Card key={index} className="hover:bg-accent/50 transition-colors group cursor-pointer">
                <CardContent className="py-4 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <History className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.tool}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="group-hover:bg-primary/10 transition-colors">
                    {item.tool}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upgrade CTA */}
      <section>
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <CardContent className="py-10 px-8 text-center relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">
              Unlock Pipeline Continuity
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Upgrade to Pro to chain tools together, save your history, and access premium features.
            </p>
            <Link href="/settings">
              <Button size="lg" className="shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Upgrade to Pro
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
