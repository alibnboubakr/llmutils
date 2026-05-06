import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, FileJson, ArrowRight, Check } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">L</span>
            </div>
            <span className="font-semibold">LLMUtils</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up Free</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Missing Toolbox for{" "}
            <span className="text-primary">AI Workers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop wrestling with context, formats, and API costs. Build prompts
            faster, safer.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#tools">
              <Button size="lg" variant="outline">
                View Tools
              </Button>
            </Link>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y bg-muted/50">
          <div className="container mx-auto px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">500+</span>{" "}
              developers and AI practitioners
            </p>
          </div>
        </section>

        {/* MVP Tools Preview */}
        <section id="tools" className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Start with our most popular tools
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Markdown Converter</CardTitle>
                <CardDescription>
                  Paste any URL and get LLM-ready markdown text instantly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/markdown">
                  <Button className="w-full">
                    Try Markdown <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Context Sanitizer</CardTitle>
                <CardDescription>
                  Mask API keys and PII from your LLM context automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/sanitize">
                  <Button className="w-full">
                    Try Sanitize <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileJson className="h-8 w-8 text-primary mb-2" />
                <CardTitle>JSON Formatter</CardTitle>
                <CardDescription>
                  Convert unstructured text to JSON with custom schemas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/json">
                  <Button className="w-full">
                    Try JSON <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Simple, transparent pricing
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Free Plan */}
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
                      Standard copy/paste
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      No saved history
                    </li>
                  </ul>
                  <Link href="/signup" className="mt-6 block">
                    <Button variant="outline" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro</CardTitle>
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      POPULAR
                    </span>
                  </div>
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
                      <strong>Pipeline Continuity</strong> - chain tools
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Save custom schemas
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Full history & favorites
                    </li>
                  </ul>
                  <Link href="/signup?plan=pro" className="mt-6 block">
                    <Button className="w-full">Upgrade to Pro</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 LLMUtils. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
