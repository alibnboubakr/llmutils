"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[400px] prose prose-invert max-w-none prose-sm overflow-auto">
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
