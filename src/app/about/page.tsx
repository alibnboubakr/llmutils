import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About",
  description:
    "What PromptScore is, how the grading engine works, and why your prompt never leaves your browser.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <article className="pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          About PromptScore
        </h1>

        <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-muted">
          <p>
            PromptScore is a free tool that answers one question: how good is
            the prompt you&apos;re about to send to an AI model? Paste any
            prompt — for ChatGPT, Claude, Gemini, or anything else — and you
            get an instant 0-100 score, a breakdown of what&apos;s weak, and a
            rebuilt version you can use immediately.
          </p>
          <p>
            We built it because most people never get feedback on their
            prompts. You send something vague, get a mediocre answer, and blame
            the model. In our experience the prompt is the problem far more
            often than the model — and the problems are predictable, mechanical,
            and fixable.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            How the grading works
          </h2>
          <p>
            Your prompt is scored against 8 weighted dimensions of prompt
            engineering: task definition, specificity, context, output format,
            constraints, clarity, examples, and role. The full rubric, with
            weights and examples, is published in our{" "}
            <Link href="/guide" className="text-accent hover:underline">
              8-point checklist
            </Link>
            . The engine is deterministic — the same prompt always gets the
            same score — so you can iterate against it like a test suite.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Your prompts stay yours
          </h2>
          <p>
            The entire grading engine runs in your browser. Your prompt is
            never uploaded, stored, or logged — there is no server that ever
            sees it. Share links contain only the scorecard (the numbers),
            never the prompt text. This isn&apos;t a policy promise that could
            change; it&apos;s how the product is built.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Who makes this
          </h2>
          <p>
            PromptScore is built and maintained by llmutils.co. It&apos;s free,
            with no signup and no usage limits. Questions, feedback, or ideas?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Get in touch
            </Link>
            .
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
