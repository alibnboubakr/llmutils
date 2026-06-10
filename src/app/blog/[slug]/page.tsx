import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { PostBody } from "@/components/post-body";
import { POSTS, getPost } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-12">
      <SiteHeader cta />

      <article className="pt-10">
        <div className="flex items-center gap-3 text-xs text-faint">
          <Link href="/blog" className="text-accent hover:underline">
            ← All posts
          </Link>
          <span>·</span>
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
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted">{post.description}</p>

        <div className="mt-6 border-t border-border pt-2">
          <PostBody body={post.body} />
        </div>
      </article>

      <section className="mt-12 rounded-2xl border border-accent/40 bg-gradient-to-r from-accent/15 to-accent-2/10 p-6 text-center">
        <h2 className="text-xl font-bold">
          Put it into practice — grade your prompt
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          The grader scores your prompt against everything in this article, in
          about a second. Free, no signup.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Grade my prompt →
        </Link>
      </section>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-muted">Keep reading</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-border bg-surface p-5 transition hover:border-accent/50"
              >
                <p className="font-semibold leading-snug transition group-hover:text-accent">
                  {p.title}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
