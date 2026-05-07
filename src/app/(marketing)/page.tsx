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
  Code2,
  GitCompare,
  Sparkles,
  Rocket,
  Terminal,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const tools = [
  {
    icon: Globe,
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
    icon: Braces,
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
    icon: Zap,
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

      <main className="flex-1 relative">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
          <div className="container mx-auto px-4 text-center relative z-20">
            {/* Animated badge */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mb-8 shadow-sm">
              <Terminal className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-medium">Built for AI workers</span>
              <span className="text-primary">â€¢</span>
              <span>Fast, private, copy-paste ready</span>
            </div>
            
            {/* Main heading with gradient */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl mx-auto leading-[1.1]">
              The{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  missing toolbox
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 -skew-y--3 -z-10" />
              </span>
              {" "}for AI workers
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Stop wrestling with context, formats, and API costs. 
              <span className="text-foreground font-medium">Build prompts faster and safer</span>
              {" "}with focused, single-purpose utilities.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href={signedIn ? "/dashboard" : "/signup"}>
                <Button size="lg" className="text-lg px-8 py-6 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:scale-105">
                  {signedIn ? "Open Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#tools">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover:bg-accent/50 transition-all">
                  <Sparkles className="mr-2 h-5 w-5" />
                  See the Tools
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <p>No credit card required</p>
              <div className="w-1 h-1 rounded-full bg-border" />
              <p>Free tier forever</p>
              <div className="w-1 h-1 rounded-full bg-border" />
              <p className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                Ready in seconds
              </p>
            </div>
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
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">15+ Professional Tools</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              One tool for{" "}
              <span className="text-primary">every annoying step</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              No bloat, no setup. Pick a tool, do the thing, paste it back into
              your model.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => (
              <Card
                key={tool.href}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 hover:-translate-y-1"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <CardHeader className="relative">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tool.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <Link href={signedIn ? tool.href : "/signup"}>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:border-primary/50 group-hover:bg-primary/5 transition-all"
                    >
                      Try it 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Simple, transparent pricing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                Start free. Upgrade when you{" "}
                <span className="text-primary">need more</span>.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                No hidden fees. No surprises. Cancel anytime.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className="relative group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardHeader className="pb-8">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Free</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Check className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <CardDescription className="text-base">Perfect for trying out</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-extrabold">$0</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">5 uses per tool, per day</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">Standard copy / paste</span>
                    </li>
                    <li className="flex items-center gap-3 text-muted-foreground">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4" />
                      </div>
                      <span>No saved history</span>
                    </li>
                  </ul>
                  <Link
                    href={signedIn ? "/dashboard" : "/signup"}
                    className="block"
                  >
                    <Button variant="outline" className="w-full py-6 text-lg hover:bg-accent/50 transition-colors">
                      {signedIn ? "Open Dashboard" : "Get Started"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary relative group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                
                {/* Popular badge */}
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-primary/25">
                  ⭐ Most Popular
                </div>
                
                <CardHeader className="pb-8 relative">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Pro</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <CardDescription className="text-base">For power users</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-extrabold">$9</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                    <div className="inline-flex items-center gap-2 ml-3">
                      <span className="text-sm text-muted-foreground line-through">$15</span>
                      <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded-full font-medium">
                        Save 40%
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">Unlimited uses</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span>
                        <strong className="text-foreground">Pipeline Continuity</strong> — chain tools
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">Save custom schemas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="font-medium">Full history & favorites</span>
                    </li>
                  </ul>
                  <Link
                    href={signedIn ? "/settings" : "/signup?plan=pro"}
                    className="block"
                  >
                    <Button className="w-full py-6 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]">
                      {signedIn ? "Upgrade to Pro" : "Start Pro Today"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Rocket className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="font-semibold">LLMUtils</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LLMUtils. Built for AI workers.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
