"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";
import { SavePromptButton } from "@/components/save-prompt-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OutputFormat = "pattern" | "js" | "python";

const ALL_FLAGS = ["g", "i", "m", "s", "u", "y"] as const;
type RegexFlag = (typeof ALL_FLAGS)[number];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHighlightedHtml(text: string, pattern: string, flagStr: string): string {
  if (!pattern) return escapeHtml(text);
  try {
    // Ensure we always have "g" so matchAll works
    const safeFlags = flagStr.includes("g") ? flagStr : flagStr + "g";
    const re = new RegExp(pattern, safeFlags);
    let result = "";
    let lastIndex = 0;
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      result += escapeHtml(text.slice(lastIndex, start));
      result += `<mark class="bg-yellow-300 text-black rounded px-0.5">${escapeHtml(m[0])}</mark>`;
      lastIndex = start + m[0].length;
      if (m[0].length === 0) lastIndex++; // avoid infinite loop on zero-width matches
    }
    result += escapeHtml(text.slice(lastIndex));
    return result;
  } catch {
    return escapeHtml(text);
  }
}

export default function RegexPage() {
  const [english, setEnglish] = useState("");
  const [regex, setRegex] = useState("");
  const [loading, setLoading] = useState(false);
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

  // Pro options
  const [selectedFlags, setSelectedFlags] = useState<Set<RegexFlag>>(
    new Set(["g", "i"])
  );
  const [liveTestText, setLiveTestText] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pattern");

  const flagStr = ALL_FLAGS.filter((f) => selectedFlags.has(f)).join("");

  const toggleFlag = (flag: RegexFlag) => {
    setSelectedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  // Simple English to regex converter (basic patterns)
  const convertToRegex = () => {
    if (!english) return;
    setLoading(true);

    try {
      let pattern = english;

      // Common patterns
      if (/email/i.test(english)) {
        pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
      } else if (/phone/i.test(english)) {
        pattern = "[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}";
      } else if (/url/i.test(english)) {
        pattern = "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)";
      } else if (/number/i.test(english)) {
        pattern = "\\d+";
      } else if (/word/i.test(english)) {
        pattern = "\\w+";
      } else {
        // Escape special characters and convert simple patterns
        pattern = pattern
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\\d/g, "[0-9]")
          .replace(/\\w/g, "[a-zA-Z0-9_]");
      }

      setRegex(pattern);
      testMatches(pattern);
    } finally {
      setLoading(false);
    }
  };

  const testMatches = (pattern: string) => {
    try {
      const re = new RegExp(pattern, flagStr);
      const found = testString.match(re);
      setMatches(found || []);
    } catch {
      setMatches([]);
    }
  };

  const getFormattedOutput = () => {
    if (!regex) return "";
    if (outputFormat === "js") {
      return `const re = /${regex}/${flagStr};`;
    }
    if (outputFormat === "python") {
      return `import re\npattern = re.compile(r"${regex}"${flagStr ? `, re.${flagStr.toUpperCase().split("").join(" | re.")}` : ""})`;
    }
    return `/${regex}/${flagStr}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedOutput());
  };

  const highlightedHtml = buildHighlightedHtml(liveTestText, regex, flagStr);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">English to Regex</h1>
        <p className="text-muted-foreground mt-2">
          Describe what you want to match in English, get a regex pattern.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="e.g., match email addresses, phone numbers, URLs..."
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                className="min-h-[100px]"
              />

              <ProOptionsPanel
                title="Regex options"
                description="Flags, live test, and output format"
              >
                <ProField label="Flags" hint="Active flags are applied to the generated regex">
                  <div className="flex flex-wrap gap-3">
                    {ALL_FLAGS.map((flag) => (
                      <label key={flag} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFlags.has(flag)}
                          onChange={() => toggleFlag(flag)}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                        <span className="text-sm font-mono">{flag}</span>
                      </label>
                    ))}
                  </div>
                </ProField>

                <ProField label="Output as">
                  <Select
                    value={outputFormat}
                    onValueChange={(v) => setOutputFormat(v as OutputFormat)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pattern">Pattern (default)</SelectItem>
                      <SelectItem value="js">JavaScript snippet</SelectItem>
                      <SelectItem value="python">Python snippet</SelectItem>
                    </SelectContent>
                  </Select>
                </ProField>

                <ProField label="Live test" hint="Type here to see matches highlighted in real-time">
                  <Textarea
                    placeholder="Paste text to test against the generated regex…"
                    value={liveTestText}
                    onChange={(e) => setLiveTestText(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  {liveTestText && regex && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Highlighted matches:</p>
                      <pre
                        className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap font-mono overflow-auto"
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                      />
                    </div>
                  )}
                </ProField>
              </ProOptionsPanel>

              <Button
                onClick={convertToRegex}
                disabled={loading || !english}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Generate Regex
              </Button>
            </div>
          </CardContent>
        </Card>

        {regex && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Regex</CardTitle>
              <div className="flex gap-2">
                <SavePromptButton content={regex} tool="regex" />
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                {getFormattedOutput()}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Flags:</p>
                <Input
                  value={flagStr}
                  readOnly
                  placeholder="Select flags in Pro options"
                  className="bg-muted/50"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {regex && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Your Regex</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter test string here..."
              value={testString}
              onChange={(e) => {
                setTestString(e.target.value);
                testMatches(regex);
              }}
              className="min-h-[100px] mb-4"
            />
            {matches.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">
                  Matches ({matches.length}):
                </p>
                <div className="space-y-1">
                  {matches.map((match, i) => (
                    <div key={i} className="bg-muted p-2 rounded text-sm">
                      {match}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited generations</span>
      </div>
    </div>
  );
}
