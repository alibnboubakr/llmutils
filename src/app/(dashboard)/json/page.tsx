"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";
import { Badge } from "@/components/ui/badge";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Loader2, Copy } from "lucide-react";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

export default function JsonPage() {
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState('{\n  "type": "object",\n  "properties": {}\n}');
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToHistory, pipelineOutput, setPipelineOutput } = useToolStore();

  // Check if there's pipeline output from another tool
  useEffect(() => {
    if (pipelineOutput) {
      setInput(pipelineOutput);
      setPipelineOutput(null); // Clear after using
    }
  }, [pipelineOutput, setPipelineOutput]);

  const handleConvert = () => {
    if (!input) return;
    setLoading(true);
    setError("");

    try {
      // Simple unstructured to JSON conversion
      // In production, this would call an AI API or more sophisticated parser
      const lines = input.split("\n").filter((line) => line.trim());
      const result: Record<string, unknown> = {};

      lines.forEach((line, index) => {
        // Try to extract key-value pairs
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result[match[1].trim()] = match[2].trim();
        } else {
          result[`field_${index + 1}`] = line.trim();
        }
      });

      const json = JSON.stringify(result, null, 2);
      setOutput(json);
      addToHistory({
        tool: "json",
        input,
        output: json,
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
    navigator.clipboard.writeText(output);
  };

  // Blur technique for free users (show first 3 lines)
  const renderOutput = () => {
    const lines = output.split("\n");
    const showLines = lines.slice(0, 3);
    const hiddenLines = lines.slice(3);

    return (
      <div className="relative">
        <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px]">
          {showLines.join("\n")}
          {hiddenLines.length > 0 && (
            <>
              <div className="blur-sm select-none">{hiddenLines.join("\n")}</div>
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-md">
                <Badge className="bg-primary text-primary-foreground">
                  PRO — Upgrade to unblur
                </Badge>
              </div>
            </>
          )}
        </pre>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Unstructured to JSON</h1>
        <p className="text-muted-foreground mt-2">
          Paste messy text, optionally define a schema, and get structured JSON.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste unstructured text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] mb-4"
            />
            <p className="text-sm text-muted-foreground mb-2">Optional Schema:</p>
            <Textarea
              value={schema}
              onChange={(e) => setSchema(e.target.value)}
              className="min-h-[100px] font-mono text-xs mb-4"
            />
            <Button
              onClick={handleConvert}
              disabled={loading || !input}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Convert to JSON
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>JSON Output</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>{renderOutput()}</CardContent>
          </Card>
        )}
      </div>

      {error && (
        <div className="mt-4 bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      <ToolUsageTip />

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions and saved schemas</span>
      </div>
    </div>
  );
}
