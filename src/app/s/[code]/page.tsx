import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { decodeShare, DIMENSION_ORDER, DIMENSION_LABELS } from "@/lib/share";
import { ScoreDial } from "@/components/score-dial";
import { DimensionBars } from "@/components/dimension-bars";
import { SiteHeader, SiteFooter } from "@/components/site-header";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const payload = decodeShare(code);
  if (!payload) return { title: "PromptScore" };
  const title = `I scored ${payload.s}/100 (${payload.g}) on PromptScore`;
  const description = `"${payload.r}" — think your prompt can beat ${payload.s}? Grade it free in one second.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SharePage({ params }: Props) {
  const { code } = await params;
  const payload = decodeShare(code);
  if (!payload) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24">
      <SiteHeader cta />

      <section className="mt-8 grid gap-6 rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-sm uppercase tracking-widest text-white/40">
          Someone&apos;s prompt scored
        </p>
        <div className="flex justify-center">
          <ScoreDial score={payload.s} grade={payload.g} size={200} />
        </div>
        <p className="text-lg font-medium text-white/90">
          &ldquo;{payload.r}&rdquo;
        </p>
        <p className="text-sm text-white/50">
          Better than <b className="text-white/80">{payload.p}%</b> of prompts.
        </p>
        <div className="text-left">
          <DimensionBars
            items={DIMENSION_ORDER.map((k, i) => ({
              label: DIMENSION_LABELS[k],
              score: payload.d[i],
            }))}
          />
        </div>
      </section>

      <section className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-accent to-accent-2 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:opacity-90"
        >
          Think you can beat {payload.s}? Grade your prompt →
        </Link>
        <p className="mt-3 text-xs text-white/40">
          Free · instant · no signup · your prompt never leaves your browser
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
