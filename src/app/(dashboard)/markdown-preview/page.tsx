"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Theme = "default" | "sepia" | "dracula" | "github";
type ReadingWidth = "narrow" | "medium" | "wide";
type FontFamily = "sans" | "serif" | "mono";

const themeClasses: Record<Theme, string> = {
  default: "prose prose-invert max-w-none prose-sm",
  sepia:
    "prose max-w-none prose-sm bg-amber-50 text-amber-900 prose-headings:text-amber-950 prose-a:text-amber-700 rounded-md p-2",
  dracula:
    "prose max-w-none prose-sm bg-[#282a36] text-[#f8f8f2] prose-headings:text-[#bd93f9] prose-a:text-[#8be9fd] prose-code:text-[#50fa7b] rounded-md p-2",
  github:
    "prose max-w-none prose-sm bg-white text-gray-900 prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-blue-600 rounded-md p-2",
};

const widthClasses: Record<ReadingWidth, string> = {
  narrow: "max-w-[45rem]",
  medium: "max-w-[65rem]",
  wide: "max-w-[90rem]",
};

const fontClasses: Record<FontFamily, string> = {
  sans: "font-sans",
  serif: "font-serif",
  mono: "font-mono",
};

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(`# Sample Markdown

This is a **bold text** and this is *italic*.

## Features
- Renders LLM output
- Supports GitHub Flavored Markdown
- Live preview

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

> This is a blockquote from an LLM response.

Check out [LLMUtils](https://llmutils.co) for more tools!
`);

  // Pro options
  const [theme, setTheme] = useState<Theme>("default");
  const [readingWidth, setReadingWidth] = useState<ReadingWidth>("medium");
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [syntaxHighlight, setSyntaxHighlight] = useState(true);

  const previewClasses = [
    "min-h-[400px] overflow-auto",
    themeClasses[theme],
    widthClasses[readingWidth],
    fontClasses[fontFamily],
    !syntaxHighlight ? "[&_pre]:bg-muted [&_code]:bg-muted" : "[&_pre]:bg-zinc-900 [&_pre]:p-3 [&_pre]:rounded [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:rounded",
  ].join(" ");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Markdown Preview</h1>
        <p className="text-muted-foreground mt-2">
          Render LLM markdown output with live preview.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input (Markdown)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />

            <ProOptionsPanel
              title="Preview options"
              description="Theme, reading width, font, and syntax highlighting"
              className="mt-4"
            >
              <ProField label="Theme">
                <Select
                  value={theme}
                  onValueChange={(v) => setTheme(v as Theme)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default (dark)</SelectItem>
                    <SelectItem value="sepia">Sepia (warm)</SelectItem>
                    <SelectItem value="dracula">Dracula (purple dark)</SelectItem>
                    <SelectItem value="github">GitHub (clean white)</SelectItem>
                  </SelectContent>
                </Select>
              </ProField>

              <ProField label="Reading width">
                <Select
                  value={readingWidth}
                  onValueChange={(v) => setReadingWidth(v as ReadingWidth)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="narrow">Narrow (45rem)</SelectItem>
                    <SelectItem value="medium">Medium — 65rem (default)</SelectItem>
                    <SelectItem value="wide">Wide (90rem)</SelectItem>
                  </SelectContent>
                </Select>
              </ProField>

              <ProField label="Font">
                <Select
                  value={fontFamily}
                  onValueChange={(v) => setFontFamily(v as FontFamily)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">Sans-serif (default)</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </ProField>

              <ProField label="Syntax highlighting" hint="Applies a darker background to code blocks">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={syntaxHighlight}
                    onChange={(e) => setSyntaxHighlight(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm">Enable code block highlighting</span>
                </label>
              </ProField>
            </ProOptionsPanel>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={previewClasses}>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited previews and export options</span>
      </div>
    </div>
  );
}
