import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Prompting best practices",
  description:
    "Practical, no-fluff articles on writing better AI prompts: best practices, templates, few-shot prompting, and why prompts fail.",
};

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <section className="pb-4 pt-12">
        <h1 className="text-4xl font-extrabold tracking-tight">
          The PromptScore blog
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Practical, no-fluff writing on getting better output from AI models.
          The same principles the grader scores against, in long form.
        </p>
      </section>

      <div className="mt-6 grid gap-5">
        {POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/50"
          >
            <div className="flex items-center gap-3 text-xs text-faint">
              <time dateTime={post.date}>
                {new Date(post.date + "T00:00:00Z").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>
            <h2 className="mt-2 text-xl font-bold leading-snug transition group-hover:text-accent">
              {post.title}
            </h2>
            <p className="mt-2 text-muted">{post.description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-accent">
              Read article →
            </span>
          </Link>
        ))}
      </div>

      <SiteFooter />
    </main>
  );
}
