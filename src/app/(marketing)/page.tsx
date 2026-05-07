import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Shield,
  FileJson,
  ArrowRight,
  Check,
  Zap,
  Code2,
  GitCompare,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const tools = [
  {
    icon: FileText,
    title: "Web → Markdown",
    description: "Paste any URL and get clean, LLM-ready markdown.",
    href: "/markdown",
  },
  {
    icon: Shield,
    title: "Context Sanitizer",
    description: "Strip API keys, emails, and PII from prompts automatically.",
    href: "/sanitize",
  },
  {
    icon: FileJson,
    title: "Text → JSON",
    description: "Turn unstructured text into structured JSON with a schema.",
    href: "/json",
  },
  {
    icon: Code2,
    title: "JSON Formatter",
    description: "Format, validate, and minify JSON. Repairs trailing commas.",
    href: "/json-formatter",
  },
  {
    icon: GitCompare,
    title: "Prompt Diff",
    description: "Compare two prompt versions side-by-side, line-by-line.",
    href: "/diff",
  },
  {
    icon: Sparkles,
    title: "Token Estimator",
    description: "Estimate token counts and API cost before you call.",
    href: "/token-estimator",
  },
];

export default async function LandingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">L</span>
            </div>
            <span className="font-semibold">LLMUtils</span>
          </Link>
          <nav className="flex items-center gap-2">
            <div className="hidden sm:block">
              <ThemeToggle className="w-auto" />
            </div>
            {signedIn ? (
              <Link href="/dashboard">
                <Button>Open dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up free</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
          <div className="container mx-auto px-4 py-20 md:py-28 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground mb-6">
              <Zap className="h-3 w-3 text-primary" />
              <span>Built for AI workers — fast, private, copy-paste ready</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              The missing toolbox for{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI workers
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop wrestling with context, formats, and API costs. Build prompts
              faster and safer with focused, single-purpose utilities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={signedIn ? "/dashboard" : "/signup"}>
                <Button size="lg">
                  {signedIn ? "Open dashboard" : "Get started free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#tools">
                <Button size="lg" variant="outline">
                  See the tools
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Free tier forever.
            </p>
          </div>
        </section>

        <section className="border-y bg-muted/30">
          <div className="container mx-auto px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Trusted by{" "}
              <span className="font-semibold text-foreground">500+</span>{" "}
              developers and AI practitioners
            </p>
          </div>
        </section>

        <section id="tools" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              One tool for every annoying step
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              No bloat, no setup. Pick a tool, do the thing, paste it back into
              your model.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="transition-colors hover:border-primary/50"
              >
                <CardHeader>
                  <tool.icon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={signedIn ? tool.href : "/signup"}>
                    <Button variant="outline" className="w-full">
                      Try it <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-muted/30 py-20 border-t">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-muted-foreground">
                Start free. Upgrade when you need more.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>Perfect for trying out</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      5 uses per tool, per day
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Standard copy / paste
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4" />
                      <span>No saved history</span>
                    </li>
                  </ul>
                  <Link
                    href={signedIn ? "/dashboard" : "/signup"}
                    className="mt-6 block"
                  >
                    <Button variant="outline" className="w-full">
                      {signedIn ? "Open dashboard" : "Get started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-primary relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Most popular
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For power users</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                    <div className="text-sm text-muted-foreground line-through">
                      $15/month
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Unlimited uses
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <strong>Pipeline Continuity</strong> — chain tools
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Save custom schemas
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Full history &amp; favorites
                    </li>
                  </ul>
                  <Link
                    href={signedIn ? "/settings" : "/signup?plan=pro"}
                    className="mt-6 block"
                  >
                    <Button className="w-full">
                      {signedIn ? "Upgrade to Pro" : "Start Pro"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 LLMUtils. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
