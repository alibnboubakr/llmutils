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
  Globe,
  Shield,
  Braces,
  ArrowRight,
  Check,
  Zap,
  GitCompare,
  Sparkles,
  Rocket,
  Hash,
  Download,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const tools = [
  {
    icon: Globe,
    title: "Web → Markdown",
    description: "Paste any URL and get clean, LLM-ready markdown in one click.",
    href: "/markdown",
  },
  {
    icon: Shield,
    title: "PII Sanitizer",
    description: "Strip API keys, emails, and PII before they reach the model.",
    href: "/sanitize",
  },
  {
    icon: Zap,
    title: "Token Estimator",
    description: "See the cost before you send — across GPT-4o, Claude, and Gemini.",
    href: "/token-estimator",
  },
  {
    icon: GitCompare,
    title: "Prompt Diff",
    description: "A/B compare prompt versions word-by-word. Ship better prompts faster.",
    href: "/diff",
  },
  {
    icon: Download,
    title: "Chat Exporter",
    description: "Export AI conversations to Markdown or PDF with one click.",
    href: "/chat-exporter",
  },
  {
    icon: Braces,
    title: "Text → JSON",
    description: "Turn unstructured AI output into structured JSON with a schema hint.",
    href: "/json",
  },
  {
    icon: Hash,
    title: "English → Regex",
    description: "Describe the pattern you need in plain English, get the regex.",
    href: "/regex",
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
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
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
                  <Button>Try for free</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-36">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container mx-auto px-4 text-center relative z-20 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8 shadow-sm">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span>Stop leaking PII. Stop burning tokens blindly. Stop losing your best prompts.</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-[1.05]">
              The missing layer<br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                between you and the model
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Seven sharp tools that clean your context, estimate your cost, protect your data,
              and save your best work — before it hits the AI.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Link href={signedIn ? "/dashboard" : "/signup"}>
                <Button size="lg" className="text-base px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/35 transition-all hover:scale-105">
                  {signedIn ? "Open Dashboard" : "Get started free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#tools">
                <Button size="lg" variant="outline" className="text-base px-8 py-6">
                  See the tools
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> Free tier forever
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-500" /> Ready in seconds
              </span>
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
              Seven tools. One workflow.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              No bloat, no configuration. Each tool does one thing and does it well.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <Link href={signedIn ? tool.href : "/signup"}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:border-primary/50 group-hover:bg-primary/5 transition-all"
                    >
                      Try it
                      <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 relative overflow-hidden bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
                Start free. Grow with your team.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                No hidden fees. Cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free */}
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Free</CardTitle>
                  <CardDescription>Try everything</CardDescription>
                  <div className="pt-2">
                    <span className="text-4xl font-extrabold">$0</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      10 uses per tool, per day
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      All 7 core tools
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0" />
                      No prompt library
                    </li>
                  </ul>
                  <Link href={signedIn ? "/dashboard" : "/signup"} className="block">
                    <Button variant="outline" className="w-full">
                      {signedIn ? "Open Dashboard" : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Individual Pro */}
              <Card className="border-primary relative overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Popular
                </div>
                <CardHeader className="relative">
                  <CardTitle className="text-xl">Individual Pro</CardTitle>
                  <CardDescription>For solo AI engineers</CardDescription>
                  <div className="pt-2">
                    <span className="text-4xl font-extrabold">$19</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <strong>Unlimited</strong> uses
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Fine-tuning options on every tool
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      500 saved prompts library
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Full history
                    </li>
                  </ul>
                  <Link href={signedIn ? "/settings" : "/signup?plan=pro"} className="block">
                    <Button className="w-full shadow-lg shadow-primary/20">
                      {signedIn ? "Upgrade to Pro" : "Start Pro Today"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Team */}
              <Card className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Team
                    <span className="text-xs font-normal bg-muted px-2 py-0.5 rounded-full text-muted-foreground">New</span>
                  </CardTitle>
                  <CardDescription>For engineering teams</CardDescription>
                  <div className="pt-2">
                    <span className="text-4xl font-extrabold">$29</span>
                    <span className="text-muted-foreground ml-1">/user/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Everything in Individual Pro
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <strong>Shared</strong> prompt library
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Team invite + audit log
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      Priority support
                    </li>
                  </ul>
                  <Link href="mailto:team@llmutils.co" className="block">
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Talk to us
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-10 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Rocket className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">LLMUtils</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LLMUtils. Built for AI engineers.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="mailto:team@llmutils.co" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
