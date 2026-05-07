"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

export default function MarkdownPage() {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToHistory, setPipelineOutput } = useToolStore();
  const router = useRouter();

  const handleConvert = async () => {
    if (!url) return;
    setLoading(true);
    setError("");

    try {
      // Call API route to convert URL to markdown
      const res = await fetch("/api/tools/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to convert");

      setMarkdown(data.markdown);
      addToHistory({
        tool: "markdown",
        input: url,
        output: data.markdown,
        timestamp: Date.now(),
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handlePipeline = () => {
    setPipelineOutput(markdown);
    router.push("/sanitize");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Web to Markdown</h1>
        <p className="text-muted-foreground mt-2">
          Paste a URL and convert any webpage to LLM-ready markdown text.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvert()}
            />
            <Button onClick={handleConvert} disabled={loading || !url}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Convert"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {markdown && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Output</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" onClick={handlePipeline}>
                Send to Sanitize
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto max-h-96">
              {markdown}
            </pre>
          </CardContent>
        </Card>
      )}

      <ToolUsageTip />

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
