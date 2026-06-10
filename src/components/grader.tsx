"use client";

import { useMemo, useState } from "react";
import { gradePrompt, EXAMPLE_PROMPTS } from "@/lib/engine";
import { encodeShare, DIMENSION_ORDER } from "@/lib/share";
import { ScoreDial } from "./score-dial";
import { DimensionBars } from "./dimension-bars";

const SEVERITY_STYLE: Record<string, { box: string; dot: string }> = {
  high: {
    box: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-200",
    dot: "bg-red-500 dark:bg-red-400",
  },
  medium: {
    box: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  low: {
    box: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-200",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
};

const EMPTY_STEPS = [
  { n: "1", title: "Paste your prompt", body: "Any prompt, for any AI model." },
  { n: "2", title: "Watch it get scored", body: "Live, against 8 dimensions of prompt craft." },
  { n: "3", title: "Copy the rebuilt version", body: "And share your score — if you dare." },
];

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
      <div className="rounded-2xl border border-border bg-surface p-1.5 shadow-[0_0_80px_-24px_rgba(139,92,246,0.5)] transition focus-within:border-accent/60">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          rows={6}
          placeholder='Paste your prompt here… e.g. "write a blog post about productivity"'
          className="w-full resize-y rounded-xl bg-transparent p-4 text-base text-fg outline-none placeholder:text-faint"
        />
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-2">
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setText(EXAMPLE_PROMPTS.weak)}
              className="rounded-full border border-border px-3 py-1 text-muted transition hover:border-red-400/60 hover:text-fg"
            >
              😬 Try a weak prompt
            </button>
            <button
              onClick={() => setText(EXAMPLE_PROMPTS.strong)}
              className="rounded-full border border-border px-3 py-1 text-muted transition hover:border-emerald-400/60 hover:text-fg"
            >
              💪 Try a strong prompt
            </button>
            {text.length > 0 && (
              <button
                onClick={() => setText("")}
                className="rounded-full border border-border px-3 py-1 text-faint transition hover:text-fg"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-xs text-faint">
            {result
              ? `${result.wordCount} words · scored live as you type`
              : "scores live as you type"}
          </span>
        </div>
      </div>

      {!result && (
        <div className="grid gap-3 sm:grid-cols-3">
          {EMPTY_STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-surface/60 p-5"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-sm font-bold text-accent">
                {s.n}
              </span>
              <p className="mt-3 font-semibold text-fg">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div className="grid gap-6 animate-rise">
          {/* Scorecard */}
          <div className="relative grid gap-6 overflow-hidden rounded-2xl border border-border bg-surface p-6 md:grid-cols-[auto_1fr] md:items-center">
            {result.score >= 90 && (
              <span className="absolute right-4 top-4 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                🏆 Top {100 - result.percentile}% of prompts
              </span>
            )}
            <div className="flex justify-center">
              <ScoreDial score={result.score} grade={result.grade} />
            </div>
            <div className="grid gap-3">
              <p className="text-lg font-medium text-fg">
                &ldquo;{result.roast}&rdquo;
              </p>
              <p className="text-sm text-muted">
                Better than <b className="text-fg">{result.percentile}%</b> of
                prompts people throw at AI models.
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
          <div className="rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/15 to-accent-2/10 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold text-fg">
                Share your scorecard
              </span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-fg/10 px-4 py-1.5 text-sm font-medium text-fg transition hover:bg-fg/20"
              >
                Post on X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-fg/10 px-4 py-1.5 text-sm font-medium text-fg transition hover:bg-fg/20"
              >
                LinkedIn
              </a>
              <button
                onClick={() => copy(shareUrl, "link")}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {copied === "link" ? "Copied!" : "Copy link"}
              </button>
            </div>
            <p className="mt-2 text-xs text-faint">
              Links share only your scorecard — never your prompt.
            </p>
          </div>

          {/* Issues */}
          {result.issues.length > 0 && (
            <div className="grid gap-3 rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-semibold">
                What&apos;s costing you points
              </h2>
              {result.issues.map((issue) => (
                <div
                  key={issue.title}
                  className={`rounded-xl border p-4 ${SEVERITY_STYLE[issue.severity].box}`}
                >
                  <p className="flex items-center gap-2 font-medium">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${SEVERITY_STYLE[issue.severity].dot}`}
                    />
                    {issue.title}
                  </p>
                  <p className="mt-1 pl-4 text-sm opacity-80">{issue.fix}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improved prompt */}
          <div className="grid gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-200">
                Your prompt, rebuilt
              </h2>
              <button
                onClick={() => copy(result.improved, "prompt")}
                className="rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {copied === "prompt" ? "Copied!" : "Copy prompt"}
              </button>
            </div>
            <p className="text-sm text-muted">
              Fill in the [brackets], paste into any AI model, and watch the
              difference.
            </p>
            <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl p-4 text-sm leading-relaxed text-fg/90" style={{ background: "var(--code-bg)" }}>
              {result.improved}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
