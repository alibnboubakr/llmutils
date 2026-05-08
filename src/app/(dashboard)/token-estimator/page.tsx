"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolUsageTip } from "@/components/tool-usage-tip";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProOptionsPanel, ProField } from "@/components/pro-options-panel";

// Token pricing per 1K tokens (as of 2026)
const MODEL_PRICING: Record<string, { input: number; output: number; context: number }> = {
  "gpt-4o": { input: 0.005, output: 0.015, context: 128000 },
  "gpt-4-turbo": { input: 0.01, output: 0.03, context: 128000 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015, context: 16385 },
  "claude-3-opus": { input: 0.015, output: 0.075, context: 200000 },
  "claude-3-sonnet": { input: 0.003, output: 0.015, context: 200000 },
  "claude-3-haiku": { input: 0.00025, output: 0.00125, context: 200000 },
};

// Pro multi-model pricing ($/1M tokens, Q4-2025 approximate)
const PRO_MODEL_PRICING: Record<string, { label: string; inputPerM: number; outputPerM: number }> = {
  "gpt-4o":          { label: "GPT-4o",           inputPerM: 5.00,  outputPerM: 15.00 },
  "gpt-4":           { label: "GPT-4",             inputPerM: 30.00, outputPerM: 60.00 },
  "gpt-3.5":         { label: "GPT-3.5 Turbo",     inputPerM: 0.50,  outputPerM: 1.50  },
  "claude-sonnet":   { label: "Claude Sonnet",     inputPerM: 3.00,  outputPerM: 15.00 },
  "claude-haiku":    { label: "Claude Haiku",      inputPerM: 0.25,  outputPerM: 1.25  },
  "gemini-1.5-pro":  { label: "Gemini 1.5 Pro",   inputPerM: 3.50,  outputPerM: 10.50 },
};

const ALL_PRO_MODEL_KEYS = Object.keys(PRO_MODEL_PRICING);
const DEFAULT_PRO_MODELS = ["gpt-4o", "claude-sonnet"];

// Simple token estimation (roughly 4 chars per token for English)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export default function TokenEstimatorPage() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [outputTokens, setOutputTokens] = useState(500);

  // Pro options
  const [selectedProModels, setSelectedProModels] = useState<string[]>(DEFAULT_PRO_MODELS);
  const [perParagraph, setPerParagraph] = useState(false);
  const [outputMultiplier, setOutputMultiplier] = useState(1);

  const inputTokens = estimateTokens(text);
  const pricing = MODEL_PRICING[model];
  const contextWindow = pricing?.context || 128000;

  const inputCost = (inputTokens / 1000) * (pricing?.input || 0);
  const outputCost = (outputTokens / 1000) * (pricing?.output || 0);
  const totalCost = inputCost + outputCost;

  const percentUsed = (inputTokens / contextWindow) * 100;

  function toggleProModel(key: string) {
    setSelectedProModels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  // Paragraph breakdown
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Pro model comparison rows
  const proModelRows = selectedProModels.map((key) => {
    const m = PRO_MODEL_PRICING[key];
    const estInput = inputTokens;
    const estOutput = Math.round(inputTokens * outputMultiplier);
    const inputCostM = (estInput / 1_000_000) * m.inputPerM;
    const outputCostM = (estOutput / 1_000_000) * m.outputPerM;
    return { key, label: m.label, estInput, estOutput, totalCost: inputCostM + outputCostM };
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Token & Cost Estimator</h1>
        <p className="text-muted-foreground mt-2">
          Paste text and select a model to see token count and estimated API cost.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your prompt or context here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[300px] mb-4"
            />

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Expected Output Tokens: {outputTokens}
                </label>
                <input
                  type="range"
                  min="0"
                  max="4096"
                  value={outputTokens}
                  onChange={(e) => setOutputTokens(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4">
              <ProOptionsPanel
                title="Multi-model comparison"
                description="Compare costs across models with richer breakdown options."
              >
                <ProField label="Models to compare">
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_PRO_MODEL_KEYS.map((key) => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProModels.includes(key)}
                          onChange={() => toggleProModel(key)}
                          className="accent-primary"
                        />
                        {PRO_MODEL_PRICING[key].label}
                      </label>
                    ))}
                  </div>
                </ProField>

                <ProField
                  label="Output multiplier"
                  hint="Assumed output : input token ratio for cost estimate (default 1×)."
                >
                  <input
                    type="number"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={outputMultiplier}
                    onChange={(e) => setOutputMultiplier(Number(e.target.value))}
                    className="w-24 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </ProField>

                <ProField label="Per-paragraph breakdown">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={perParagraph}
                      onChange={(e) => setPerParagraph(e.target.checked)}
                      className="accent-primary"
                    />
                    Show token count per paragraph
                  </label>
                </ProField>
              </ProOptionsPanel>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Token Counts */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Input Tokens</span>
                  <span className="font-mono font-semibold">
                    {inputTokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Output Tokens</span>
                  <span className="font-mono font-semibold">
                    {outputTokens.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tokens</span>
                  <span className="font-mono font-semibold">
                    {(inputTokens + outputTokens).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Context Window Usage */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Context Window</span>
                  <span className="text-sm">
                    {contextWindow.toLocaleString()} tokens
                  </span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentUsed > 80 ? "bg-destructive" : "bg-primary"
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {percentUsed.toFixed(1)}% of context window used
                </p>
              </div>

              {/* Cost Estimation */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Estimated Cost (USD)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Input Cost</span>
                    <span className="font-mono">${inputCost.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Output Cost</span>
                    <span className="font-mono">${outputCost.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Cost</span>
                    <span className="font-mono text-primary">
                      ${totalCost.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Model Pricing Info */}
              <div className="bg-muted/50 p-3 rounded-md text-xs">
                <p className="font-medium mb-1">Pricing per 1K tokens:</p>
                <p>Input: ${pricing?.input.toFixed(4) || "N/A"}</p>
                <p>Output: ${pricing?.output.toFixed(4) || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro: Multi-model comparison table */}
      {selectedProModels.length > 0 && text.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Multi-model comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4">Model</th>
                    <th className="text-right py-2 pr-4">Est. Input Tokens</th>
                    <th className="text-right py-2 pr-4">Est. Output Tokens</th>
                    <th className="text-right py-2">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {proModelRows.map((row) => (
                    <tr key={row.key} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{row.label}</td>
                      <td className="text-right py-2 pr-4 font-mono">{row.estInput.toLocaleString()}</td>
                      <td className="text-right py-2 pr-4 font-mono">{row.estOutput.toLocaleString()}</td>
                      <td className="text-right py-2 font-mono text-primary">${row.totalCost.toFixed(5)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Output tokens = input × {outputMultiplier}× multiplier. Prices approximate Q4 2025.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pro: Per-paragraph breakdown */}
      {perParagraph && text.length > 0 && paragraphs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Per-paragraph breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left py-2 pr-4">#</th>
                    <th className="text-right py-2 pr-4">Chars</th>
                    <th className="text-right py-2">Est. Tokens</th>
                  </tr>
                </thead>
                <tbody>
                  {paragraphs.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-4 text-muted-foreground">{i + 1}</td>
                      <td className="text-right py-2 pr-4 font-mono">{p.length.toLocaleString()}</td>
                      <td className="text-right py-2 font-mono">{estimateTokens(p).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <ToolUsageTip />

<div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 10 uses/day</Badge>
        <span>Upgrade to Pro for unlimited estimations</span>
      </div>
    </div>
  );
}
