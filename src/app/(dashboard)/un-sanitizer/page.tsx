"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw } from "lucide-react";

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

  const handleUnSanitize = () => {
    if (!input) return;

    let result = input;

    // Apply all replacements
    replacements.forEach(({ placeholder, original }) => {
      if (original) {
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

            <Button
              onClick={handleUnSanitize}
              disabled={!input || replacements.every((r) => !r.original)}
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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited un-sanitization</span>
      </div>
    </div>
  );
}
