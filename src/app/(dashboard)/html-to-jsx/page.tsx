"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

const VOID_ELEMENTS = ["br", "hr", "img", "input", "meta", "link"];

const EVENT_HANDLER_MAP: Record<string, string> = {
  onclick: "onClick",
  onchange: "onChange",
  onsubmit: "onSubmit",
  onmouseover: "onMouseOver",
  onmouseout: "onMouseOut",
  onmousedown: "onMouseDown",
  onmouseup: "onMouseUp",
  onfocus: "onFocus",
  onblur: "onBlur",
  onkeydown: "onKeyDown",
  onkeyup: "onKeyUp",
  onkeypress: "onKeyPress",
};

export default function HtmlToJsxPage() {
  const [html, setHtml] = useState("");
  const [jsx, setJsx] = useState("");
  const [loading, setLoading] = useState(false);

  // Pro options
  const [convertEventHandlers, setConvertEventHandlers] = useState(false);
  const [wrapInComponent, setWrapInComponent] = useState(false);
  const [componentName, setComponentName] = useState("MyComponent");
  const [typescriptOutput, setTypescriptOutput] = useState(false);
  const [selfCloseVoid, setSelfCloseVoid] = useState(true);

  const convertToJsx = () => {
    if (!html) return;
    setLoading(true);

    try {
      let converted = html;

      // Convert class to className
      converted = converted.replace(/\bclass=/g, "className=");

      // Convert for to htmlFor
      converted = converted.replace(/\bfor=/g, "htmlFor=");

      // Self-closing void elements (always run, toggled by selfCloseVoid)
      if (selfCloseVoid) {
        const voidPattern = new RegExp(
          `<(${VOID_ELEMENTS.join("|")})([^>]*)(?<!\\/)>`,
          "gi"
        );
        converted = converted.replace(voidPattern, "<$1$2 />");
      }

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

      // Pro: convert event handlers
      if (convertEventHandlers) {
        converted = converted.replace(
          /\b(on[a-z]+)=/gi,
          (match, attr: string) => {
            const lower = attr.toLowerCase();
            return (EVENT_HANDLER_MAP[lower] ?? attr) + "=";
          }
        );
      }

      // Pro: wrap in component
      if (wrapInComponent) {
        const safeName = componentName.trim().replace(/[^a-zA-Z0-9_$]/g, "") || "MyComponent";
        const returnType = typescriptOutput ? ": JSX.Element" : "";
        const indented = converted
          .split("\n")
          .map((line) => "    " + line)
          .join("\n");
        converted = `function ${safeName}()${returnType} {\n  return (\n${indented}\n  );\n}`;
      }

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

            <ProOptionsPanel
              title="Conversion options"
              description="Event handlers, component wrap, TypeScript, void elements"
              className="mt-4"
            >
              <ProField label="Self-close void elements" hint="Ensures <br>, <hr>, <img>, <input>, <meta>, <link> are self-closing">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selfCloseVoid}
                    onChange={(e) => setSelfCloseVoid(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm">Auto-close void elements (default on)</span>
                </label>
              </ProField>

              <ProField label="Convert event handlers" hint="Maps onclick → onClick, onchange → onChange, etc.">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={convertEventHandlers}
                    onChange={(e) => setConvertEventHandlers(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  <span className="text-sm">Convert HTML event attributes to React camelCase</span>
                </label>
              </ProField>

              <ProField label="Wrap in component">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wrapInComponent}
                      onChange={(e) => setWrapInComponent(e.target.checked)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Wrap JSX in a function component</span>
                  </label>
                  {wrapInComponent && (
                    <Input
                      value={componentName}
                      onChange={(e) => setComponentName(e.target.value)}
                      placeholder="Component name"
                      className="w-48 text-sm"
                    />
                  )}
                </div>
              </ProField>

              {wrapInComponent && (
                <ProField label="TypeScript output" hint="Adds : JSX.Element return type annotation">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={typescriptOutput}
                      onChange={(e) => setTypescriptOutput(e.target.checked)}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Generate TypeScript function signature</span>
                  </label>
                </ProField>
              )}
            </ProOptionsPanel>

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

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited conversions</span>
      </div>
    </div>
  );
}
