import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "PromptScore's privacy policy: prompts are processed in your browser and never collected; what limited data the site does and doesn't use.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <article className="pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-faint">Last updated: June 10, 2026</p>

        <div className="mt-6 space-y-5 leading-relaxed text-muted">
          <p>
            This policy describes how PromptScore (llmutils.co, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;) handles information when you use this website.
            The short version: the core tool runs entirely in your browser, and
            we do not collect, store, or transmit the prompts you grade.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Your prompts
          </h2>
          <p>
            The prompt grading engine is JavaScript that executes on your
            device. Text you type or paste into the grader is processed locally
            and is never sent to our servers or to any third party. We have no
            database of prompts and no ability to read what you grade.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Share links
          </h2>
          <p>
            If you choose to share a scorecard, the link encodes only the
            numeric results (score, grade, percentile, dimension scores) and
            the generated one-line summary. It never contains your prompt text.
            Anyone you give the link to can view that scorecard.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Data stored on your device
          </h2>
          <p>
            We use your browser&apos;s local storage to remember a single
            preference: your light/dark theme choice. This stays on your device
            and is not transmitted to us.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Analytics and server logs
          </h2>
          <p>
            Like most websites, our hosting infrastructure may record standard
            technical information about requests (such as IP address, browser
            type, pages visited, and timestamps) for security and performance
            purposes. If we use privacy-respecting aggregate analytics, they
            measure page views and never the contents of the grader.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Advertising and cookies
          </h2>
          <p>
            We may display advertising served by third parties, such as Google
            AdSense, to keep the tool free. Third-party ad vendors may use
            cookies or similar technologies to serve ads based on your visits
            to this and other websites. Google&apos;s use of advertising
            cookies is described in{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Google&apos;s advertising policies
            </a>
            , and you can opt out of personalized advertising at{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Google Ads Settings
            </a>
            . Ad cookies are set by those vendors, not by us, and are never
            given access to the contents of the grader.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Children
          </h2>
          <p>
            This site is a general-audience tool and is not directed at
            children under 13. We do not knowingly collect personal information
            from anyone, including children.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Changes to this policy
          </h2>
          <p>
            If we change this policy, we will update this page and the
            &ldquo;last updated&rdquo; date above. Material changes to how the
            grader handles your text would be reflected here before they take
            effect.
          </p>

          <h2 className="pt-4 text-2xl font-bold tracking-tight text-fg">
            Contact
          </h2>
          <p>
            Questions about this policy? Reach us via the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              contact page
            </Link>
            .
          </p>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
