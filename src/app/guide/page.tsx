import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The 8-Point Prompt Checklist — PromptScore",
  description:
    "The exact 8 dimensions PromptScore grades against: task definition, specificity, context, output format, constraints, clarity, examples, and role. Learn how to write prompts that score 90+.",
};

const SECTIONS = [
  {
    title: "1. Task definition (18%)",
    body: "Start with a clear action verb — write, summarize, analyze, compare. The model should know what to DO within the first sentence. Questions work too, but instructions work better. One focused ask beats five tangled ones.",
    bad: "blog stuff for my site maybe",
    good: "Write a 600-word blog post comparing remote vs hybrid work.",
  },
  {
    title: "2. Specificity (15%)",
    body: "Numbers, names, and quantities turn a guess into a spec. \"A few ideas\" becomes \"7 ideas\". \"Short\" becomes \"under 100 words\". The strongest prompts are usually 30-150 words.",
    bad: "make it shortish with some examples",
    good: "Keep it under 120 words and include exactly 3 real-world examples.",
  },
  {
    title: "3. Context (15%)",
    body: "Models can't read your situation. Say who you are, who the output is for, and what you'll do with it. Two sentences of background routinely double output quality.",
    bad: "write a cover letter",
    good: "I'm a junior data analyst with 2 years in fintech applying to a senior role at a healthcare startup. Write a cover letter that bridges that gap.",
  },
  {
    title: "4. Output format (12%)",
    body: "If you don't specify the shape of the answer, you get the model's default: a wall of text. Ask for a table, bullets, JSON, a specific word count, or a tone.",
    bad: "tell me about our competitors",
    good: "Compare our 3 competitors in a table with columns: pricing, target user, weakness.",
  },
  {
    title: "5. Constraints (12%)",
    body: "Boundaries cut filler and hallucination. Say what to avoid, what's mandatory, and where the limits are. \"Don't invent statistics\" is a constraint that pays for itself.",
    bad: "write some marketing copy",
    good: "Write marketing copy. Avoid buzzwords like 'revolutionary'. Must mention the free tier. Max 50 words.",
  },
  {
    title: "6. Clarity (10%)",
    body: 'Vague words — "something", "stuff", "nice", "engaging" — force the model to guess what you mean. Every vague word is a coin flip on the output.',
    bad: "make it sound nicer and more engaging or whatever",
    good: "Rewrite in a warmer tone: shorter sentences, second person, one light joke.",
  },
  {
    title: "7. Examples (10%)",
    body: "One input→output example is the single highest-leverage upgrade in prompting. It nails tone, format, and depth in a way no description can.",
    bad: "write product descriptions in our style",
    good: "Write product descriptions in our style. Example — Input: ceramic mug. Output: \"Your morning ritual deserves better than a sad office cup.\"",
  },
  {
    title: "8. Role / persona (8%)",
    body: "\"You are a senior contract lawyer\" focuses the model's knowledge and vocabulary before it writes a single word. Cheap to add, consistently useful.",
    bad: "is this contract clause risky?",
    good: "You are a senior contract lawyer. Review this clause for risks a startup founder would miss.",
  },
];

export default function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Prompt<span className="text-accent">Score</span>
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Grade my prompt
        </Link>
      </header>

      <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
        The 8-point prompt checklist
      </h1>
      <p className="mt-4 text-lg text-white/55">
        This is exactly how PromptScore grades your prompt — the same 8
        dimensions, the same weights. Hit all 8 and you&apos;ll score 90+ on
        any prompt, for any model.
      </p>

      <div className="mt-10 grid gap-8">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <h2 className="text-xl font-semibold">{s.title}</h2>
            <p className="mt-2 text-white/60">{s.body}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                <span className="font-semibold text-red-300">Weak: </span>
                <span className="text-white/70">&ldquo;{s.bad}&rdquo;</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm">
                <span className="font-semibold text-emerald-300">Strong: </span>
                <span className="text-white/70">&ldquo;{s.good}&rdquo;</span>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-2 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90"
        >
          Now grade your prompt →
        </Link>
      </div>
    </main>
  );
}
