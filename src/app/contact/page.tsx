import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the PromptScore team.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <article className="pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Feedback, bug reports, ideas for the grader, or anything else —
          we&apos;d genuinely like to hear it.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted">
              The fastest way to reach us:
            </p>
            <a
              href="mailto:contact@llmutils.co"
              className="mt-3 inline-block font-medium text-accent hover:underline"
            >
              contact@llmutils.co
            </a>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-semibold">What to include</h2>
            <p className="mt-2 text-sm text-muted">
              For bug reports, the page you were on and what you expected to
              happen. For grader feedback, a prompt and the score you
              disagreed with — those are the most useful reports we get.
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-faint">
          We read everything. We typically reply within a few business days.
        </p>
      </article>

      <SiteFooter />
    </main>
  );
}
