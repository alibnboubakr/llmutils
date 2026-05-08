"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

export default function UnSanitizerPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [replacements, setReplacements] = useState<
    { placeholder: string; original: string }[]
  >([
    { placeholder: "***EMAIL_MASKED***", original: "" },
    { placeholder: "***PHONE_MASKED***", original: "" },
    { placeholder: "sk-***MASKED***", original: "" },
    { placeholder: "pk-***MASKED***", original: "" },
    { placeholder: "api_key_***MASKED***", original: "" },
  ]);

  // Pro options state
  const [bulkMappings, setBulkMappings] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [treatKeysAsRegex, setTreatKeysAsRegex] = useState(false);

  const handleUnSanitize = () => {
    if (!input) return;

    // Parse bulk mappings textarea
    const bulkParsed: { placeholder: string; original: string }[] = [];
    if (bulkMappings.trim()) {
      for (const line of bulkMappings.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        bulkParsed.push({
          placeholder: trimmed.slice(0, eqIdx),
          original: trimmed.slice(eqIdx + 1),
        });
      }
    }

    // Merge: existing replacements first, then bulk (bulk can override)
    const allReplacements = [...replacements, ...bulkParsed];

    let result = input;

    allReplacements.forEach(({ placeholder, original }) => {
      if (!placeholder || !original) return;

      if (treatKeysAsRegex) {
        try {
          const flags = caseInsensitive ? "gi" : "g";
          const regex = new RegExp(placeholder, flags);
          result = result.replace(regex, original);
        } catch {
          // Invalid regex — fall back to literal
          result = result.split(placeholder).join(original);
        }
      } else if (caseInsensitive) {
        // Case-insensitive literal replacement
        const flags = "gi";
        try {
          const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(escaped, flags);
          result = result.replace(regex, original);
        } catch {
          result = result.split(placeholder).join(original);
        }
      } else {
        result = result.split(placeholder).join(original);
      }
    });

    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const addReplacement = () => {
    setReplacements([
      ...replacements,
      { placeholder: "", original: "" },
    ]);
  };

  const updateReplacement = (
    index: number,
    field: "placeholder" | "original",
    value: string
  ) => {
    const newReplacements = [...replacements];
    newReplacements[index][field] = value;
    setReplacements(newReplacements);
  };

  const removeReplacement = (index: number) => {
    setReplacements(replacements.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Un-Sanitizer</h1>
        <p className="text-muted-foreground mt-2">
          Re-place the [REDACTED] text from LLM output with real data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sanitized Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste sanitized text with ***MASKED*** placeholders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] mb-4"
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Replacements</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addReplacement}
                >
                  Add Field
                </Button>
              </div>

              {replacements.map((rep, index) => (
                <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Replacement {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeReplacement(index)}
                      className="h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <Input
                    placeholder="Placeholder (e.g., ***EMAIL_MASKED***)"
                    value={rep.placeholder}
                    onChange={(e) =>
                      updateReplacement(index, "placeholder", e.target.value)
                    }
                    className="text-xs"
                  />
                  <Input
                    placeholder="Original value (e.g., user@example.com)"
                    value={rep.original}
                    onChange={(e) =>
                      updateReplacement(index, "original", e.target.value)
                    }
                    className="text-xs"
                  />
                </div>
              ))}
            </div>

            <ProOptionsPanel
              title="Advanced replacement"
              description="Bulk mappings, regex keys, case-insensitive match"
              className="mt-4"
            >
              <ProField label="Bulk mappings" hint="One placeholder=original per line">
                <Textarea
                  placeholder={"***EMAIL_MASKED***=alice@example.com\n***PHONE_MASKED***=555-1234"}
                  value={bulkMappings}
                  onChange={(e) => setBulkMappings(e.target.value)}
                  className="min-h-[100px] font-mono text-xs"
                />
              </ProField>

              <ProField label="Match options">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={caseInsensitive}
                      onChange={(e) => setCaseInsensitive(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Case-insensitive match
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={treatKeysAsRegex}
                      onChange={(e) => setTreatKeysAsRegex(e.target.checked)}
                      className="h-4 w-4 rounded border accent-primary"
                    />
                    Treat keys as regex patterns
                  </label>
                </div>
              </ProField>
            </ProOptionsPanel>

            <Button
              onClick={handleUnSanitize}
              disabled={!input || (replacements.every((r) => !r.original) && !bulkMappings.trim())}
              className="w-full mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Un-Sanitize
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Un-sanitized Output</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited un-sanitization</span>
      </div>
    </div>
  );
}
