"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

export default function SanitizePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToHistory, setPipelineOutput } = useToolStore();
  const router = useRouter();

  const maskPII = (text: string): string => {
    // Mask API keys (OpenAI, Anthropic, etc.)
    let masked = text.replace(/sk-[a-zA-Z0-9]{32,}/g, "sk-***MASKED***");
    masked = masked.replace(/pk-[a-zA-Z0-9]{32,}/g, "pk-***MASKED***");
    masked = masked.replace(/api[_-]?key[_-]?[a-zA-Z0-9]{16,}/gi, "api_key_***MASKED***");

    // Mask emails
    masked = masked.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      "***EMAIL_MASKED***"
    );

    // Mask phone numbers (simple pattern)
    masked = masked.replace(
      /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
      "***PHONE_MASKED***"
    );

    return masked;
  };

  const handleSanitize = () => {
    if (!input) return;
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const sanitized = maskPII(input);
      setOutput(sanitized);
      addToHistory({
        tool: "sanitize",
        input,
        output: sanitized,
        timestamp: Date.now(),
      });
      setLoading(false);
    }, 300);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handlePipeline = () => {
    setPipelineOutput(output);
    router.push("/json");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Context Sanitizer</h1>
        <p className="text-muted-foreground mt-2">
          Mask API keys, emails, and other PII from your LLM context.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your LLM context here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px]"
            />
            <Button
              onClick={handleSanitize}
              disabled={loading || !input}
              className="mt-4 w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Sanitize
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sanitized Output</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button size="sm" onClick={handlePipeline}>
                  Send to JSON
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px]">
                {output}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <ToolUsageTip />

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited sanitization</span>
      </div>
    </div>
  );
}
