"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Token pricing per 1K tokens (as of 2026)
const MODEL_PRICING: Record<string, { input: number; output: number; context: number }> = {
  "gpt-4o": { input: 0.005, output: 0.015, context: 128000 },
  "gpt-4-turbo": { input: 0.01, output: 0.03, context: 128000 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015, context: 16385 },
  "claude-3-opus": { input: 0.015, output: 0.075, context: 200000 },
  "claude-3-sonnet": { input: 0.003, output: 0.015, context: 200000 },
  "claude-3-haiku": { input: 0.00025, output: 0.00125, context: 200000 },
};

// Simple token estimation (roughly 4 chars per token for English)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export default function TokenEstimatorPage() {
  const [text, setText] = useState("");
  const [model, setModel] = useState("gpt-4o");
  const [outputTokens, setOutputTokens] = useState(500);

  const inputTokens = estimateTokens(text);
  const pricing = MODEL_PRICING[model];
  const contextWindow = pricing?.context || 128000;

  const inputCost = (inputTokens / 1000) * (pricing?.input || 0);
  const outputCost = (outputTokens / 1000) * (pricing?.output || 0);
  const totalCost = inputCost + outputCost;

  const percentUsed = (inputTokens / contextWindow) * 100;

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

      <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
        <Badge variant="secondary">Free: 5 uses/day</Badge>
        <span>Upgrade to Pro for unlimited estimations</span>
      </div>
    </div>
  );
}
