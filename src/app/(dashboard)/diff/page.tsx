"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<{ line: number; type: "added" | "removed" | "unchanged"; text: string }[]>([]);

  const computeDiff = () => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: { line: number; type: "added" | "removed" | "unchanged"; text: string }[] = [];

    const maxLines = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === line2) {
        result.push({ line: i + 1, type: "unchanged", text: line1 || "" });
      } else {
        if (line1 !== undefined) {
          result.push({ line: i + 1, type: "removed", text: line1 });
        }
        if (line2 !== undefined) {
          result.push({ line: i + 1, type: "added", text: line2 });
        }
      }
    }

    setDiff(result);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Diff Tool</h1>
        <p className="text-muted-foreground mt-2">
          Compare Prompt V1 vs V2 to see what changed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Prompt V1</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste first version here..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt V2</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste second version here..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[300px]"
            />
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={computeDiff}
        disabled={!text1 || !text2}
        className="w-full mb-6"
      >
        Compare
      </Button>

      {diff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 font-mono text-sm">
              {diff.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-2 p-1 rounded ${
                    item.type === "added"
                      ? "bg-green-500/10 text-green-500"
                      : item.type === "removed"
                      ? "bg-red-500/10 text-red-500"
                      : ""
                  }`}
                >
                  <span className="text-muted-foreground w-8 text-right">
                    {item.line}
                  </span>
                  <span className="w-4">
                    {item.type === "added" ? "+" : item.type === "removed" ? "-" : " "}
                  </span>
                  <span className="flex-1">{item.text || "(empty line)"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited comparisons</span>
      </div>
    </div>
  );
}
