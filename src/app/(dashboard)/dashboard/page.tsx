"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Shield,
  FileJson,
  History,
  ArrowRight,
  Zap,
  Sparkles,
  Clock,
  Hash,
  GitCompare,
  Download,
  BookMarked,
} from "lucide-react";
import { useToolStore } from "@/store/use-tool-store";

const CORE_TOOLS = [
  {
    name: "Markdown",
    href: "/markdown",
    icon: FileText,
    description: "Convert any URL to clean markdown for LLM context.",
  },
  {
    name: "Sanitize",
    href: "/sanitize",
    icon: Shield,
    description: "Strip PII and API keys before sending to AI.",
  },
  {
    name: "Token Estimator",
    href: "/token-estimator",
    icon: Zap,
    description: "Know your cost before you hit send.",
  },
  {
    name: "Prompt Diff",
    href: "/diff",
    icon: GitCompare,
    description: "A/B compare prompt versions word-by-word.",
  },
  {
    name: "Chat Exporter",
    href: "/chat-exporter",
    icon: Download,
    description: "Save AI conversations to Markdown or PDF.",
  },
  {
    name: "JSON",
    href: "/json",
    icon: FileJson,
    description: "Turn unstructured text into structured JSON.",
  },
  {
    name: "Regex",
    href: "/regex",
    icon: Hash,
    description: "Describe a pattern in English, get regex.",
  },
];

export default function DashboardPage() {
  const { history } = useToolStore();

  const stats = [
    { label: "Tools Used", value: new Set(history.map(h => h.tool)).size, icon: Zap },
    { label: "Total Runs", value: history.length, icon: Sparkles },
    { label: "This Week", value: history.filter(h => {
      const d = new Date(h.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return d >= weekAgo;
    }).length, icon: Clock },
  ];

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-2">
          Your AI toolkit
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Seven sharp tools for engineers who work with LLMs every day.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 md:mb-12">
        {stats.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-all hover:-translate-y-0.5">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tool Grid */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {CORE_TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full">
                <CardHeader className="pb-3">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
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

      {/* Prompt Library CTA */}
      <section className="mb-8 md:mb-12">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <CardContent className="py-8 px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <BookMarked className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Prompt Library</h3>
                <p className="text-sm text-muted-foreground">
                  Save, tag, and reuse your best prompts across every tool.
                </p>
              </div>
            </div>
            <Link href="/prompts">
              <Button className="shrink-0">
                Open Library
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Recent Activity</h2>
          <Link href="/history">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {history.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center">
              <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <History className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                No runs yet. Pick a tool above to get started.
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
              <Card key={index} className="hover:bg-accent/50 transition-colors">
                <CardContent className="py-3 px-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <History className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.tool}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
