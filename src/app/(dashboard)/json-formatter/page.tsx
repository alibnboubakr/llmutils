"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatJson = () => {
    if (!input) return;
    setError("");
    setIsValid(null);

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setIsValid(true);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
      setIsValid(false);
      
      // Try to fix common issues
      try {
        let fixed = input;
        // Remove trailing commas
        fixed = fixed.replace(/,(\s*[}\]])/g, "$1");
        // Add quotes to unquoted keys
        fixed = fixed.replace(/(\w+)\s*:/g, '"$1":');
        
        const parsed = JSON.parse(fixed);
        const formatted = JSON.stringify(parsed, null, indent);
        setOutput(formatted);
        setError("Fixed some issues and formatted successfully.");
        setIsValid(true);
      } catch {
        // Keep original error if fixing fails
      }
    }
  };

  const validateJson = () => {
    if (!input) return;
    try {
      JSON.parse(input);
      setIsValid(true);
      setError("");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setIsValid(false);
      setError(error.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output || input);
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError("");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
      setIsValid(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">JSON Formatter & Validator</h1>
        <p className="text-muted-foreground mt-2">
          Fix broken JSON from LLM outputs. Format, validate, and minify.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{"name": "John", "age": 30} or broken JSON from LLM...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2 mt-4 flex-wrap">
              <Button onClick={formatJson} disabled={!input}>
                Format
              </Button>
              <Button variant="outline" onClick={validateJson} disabled={!input}>
                Validate
              </Button>
              <Button variant="outline" onClick={handleMinify} disabled={!input}>
                Minify
              </Button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label className="text-sm">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="bg-background border rounded px-2 py-1 text-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={0}>Tabs</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Output
              {isValid === true && (
                <Badge variant="default" className="ml-2 bg-green-500">
                  <Check className="h-3 w-3 mr-1" />
                  Valid
                </Badge>
              )}
              {isValid === false && (
                <Badge variant="destructive" className="ml-2">
                  Invalid
                </Badge>
              )}
            </CardTitle>
            {output && (
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <div
                className={`p-3 rounded-md text-sm mb-4 ${
                  isValid ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                }`}
              >
                {error}
              </div>
            )}
            <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px] font-mono">
              {output || "Formatted JSON will appear here..."}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited formatting</span>
      </div>
    </div>
  );
}
