import Link from "next/link";

export function SiteHeader({ cta }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-2 border-b border-border/60 bg-bg/80 px-4 backdrop-blur-md">
      <div className="flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-sm font-extrabold text-white">
            P
          </span>
          <span>
            Prompt<span className="text-accent">Score</span>
          </span>
        </Link>
        {cta ? (
          <Link
            href="/"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Grade my prompt
          </Link>
        ) : (
          <Link
            href="/guide"
            className="text-sm text-white/50 transition hover:text-white"
          >
            Prompt-writing guide
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border pt-8 pb-4 text-center text-xs leading-relaxed text-white/30">
      <p>
        <span className="font-semibold text-white/50">PromptScore</span> by
        llmutils.co — free forever, no signup, no tracking of your prompts.
      </p>
      <p className="mt-1">
        Everything runs in your browser. Your prompt never touches a server.
      </p>
    </footer>
  );
}
