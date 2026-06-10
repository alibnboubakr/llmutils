"use client";

import { useMemo, useState } from "react";
import { gradePrompt, EXAMPLE_PROMPTS } from "@/lib/engine";
import { encodeShare, DIMENSION_ORDER } from "@/lib/share";
import { ScoreDial } from "./score-dial";
import { DimensionBars } from "./dimension-bars";

const SEVERITY_STYLE: Record<string, string> = {
  high: "bg-red-500/15 text-red-300 border-red-500/30",
  medium: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  low: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export function Grader() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<"link" | "prompt" | null>(null);

  const result = useMemo(
    () => (text.trim().length > 0 ? gradePrompt(text) : null),
    [text]
  );

  const shareUrl = useMemo(() => {
    if (!result) return "";
    const code = encodeShare({
      v: 1,
      s: result.score,
      g: result.grade,
      p: result.percentile,
      r: result.roast,
      d: DIMENSION_ORDER.map(
        (k) => result.dimensions.find((d) => d.key === k)?.score ?? 0
      ),
    });
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://llmutils.co";
    return `${origin}/s/${code}`;
  }, [result]);

  const shareText = result
    ? `My prompt scored ${result.score}/100 (${result.grade}) on PromptScore. "${result.roast}" Can you beat it?`
    : "";

  async function copy(value: string, which: "link" | "prompt") {
    await navigator.clipboard.writeText(value);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-border bg-surface p-1.5 shadow-[0_0_60px_-20px_rgba(139,92,246,0.4)]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          rows={6}
          placeholder='Paste your prompt here… e.g. "write a blog post about productivity"'
          className="w-full resize-y rounded-xl bg-transparent p-4 text-base text-white/90 outline-none placeholder:text-white/30"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2">
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setText(EXAMPLE_PROMPTS.weak)}
              className="rounded-full border border-border px-3 py-1 text-white/50 transition hover:border-accent hover:text-white"
            >
              Try a weak prompt
            </button>
            <button
              onClick={() => setText(EXAMPLE_PROMPTS.strong)}
              className="rounded-full border border-border px-3 py-1 text-white/50 transition hover:border-accent hover:text-white"
            >
              Try a strong prompt
            </button>
          </div>
          <span className="text-xs text-white/30">
            {result ? `${result.wordCount} words · scored live as you type` : "scores live as you type"}
          </span>
        </div>
      </div>

      {result && (
        <div className="grid gap-6 animate-rise">
          {/* Scorecard */}
          <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex justify-center">
              <ScoreDial score={result.score} grade={result.grade} />
            </div>
            <div className="grid gap-3">
              <p className="text-lg font-medium text-white/90">
                &ldquo;{result.roast}&rdquo;
              </p>
              <p className="text-sm text-white/50">
                Better than <b className="text-white/80">{result.percentile}%</b>{" "}
                of prompts people throw at AI models.
              </p>
              <DimensionBars
                items={result.dimensions.map((d) => ({
                  label: d.label,
                  score: d.score,
                }))}
              />
            </div>
          </div>

          {/* Share */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4">
            <span className="text-sm font-medium text-white/80">
              Share your score:
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Post on X
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
            >
              LinkedIn
            </a>
            <button
              onClick={() => copy(shareUrl, "link")}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {copied === "link" ? "Copied!" : "Copy link"}
            </button>
            <span className="text-xs text-white/40">
              Links share only your scorecard — never your prompt.
            </span>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="grid gap-3 rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">What&apos;s costing you points</h2>
              {result.issues.map((issue) => (
                <div
                  key={issue.title}
                  className={`rounded-xl border p-4 ${SEVERITY_STYLE[issue.severity]}`}
                >
                  <p className="font-medium">{issue.title}</p>
                  <p className="mt-1 text-sm opacity-80">{issue.fix}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improved prompt */}
          <div className="grid gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-200">
                Your prompt, rebuilt
              </h2>
              <button
                onClick={() => copy(result.improved, "prompt")}
                className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {copied === "prompt" ? "Copied!" : "Copy prompt"}
              </button>
            </div>
            <p className="text-sm text-white/50">
              Fill in the [brackets], paste into any AI model, and watch the
              difference.
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-sm leading-relaxed text-white/85">
              {result.improved}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
