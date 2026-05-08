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
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

// Force dynamic rendering to avoid SSR issues with Zustand
export const dynamic = 'force-dynamic';

type MaskStyle = "***" | "[REDACTED]" | "[XXXX-XXXX]" | "hash";

type Categories = {
  email: boolean;
  phone: boolean;
  api_key: boolean;
  credit_card: boolean;
  ip: boolean;
};

function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 8);
}

function buildReplacement(matched: string, style: MaskStyle, preserveLength: boolean): string {
  if (style === "***") {
    return preserveLength ? "*".repeat(matched.length) : "***";
  }
  if (style === "[REDACTED]") return "[REDACTED]";
  if (style === "[XXXX-XXXX]") {
    return matched.replace(/[a-zA-Z0-9]/g, "X");
  }
  if (style === "hash") {
    return `[h:${djb2Hash(matched)}]`;
  }
  return "***";
}

function maskPII(
  text: string,
  maskStyle: MaskStyle,
  preserveLength: boolean,
  categories: Categories,
  customPatterns: string
): string {
  let masked = text;

  const replace = (regex: RegExp) => {
    masked = masked.replace(regex, (m) => buildReplacement(m, maskStyle, preserveLength));
  };

  // api_key category
  if (categories.api_key) {
    replace(/sk-[a-zA-Z0-9]{32,}/g);
    replace(/pk-[a-zA-Z0-9]{32,}/g);
    replace(/api[_-]?key[_-]?[a-zA-Z0-9]{16,}/gi);
  }

  // email category
  if (categories.email) {
    replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  }

  // phone category
  if (categories.phone) {
    replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g);
  }

  // credit_card category
  if (categories.credit_card) {
    replace(/\b(?:\d[ -]?){13,19}\b/g);
  }

  // ip category
  if (categories.ip) {
    replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);
  }

  // Custom patterns
  if (customPatterns.trim()) {
    const lines = customPatterns.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      try {
        let regex: RegExp;
        const flagMatch = line.match(/^\/(.+)\/([gimsuy]*)$/);
        if (flagMatch) {
          regex = new RegExp(flagMatch[1], flagMatch[2] || "g");
        } else {
          regex = new RegExp(line, "g");
        }
        replace(regex);
      } catch {
        // Invalid regex — skip silently
      }
    }
  }

  return masked;
}

export default function SanitizePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToHistory, setPipelineOutput } = useToolStore();
  const router = useRouter();

  // Pro options state
  const [maskStyle, setMaskStyle] = useState<MaskStyle>("***");
  const [preserveLength, setPreserveLength] = useState(false);
  const [customPatterns, setCustomPatterns] = useState("");
  const [categories, setCategories] = useState<Categories>({
    email: true,
    phone: true,
    api_key: true,
    credit_card: true,
    ip: true,
  });

  const toggleCategory = (key: keyof Categories) => {
    setCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSanitize = () => {
    if (!input) return;
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const sanitized = maskPII(input, maskStyle, preserveLength, categories, customPatterns);
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

            <ProOptionsPanel
              title="Fine-tune masking"
              description="Custom mask style, categories, and extra patterns"
              className="mt-4"
            >
              <ProField label="Mask style">
                <select
                  value={maskStyle}
                  onChange={(e) => setMaskStyle(e.target.value as MaskStyle)}
                  className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                >
                  <option value="***">*** (default)</option>
                  <option value="[REDACTED]">[REDACTED]</option>
                  <option value="[XXXX-XXXX]">[XXXX-XXXX] (preserve length)</option>
                  <option value="hash">hash (8-char hex)</option>
                </select>
              </ProField>

              <ProField label="Preserve length" hint="Replace each character with * (only applies to *** style)">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={preserveLength}
                    onChange={(e) => setPreserveLength(e.target.checked)}
                    className="h-4 w-4 rounded border accent-primary"
                  />
                  Match masked length to original
                </label>
              </ProField>

              <ProField label="Categories" hint="Disable to skip masking that category">
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(categories) as (keyof Categories)[]).map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={categories[cat]}
                        onChange={() => toggleCategory(cat)}
                        className="h-4 w-4 rounded border accent-primary"
                      />
                      {cat.replace("_", " ")}
                    </label>
                  ))}
                </div>
              </ProField>

              <ProField label="Custom patterns" hint="One JS regex per line. Use /pattern/flags or plain text.">
                <Textarea
                  placeholder={"/my-secret-\\w+/g\nCONFIDENTIAL"}
                  value={customPatterns}
                  onChange={(e) => setCustomPatterns(e.target.value)}
                  className="min-h-[80px] font-mono text-xs"
                />
              </ProField>
            </ProOptionsPanel>

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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited sanitization</span>
      </div>
    </div>
  );
}
