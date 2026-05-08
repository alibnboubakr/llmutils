"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToolStore } from "@/store/use-tool-store";
import { Badge } from "@/components/ui/badge";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Loader2, Copy } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

type OutputStyle = "flat" | "nested";

/** Convert "true"/"false"/numbers/ISO dates to typed values */
function coerceValue(val: unknown): unknown {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed !== "" && !isNaN(Number(trimmed))) return Number(trimmed);
  // ISO date check
  if (/^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/.test(trimmed)) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return val;
}

/** Recursively coerce all string values in an object */
function deepCoerce(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(deepCoerce);
  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = deepCoerce(v);
    }
    return out;
  }
  return coerceValue(obj);
}

/** Recursively trim all string values */
function deepTrim(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(deepTrim);
  if (obj !== null && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = deepTrim(v);
    }
    return out;
  }
  if (typeof obj === "string") return obj.trim();
  return obj;
}

/** Split dot-notation keys into nested objects */
function nestKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current) || typeof current[part] !== "object" || current[part] === null) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

/** Filter object keys to those present in the schema/example, coercing types */
function applySchemaFilter(obj: Record<string, unknown>, schemaHint: string): Record<string, unknown> {
  try {
    const schema = JSON.parse(schemaHint);
    // Determine allowed keys from schema or example object
    let allowedKeys: Set<string>;
    let typeMap: Record<string, string> = {};

    if (schema.type === "object" && schema.properties) {
      // JSON Schema format
      allowedKeys = new Set(Object.keys(schema.properties));
      for (const [k, v] of Object.entries(schema.properties as Record<string, { type?: string }>)) {
        if (v.type) typeMap[k] = v.type;
      }
    } else if (typeof schema === "object" && !Array.isArray(schema)) {
      // Example object format — keys are the allowed keys, values hint types
      allowedKeys = new Set(Object.keys(schema));
      for (const [k, v] of Object.entries(schema)) {
        typeMap[k] = typeof v;
      }
    } else {
      return obj;
    }

    const filtered: Record<string, unknown> = {};
    for (const key of allowedKeys) {
      if (key in obj) {
        let val = obj[key];
        const targetType = typeMap[key];
        if (targetType === "string" && typeof val !== "string") val = String(val);
        else if (targetType === "number" && typeof val !== "number") val = Number(val);
        else if (targetType === "boolean" && typeof val !== "boolean") val = Boolean(val);
        filtered[key] = val;
      }
    }
    return filtered;
  } catch {
    return obj;
  }
}

export default function JsonPage() {
  const [input, setInput] = useState("");
  const [schema, setSchema] = useState('{\n  "type": "object",\n  "properties": {}\n}');
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addToHistory, pipelineOutput, setPipelineOutput } = useToolStore();

  // Pro options state
  const [schemaHint, setSchemaHint] = useState("");
  const [outputStyle, setOutputStyle] = useState<OutputStyle>("flat");
  const [coerceTypes, setCoerceTypes] = useState(true);
  const [trimStrings, setTrimStrings] = useState(true);

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
      const lines = input.split("\n").filter((line) => line.trim());
      let result: Record<string, unknown> = {};

      lines.forEach((line, index) => {
        // Try to extract key-value pairs
        const match = line.match(/^([^:]+):\s*(.+)$/);
        if (match) {
          result[match[1].trim()] = match[2].trim();
        } else {
          result[`field_${index + 1}`] = line.trim();
        }
      });

      // Pro: coerce types
      if (coerceTypes) {
        result = deepCoerce(result) as Record<string, unknown>;
      }

      // Pro: trim strings
      if (trimStrings) {
        result = deepTrim(result) as Record<string, unknown>;
      }

      // Pro: nest keys
      if (outputStyle === "nested") {
        result = nestKeys(result);
      }

      // Pro: schema filter
      if (schemaHint.trim()) {
        result = applySchemaFilter(result, schemaHint.trim());
      }

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

            <ProOptionsPanel
              title="Fine-tune JSON output"
              description="Schema filtering, nested keys, type coercion"
              className="mb-4"
            >
              <ProField label="Schema hint" hint="Paste a JSON Schema or example object to filter and coerce output keys">
                <Textarea
                  placeholder={'{ "name": "string", "age": 0 }'}
                  value={schemaHint}
                  onChange={(e) => setSchemaHint(e.target.value)}
                  className="min-h-[80px] font-mono text-xs"
                />
              </ProField>

              <ProField label="Output style">
                <div className="flex gap-4">
                  {(["flat", "nested"] as OutputStyle[]).map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="outputStyle"
                        value={s}
                        checked={outputStyle === s}
                        onChange={() => setOutputStyle(s)}
                        className="accent-primary"
                      />
                      {s === "flat" ? "Flat (default)" : "Nested (split on .)"}
                    </label>
                  ))}
                </div>
              </ProField>

              <ProField label="Processing options">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={coerceTypes}
                      onChange={(e) => setCoerceTypes(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Coerce types (true/false, numbers, ISO dates)
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={trimStrings}
                      onChange={(e) => setTrimStrings(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Trim whitespace from string values
                  </label>
                </div>
              </ProField>
            </ProOptionsPanel>

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
