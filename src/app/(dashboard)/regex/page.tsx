"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy } from "lucide-react";

export default function RegexPage() {
  const [english, setEnglish] = useState("");
  const [regex, setRegex] = useState("");
  const [flags, setFlags] = useState("g");
  const [loading, setLoading] = useState(false);
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);

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
      const re = new RegExp(pattern, flags);
      const found = testString.match(re);
      setMatches(found || []);
    } catch (e) {
      setMatches([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`/${regex}/${flags}`);
  };

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
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md font-mono text-sm">
                /{regex}/{flags}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Flags:</p>
                <Input
                  value={flags}
                  onChange={(e) => {
                    setFlags(e.target.value);
                    testMatches(regex);
                  }}
                  placeholder="g, i, m, etc."
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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited generations</span>
      </div>
    </div>
  );
}
