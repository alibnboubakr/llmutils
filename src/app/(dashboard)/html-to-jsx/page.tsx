"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

export default function HtmlToJsxPage() {
  const [html, setHtml] = useState("");
  const [jsx, setJsx] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToJsx = () => {
    if (!html) return;
    setLoading(true);

    try {
      let converted = html;

      // Basic HTML to JSX conversions
      // Convert class to className
      converted = converted.replace(/\bclass=/g, "className=");
      
      // Convert for to htmlFor
      converted = converted.replace(/\bfor=/g, "htmlFor=");
      
      // Self-closing tags
      converted = converted.replace(
        /<(img|input|br|hr|meta|link)([^>]*)(?<!\/)>/g,
        "<$1$2 />"
      );
      
      // Convert style attribute (basic)
      converted = converted.replace(
        /style="([^"]+)"/g,
        (match, style) => {
          const styleObj = style
            .split(";")
            .filter(Boolean)
            .map((s: string) => {
              const [prop, val] = s.split(":").map((s: string) => s.trim());
              const camelProp = prop.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
              return `  ${camelProp}: "${val}"`;
            })
            .join(",\n");
          return `style={{\n${styleObj}\n}}`;
        }
      );

      setJsx(converted);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsx);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">HTML to JSX</h1>
        <p className="text-muted-foreground mt-2">
          Convert HTML to JSX for React development with AI.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>HTML Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="<div class='container'><h1>Hello</h1></div>"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            <Button
              onClick={convertToJsx}
              disabled={loading || !html}
              className="w-full mt-4"
            >
              Convert to JSX
            </Button>
          </CardContent>
        </Card>

        {jsx && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>JSX Output</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md text-sm overflow-auto min-h-[300px] font-mono">
                {jsx}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
