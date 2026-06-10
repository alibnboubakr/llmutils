import Link from "next/link";
import { Grader } from "@/components/grader";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24">
      <header className="flex items-center justify-between py-6">
        <span className="text-lg font-bold tracking-tight">
          Prompt<span className="text-accent">Score</span>
        </span>
        <Link
          href="/guide"
          className="text-sm text-white/50 transition hover:text-white"
        >
          Prompt-writing guide
        </Link>
      </header>

      <section className="py-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          How good is{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            your prompt?
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/55">
          Paste any ChatGPT, Claude, or Gemini prompt. Get a 0-100 score, a
          roast, and a rebuilt version that actually works — instantly, free,
          no signup.
        </p>
      </section>

      <Grader />

      <section className="mt-20 grid gap-4 text-center text-sm text-white/40">
        <p>
          Scored against 8 dimensions of prompt engineering — task clarity,
          specificity, context, format, constraints, examples, role, and
          wording. Everything runs in your browser:{" "}
          <b className="text-white/60">your prompt never leaves your device.</b>
        </p>
        <p>
          <Link href="/guide" className="text-accent hover:underline">
            Learn what each dimension means →
          </Link>
        </p>
      </section>

      <footer className="mt-20 border-t border-border pt-6 text-center text-xs text-white/30">
        PromptScore by llmutils.co — free forever. Built for people who talk to
        AI all day.
      </footer>
    </main>
  );
}
