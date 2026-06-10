import Link from "next/link";
import { Grader } from "@/components/grader";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { POSTS } from "@/lib/posts";

const TRUST_POINTS = [
  { icon: "⚡", title: "Instant", body: "Scored in milliseconds, live as you type. No button, no spinner." },
  { icon: "🔒", title: "Private", body: "Runs 100% in your browser. Your prompt never leaves your device." },
  { icon: "🆓", title: "Free forever", body: "No signup, no paywall, no usage limits. Grade all day." },
];

export default function Home() {
  const latestPosts = POSTS.slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader />

      <section className="pb-10 pt-12 text-center">
        <span className="inline-block rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-medium text-accent">
          Free · No signup · Your prompt never leaves your browser
        </span>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          How good is{" "}
          <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
            your prompt?
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          Paste any ChatGPT, Claude, or Gemini prompt. Get a 0-100 score, a
          roast, and a rebuilt version that actually works — instantly.
        </p>
      </section>

      <Grader />

      <section className="mt-20 grid gap-4 sm:grid-cols-3">
        {TRUST_POINTS.map((t) => (
          <div
            key={t.title}
            className="rounded-2xl border border-border bg-surface/60 p-5 text-center"
          >
            <span className="text-2xl">{t.icon}</span>
            <p className="mt-2 font-semibold text-fg">{t.title}</p>
            <p className="mt-1 text-sm text-muted">{t.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-2xl font-bold">What&apos;s actually being graded?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Your prompt is scored against 8 weighted dimensions of prompt
          engineering — task definition, specificity, context, output format,
          constraints, clarity, examples, and role. The same checklist
          professionals use, automated.
        </p>
        <Link
          href="/guide"
          className="mt-5 inline-block rounded-xl border border-accent/50 px-6 py-3 font-semibold text-accent transition hover:bg-accent hover:text-white"
        >
          Read the 8-point checklist →
        </Link>
      </section>

      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">From the blog</h2>
          <Link href="/blog" className="text-sm text-accent hover:underline">
            All posts →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {latestPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-border bg-surface/60 p-5 transition hover:border-accent/50"
            >
              <p className="text-xs text-faint">{post.readingTime} min read</p>
              <p className="mt-2 font-semibold leading-snug text-fg transition group-hover:text-accent">
                {post.title}
              </p>
              <p className="mt-2 line-clamp-3 text-sm text-muted">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
