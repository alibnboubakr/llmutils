"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Copy, Minimize2, Maximize2 } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

// Pro options state
type CompressionLevel = "basic" | "aggressive";

export default function CodeMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "unminify">("minify");

  // Pro options
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>("basic");
  const [preserveLicenseComments, setPreserveLicenseComments] = useState(true);
  const [mangleIdentifiers, setMangleIdentifiers] = useState(false);

  const minifyCode = () => {
    if (!input) return;

    let minified = input;

    if (mode === "minify") {
      // Extract and stash license/preserve comments before stripping if option is on
      const licenseComments: string[] = [];
      if (preserveLicenseComments) {
        let idx = 0;
        minified = minified.replace(/\/\*(!|[\s\S]*?@license[\s\S]*?|[\s\S]*?@preserve[\s\S]*?)\*\//g, (match) => {
          licenseComments.push(match);
          return `__LICENSE_COMMENT_${idx++}__`;
        });
      }

      // Remove remaining multi-line comments
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, "");
      // Remove single-line comments
      minified = minified.replace(/\/\/.*/g, "");

      if (compressionLevel === "basic") {
        // Original behavior
        minified = minified
          .replace(/\s+/g, " ")
          .replace(/\s*([{}:;,=+\-*/<>!&|?]+)\s*/g, "$1")
          .trim();
      } else {
        // Aggressive compression
        // Remove blank lines
        minified = minified.replace(/^\s*[\r\n]/gm, "");
        // Trim trailing whitespace from each line
        minified = minified.replace(/[ \t]+$/gm, "");
        // Collapse whitespace
        minified = minified
          .replace(/\s+/g, " ")
          .replace(/\s*([{}:;,=+\-*/<>!&|?]+)\s*/g, "$1")
          .trim();
        // Drop trailing semicolons before }
        minified = minified.replace(/;}/g, "}");
        // Collapse multiple semicolons
        minified = minified.replace(/;{2,}/g, ";");
      }

      // Mangle short identifiers: replace `var __t = ` style patterns
      if (mangleIdentifiers) {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        let charIdx = 0;
        const seen = new Map<string, string>();
        minified = minified.replace(/\b(__[a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
          if (!seen.has(match)) {
            const replacement = charIdx < letters.length
              ? `_${letters[charIdx++]}`
              : `_${letters[Math.floor(charIdx / letters.length) - 1]}${letters[charIdx++ % letters.length]}`;
            seen.set(match, replacement);
          }
          return seen.get(match)!;
        });
      }

      // Restore license comments
      if (preserveLicenseComments && licenseComments.length > 0) {
        licenseComments.forEach((comment, i) => {
          minified = minified.replace(`__LICENSE_COMMENT_${i}__`, comment + " ");
        });
      }
    } else {
      // Basic unminify (format with indentation) — unchanged
      let indent = 0;
      const lines = minified.split("");
      let formatted = "";

      for (let i = 0; i < lines.length; i++) {
        const char = lines[i];

        if (char === "}" || char === "]") {
          indent = Math.max(0, indent - 1);
          formatted += "\n" + "  ".repeat(indent) + char;
        } else if (char === "{" || char === "[") {
          formatted += " {\n" + "  ".repeat(indent + 1);
          indent++;
        } else if (char === ";") {
          formatted += ";\n" + "  ".repeat(indent);
        } else {
          formatted += char;
        }
      }

      minified = formatted;
    }

    setOutput(minified);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const stats = {
    original: input.length,
    processed: output.length,
    saved: input.length - output.length,
    percent: input.length > 0 ? ((input.length - output.length) / input.length * 100).toFixed(1) : 0,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Code Minifier / Un-minifier</h1>
        <p className="text-muted-foreground mt-2">
          Minify code to save tokens, or unminify to make it readable.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button
          variant={mode === "minify" ? "default" : "outline"}
          onClick={() => setMode("minify")}
        >
          <Minimize2 className="h-4 w-4 mr-2" />
          Minify
        </Button>
        <Button
          variant={mode === "unminify" ? "default" : "outline"}
          onClick={() => setMode("unminify")}
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Unminify
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={mode === "minify" ? "Paste code to minify..." : "Paste minified code..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />

            {mode === "minify" && (
              <div className="mt-4">
                <ProOptionsPanel
                  title="Compression options"
                  description="Fine-tune how aggressively the minifier compresses your code."
                >
                  <ProField label="Compression level">
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="compressionLevel"
                          value="basic"
                          checked={compressionLevel === "basic"}
                          onChange={() => setCompressionLevel("basic")}
                          className="accent-primary"
                        />
                        Basic
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="radio"
                          name="compressionLevel"
                          value="aggressive"
                          checked={compressionLevel === "aggressive"}
                          onChange={() => setCompressionLevel("aggressive")}
                          className="accent-primary"
                        />
                        Aggressive
                      </label>
                    </div>
                  </ProField>

                  <ProField
                    label="Preserve license comments"
                    hint="Keeps /*! … */, /* @license … */ and /* @preserve … */ blocks."
                  >
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preserveLicenseComments}
                        onChange={(e) => setPreserveLicenseComments(e.target.checked)}
                        className="accent-primary"
                      />
                      Keep license / preserve comments
                    </label>
                  </ProField>

                  <ProField
                    label="Mangle short identifiers"
                    hint="Renames __double_underscore identifiers to short single letters (best-effort)."
                  >
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mangleIdentifiers}
                        onChange={(e) => setMangleIdentifiers(e.target.checked)}
                        className="accent-primary"
                      />
                      Mangle identifiers prefixed with __
                    </label>
                  </ProField>
                </ProOptionsPanel>
              </div>
            )}

            <Button
              onClick={minifyCode}
              disabled={!input}
              className="w-full mt-4"
            >
              {mode === "minify" ? "Minify Code" : "Unminify Code"}
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Output</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px] font-mono">
                {output}
              </pre>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>Original: {stats.original} chars</p>
                <p>Processed: {stats.processed} chars</p>
                {mode === "minify" && (
                  <p className="text-green-500">
                    Saved: {stats.saved} chars ({stats.percent}%)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited processing</span>
      </div>
    </div>
  );
}
