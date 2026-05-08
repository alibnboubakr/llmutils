"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

type OutputStyle = "article" | "full" | "bullets-only";

function applyMarkdownOptions(
  raw: string,
  style: OutputStyle,
  stripImages: boolean,
  stripLinks: boolean,
  maxLength: number
): string {
  let result = raw;

  // 1. Apply output style
  if (style === "article") {
    // Strip heading-only lines that look like nav/footer items (single word or short phrase with no sentence structure)
    const lines = result.split("\n");
    const filtered = lines.filter((line) => {
      const trimmed = line.trim();
      // Keep headings that have actual content-like text (more than 3 words or contain punctuation)
      if (/^#{1,6}\s/.test(trimmed)) {
        const text = trimmed.replace(/^#+\s*/, "");
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        return wordCount > 3 || /[.,;:!?]/.test(text);
      }
      return true;
    });
    // Collapse multiple blank lines into one
    result = filtered.join("\n").replace(/\n{3,}/g, "\n\n");
  } else if (style === "bullets-only") {
    const lines = result.split("\n");
    result = lines.filter((line) => /^\s*[-*]\s/.test(line)).join("\n");
  }
  // "full" returns as-is

  // 2. Strip images
  if (stripImages) {
    result = result.replace(/!\[([^\]]*)\]\([^)]*\)/g, "");
  }

  // 3. Strip links (replace [text](url) with text)
  if (stripLinks) {
    result = result.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  }

  // 4. Truncate
  if (maxLength > 0 && result.length > maxLength) {
    result = result.slice(0, maxLength) + "…";
  }

  return result;
}

export default function MarkdownPage() {
  const [url, setUrl] = useState("");
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToHistory, setPipelineOutput } = useToolStore();
  const router = useRouter();

  // Pro options state
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("article");
  const [stripImages, setStripImages] = useState(false);
  const [stripLinks, setStripLinks] = useState(false);
  const [maxLength, setMaxLength] = useState(0);

  // Derived processed markdown
  const markdown = useMemo(
    () => applyMarkdownOptions(rawMarkdown, outputStyle, stripImages, stripLinks, maxLength),
    [rawMarkdown, outputStyle, stripImages, stripLinks, maxLength]
  );

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

      setRawMarkdown(data.markdown);
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

      <ProOptionsPanel
        title="Fine-tune output"
        description="Control output style, strip noise, and limit length"
        className="mb-6"
      >
        <ProField label="Output style" hint="article strips nav/footer headings and collapses blank lines; bullets-only keeps only list items">
          <select
            value={outputStyle}
            onChange={(e) => setOutputStyle(e.target.value as OutputStyle)}
            className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
          >
            <option value="article">Article (clean prose)</option>
            <option value="full">Full (as-is)</option>
            <option value="bullets-only">Bullets only</option>
          </select>
        </ProField>

        <ProField label="Strip images">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stripImages}
              onChange={(e) => setStripImages(e.target.checked)}
              className="h-4 w-4 rounded border accent-primary"
            />
            Remove all <code>![alt](url)</code> image tokens
          </label>
        </ProField>

        <ProField label="Strip links">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stripLinks}
              onChange={(e) => setStripLinks(e.target.checked)}
              className="h-4 w-4 rounded border accent-primary"
            />
            Replace <code>[text](url)</code> with plain text
          </label>
        </ProField>

        <ProField label="Max length (chars)" hint="0 = unlimited">
          <Input
            type="number"
            min={0}
            value={maxLength}
            onChange={(e) => setMaxLength(Math.max(0, Number(e.target.value)))}
            className="w-32 text-sm"
          />
        </ProField>
      </ProOptionsPanel>

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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
