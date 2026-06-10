import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply when you use PromptScore.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <article className="pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Terms of Use</h1>
        <p className="mt-2 text-sm text-faint">Last updated: June 10, 2026</p>

        <div className="mt-6 space-y-5 leading-relaxed text-muted">
          <p>
            By using PromptScore (llmutils.co, the &ldquo;Service&rdquo;), you
            agree to these terms. If you don&apos;t agree, please don&apos;t
            use the Service.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            The Service
          </h2>
          <p>
            PromptScore provides automated, heuristic feedback on AI prompts,
            along with educational content about prompt writing. The Service is
            provided free of charge and without a user account.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            No warranties
          </h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of
            any kind. Scores and suggestions are heuristic guidance, not a
            guarantee of any particular result from any AI model. You are
            responsible for the prompts you write and how you use AI outputs.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Acceptable use
          </h2>
          <p>
            You agree not to misuse the Service — including attempting to
            disrupt it, scraping it at abusive volume, or using it in violation
            of applicable law. Share links you create may be viewed by anyone
            who has the link.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Intellectual property
          </h2>
          <p>
            The Service&apos;s design, content, and code are owned by
            llmutils.co or its licensors. Your prompts remain entirely yours —
            we never receive them. The rebuilt prompts the tool generates from
            your input are yours to use freely.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Limitation of liability
          </h2>
          <p>
            To the maximum extent permitted by law, llmutils.co shall not be
            liable for any indirect, incidental, or consequential damages
            arising from your use of the Service.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Changes
          </h2>
          <p>
            We may update these terms from time to time; the current version
            will always be on this page. Continued use of the Service after
            changes means you accept the updated terms.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Contact
          </h2>
          <p>
            Questions?{" "}
            <Link href="/contact" className="text-accent hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
