import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ cta }: { cta?: boolean }) {
  return (
    <header className="sticky top-0 z-20 -mx-4 mb-2 border-b border-border/70 bg-bg/80 px-4 backdrop-blur-md">
      <div className="flex items-center justify-between py-3.5">
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
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/blog"
            className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-fg"
          >
            Blog
          </Link>
          <Link
            href="/guide"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted transition hover:text-fg sm:block"
          >
            Guide
          </Link>
          <ThemeToggle />
          {cta && (
            <Link
              href="/"
              className="ml-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Grade my prompt
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

const FOOTER_LINKS = [
  { href: "/", label: "Grader" },
  { href: "/guide", label: "Prompt guide" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border pt-8 pb-6 text-center text-xs leading-relaxed text-faint">
      <nav className="mb-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
        {FOOTER_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-muted transition hover:text-fg"
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <p>
        <span className="font-semibold text-muted">PromptScore</span> by
        llmutils.co — free forever, no signup required.
      </p>
      <p className="mt-1">
        The grader runs in your browser. Your prompt never touches a server.
      </p>
      <p className="mt-3">
        © {new Date().getFullYear()} llmutils.co. All rights reserved.
      </p>
    </footer>
  );
}
