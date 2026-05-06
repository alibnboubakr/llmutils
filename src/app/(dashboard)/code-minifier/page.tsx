"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Minimize2, Maximize2 } from "lucide-react";

export default function CodeMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "unminify">("minify");

  const minifyCode = () => {
    if (!input) return;
    
    let minified = input;
    
    if (mode === "minify") {
      // Remove comments (single-line and multi-line)
      minified = minified.replace(/\/\*[\s\S]*?\*\//g, "");
      minified = minified.replace(/\/\/.*/g, "");
      
      // Remove whitespace
      minified = minified
        .replace(/\s+/g, " ")
        .replace(/\s*([{}:;,=+\-*/<>!&|?]+)\s*/g, "$1")
        .trim();
    } else {
      // Basic unminify (format with indentation)
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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited processing</span>
      </div>
    </div>
  );
}
