"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Copy, Check } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

type IndentOption = "2" | "4" | "tab" | "minified";

/** Recursively sort object keys alphabetically */
function sortKeys(val: unknown): unknown {
  if (Array.isArray(val)) return val.map(sortKeys);
  if (val !== null && typeof val === "object") {
    const sorted: Record<string, unknown> = {};
    for (const key of Object.keys(val as Record<string, unknown>).sort()) {
      sorted[key] = sortKeys((val as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  return val;
}

/** Deduplicate arrays of primitive values (string/number/boolean/null) */
function dedupeArrays(val: unknown): unknown {
  if (Array.isArray(val)) {
    const isPrimitive = (x: unknown) =>
      x === null || typeof x === "string" || typeof x === "number" || typeof x === "boolean";
    if (val.every(isPrimitive)) {
      return [...new Set(val)];
    }
    return val.map(dedupeArrays);
  }
  if (val !== null && typeof val === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      out[k] = dedupeArrays(v);
    }
    return out;
  }
  return val;
}

function resolveIndent(opt: IndentOption): string | number {
  if (opt === "2") return 2;
  if (opt === "4") return 4;
  if (opt === "tab") return "\t";
  return 0; // minified — caller uses JSON.stringify(val) directly
}

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Pro options state
  const [indentOpt, setIndentOpt] = useState<IndentOption>("2");
  const [sortKeysOpt, setSortKeysOpt] = useState(false);
  const [dedupeOpt, setDedupeOpt] = useState(false);
  const [strictMode, setStrictMode] = useState(false);

  // Legacy indent value kept in sync so validate/minify buttons still work
  const indent = indentOpt === "tab" ? "\t" : indentOpt === "minified" ? 0 : Number(indentOpt);

  const applyProTransforms = (parsed: unknown): unknown => {
    let val = parsed;
    if (sortKeysOpt) val = sortKeys(val);
    if (dedupeOpt) val = dedupeArrays(val);
    return val;
  };

  const formatJson = () => {
    if (!input) return;
    setError("");
    setIsValid(null);

    try {
      let parsed = JSON.parse(input);
      parsed = applyProTransforms(parsed);
      const formatted =
        indentOpt === "minified"
          ? JSON.stringify(parsed)
          : JSON.stringify(parsed, null, resolveIndent(indentOpt));
      setOutput(formatted);
      setIsValid(true);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error.message);
      setIsValid(false);

      if (strictMode) {
        // In strict mode, don't attempt to auto-fix
        return;
      }

      // Try to fix common issues
      try {
        let fixed = input;
        // Remove trailing commas
        fixed = fixed.replace(/,(\s*[}\]])/g, "$1");
        // Add quotes to unquoted keys
        fixed = fixed.replace(/(\w+)\s*:/g, '"$1":');

        let parsed = JSON.parse(fixed);
        parsed = applyProTransforms(parsed);
        const formatted =
          indentOpt === "minified"
            ? JSON.stringify(parsed)
            : JSON.stringify(parsed, null, resolveIndent(indentOpt));
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
      let parsed = JSON.parse(input);
      parsed = applyProTransforms(parsed);
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

            <ProOptionsPanel
              title="Fine-tune formatting"
              description="Indent style, sort keys, dedupe arrays, strict mode"
              className="mt-4"
            >
              <ProField label="Indent" hint="Controls how formatted output is indented">
                <select
                  value={indentOpt}
                  onChange={(e) => setIndentOpt(e.target.value as IndentOption)}
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                >
                  <option value="2">2 spaces (default)</option>
                  <option value="4">4 spaces</option>
                  <option value="tab">Tab</option>
                  <option value="minified">Minified</option>
                </select>
              </ProField>

              <ProField label="Transforms">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={sortKeysOpt}
                      onChange={(e) => setSortKeysOpt(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Sort keys (deep recursive)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={dedupeOpt}
                      onChange={(e) => setDedupeOpt(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Deduplicate arrays of primitives
                  </label>
                </div>
              </ProField>

              <ProField label="Strict mode" hint="When on, refuses to auto-fix trailing commas or unquoted keys and surfaces the raw parse error">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={strictMode}
                    onChange={(e) => setStrictMode(e.target.checked)}
                    className="h-4 w-4 rounded border accent-primary"
                  />
                  Strict (no auto-fix)
                </label>
              </ProField>
            </ProOptionsPanel>

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

      <ToolUsageTip />

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited formatting</span>
      </div>
    </div>
  );
}
