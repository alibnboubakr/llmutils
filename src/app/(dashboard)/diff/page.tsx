"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

type DiffItem = {
  index: number;
  type: "added" | "removed" | "unchanged";
  text: string;
};

type Granularity = "line" | "word" | "character";
type Layout = "unified" | "side-by-side";

// Longest common subsequence on arrays of tokens.
function lcs<T>(a: T[], b: T[]): T[] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: T[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      result.unshift(a[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return result;
}

function diffTokens(
  tokensA: string[],
  tokensB: string[]
): DiffItem[] {
  const common = lcs(tokensA, tokensB);
  const result: DiffItem[] = [];
  let ia = 0;
  let ib = 0;
  let ic = 0;
  let idx = 0;

  while (ic < common.length) {
    // drain non-matching tokens before the next common token
    while (ia < tokensA.length && tokensA[ia] !== common[ic]) {
      result.push({ index: idx++, type: "removed", text: tokensA[ia++] });
    }
    while (ib < tokensB.length && tokensB[ib] !== common[ic]) {
      result.push({ index: idx++, type: "added", text: tokensB[ib++] });
    }
    // the common token itself
    result.push({ index: idx++, type: "unchanged", text: common[ic] });
    ia++;
    ib++;
    ic++;
  }
  // trailing tokens
  while (ia < tokensA.length) {
    result.push({ index: idx++, type: "removed", text: tokensA[ia++] });
  }
  while (ib < tokensB.length) {
    result.push({ index: idx++, type: "added", text: tokensB[ib++] });
  }

  return result;
}

function tokenize(text: string, granularity: Granularity): string[] {
  if (granularity === "line") return text.split("\n");
  if (granularity === "word") return text.match(/\S+|\s+/g) ?? [];
  return text.split("");
}

function normalize(text: string, ignoreWs: boolean, ignoreCase: boolean): string {
  let t = text;
  if (ignoreCase) t = t.toLowerCase();
  if (ignoreWs) t = t.replace(/\s+/g, " ").trim();
  return t;
}

function computeDiffItems(
  text1: string,
  text2: string,
  granularity: Granularity,
  ignoreWs: boolean,
  ignoreCase: boolean
): DiffItem[] {
  const norm1 = normalize(text1, ignoreWs, ignoreCase);
  const norm2 = normalize(text2, ignoreWs, ignoreCase);
  const tokensA = tokenize(norm1, granularity);
  const tokensB = tokenize(norm2, granularity);

  // For line granularity fall back to the simple loop (fast)
  if (granularity === "line") {
    const result: DiffItem[] = [];
    const maxLines = Math.max(tokensA.length, tokensB.length);
    for (let i = 0; i < maxLines; i++) {
      const a = tokensA[i];
      const b = tokensB[i];
      if (a === b) {
        result.push({ index: i, type: "unchanged", text: a || "" });
      } else {
        if (a !== undefined) result.push({ index: i, type: "removed", text: a });
        if (b !== undefined) result.push({ index: i, type: "added", text: b });
      }
    }
    return result;
  }

  return diffTokens(tokensA, tokensB);
}

// ---- Side-by-side layout helpers ----

type SideBySidePair = {
  left: DiffItem | null;
  right: DiffItem | null;
};

function buildSideBySide(items: DiffItem[]): SideBySidePair[] {
  const pairs: SideBySidePair[] = [];
  let i = 0;
  while (i < items.length) {
    const item = items[i];
    if (item.type === "unchanged") {
      pairs.push({ left: item, right: item });
      i++;
    } else if (item.type === "removed") {
      // look ahead for a matching "added"
      const next = items[i + 1];
      if (next && next.type === "added") {
        pairs.push({ left: item, right: next });
        i += 2;
      } else {
        pairs.push({ left: item, right: null });
        i++;
      }
    } else {
      pairs.push({ left: null, right: item });
      i++;
    }
  }
  return pairs;
}

export default function DiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffItem[]>([]);

  // Pro options
  const [granularity, setGranularity] = useState<Granularity>("line");
  const [ignoreWs, setIgnoreWs] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [layout, setLayout] = useState<Layout>("unified");

  const computeDiff = () => {
    const items = computeDiffItems(text1, text2, granularity, ignoreWs, ignoreCase);
    setDiff(items);
  };

  const sideBySidePairs = layout === "side-by-side" ? buildSideBySide(diff) : [];

  const cellCls = (type: DiffItem["type"] | "empty") =>
    type === "added"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : type === "removed"
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : type === "empty"
      ? "bg-muted/30"
      : "";

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

      <ProOptionsPanel
        title="Diff options"
        description="Granularity, whitespace, case, and layout"
        className="mb-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <ProField label="Granularity">
            <div className="flex flex-col gap-1.5">
              {(["line", "word", "character"] as Granularity[]).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="granularity"
                    value={g}
                    checked={granularity === g}
                    onChange={() => setGranularity(g)}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{g}</span>
                </label>
              ))}
            </div>
          </ProField>

          <ProField label="Layout">
            <div className="flex flex-col gap-1.5">
              {(["unified", "side-by-side"] as Layout[]).map((l) => (
                <label key={l} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="layout"
                    value={l}
                    checked={layout === l}
                    onChange={() => setLayout(l)}
                    className="accent-primary"
                  />
                  <span className="text-sm capitalize">{l.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          </ProField>

          <ProField label="Ignore whitespace">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreWs}
                onChange={(e) => setIgnoreWs(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm">Collapse / ignore whitespace differences</span>
            </label>
          </ProField>

          <ProField label="Ignore case">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreCase}
                onChange={(e) => setIgnoreCase(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm">Treat uppercase and lowercase as equal</span>
            </label>
          </ProField>
        </div>
      </ProOptionsPanel>

      <Button
        onClick={computeDiff}
        disabled={!text1 || !text2}
        className="w-full mb-6"
      >
        Compare
      </Button>

      {diff.length > 0 && layout === "unified" && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 font-mono text-sm">
              {diff.map((item) => (
                <div
                  key={item.index}
                  className={`flex gap-2 p-1 rounded ${cellCls(item.type)}`}
                >
                  <span className="text-muted-foreground w-8 text-right shrink-0">
                    {item.index + 1}
                  </span>
                  <span className="w-4 shrink-0">
                    {item.type === "added"
                      ? "+"
                      : item.type === "removed"
                      ? "-"
                      : " "}
                  </span>
                  <span className="flex-1 whitespace-pre-wrap break-all">
                    {item.text || "(empty)"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {diff.length > 0 && layout === "side-by-side" && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Result — Side by Side</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              <div className="font-semibold text-muted-foreground border-b pb-1">V1 (removed)</div>
              <div className="font-semibold text-muted-foreground border-b pb-1">V2 (added)</div>
              {sideBySidePairs.map((pair, idx) => (
                <>
                  <div
                    key={`l-${idx}`}
                    className={`p-1 rounded whitespace-pre-wrap break-all ${
                      pair.left ? cellCls(pair.left.type) : cellCls("empty")
                    }`}
                  >
                    {pair.left ? pair.left.text || "(empty)" : ""}
                  </div>
                  <div
                    key={`r-${idx}`}
                    className={`p-1 rounded whitespace-pre-wrap break-all ${
                      pair.right ? cellCls(pair.right.type) : cellCls("empty")
                    }`}
                  >
                    {pair.right ? pair.right.text || "(empty)" : ""}
                  </div>
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited comparisons</span>
      </div>
    </div>
  );
}
