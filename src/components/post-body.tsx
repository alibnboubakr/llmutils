import Link from "next/link";
import { Fragment, type ReactNode } from "react";

// Renders the markdown subset used by blog posts: ## / ### headings,
// "- " lists, "> " blockquotes, **bold**, `code`, and [text](href).

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded px-1.5 py-0.5 text-[0.9em]"
          style={{ background: "var(--code-bg)" }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <Link key={i} href={link[2]} className="text-accent hover:underline">
          {link[1]}
        </Link>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function PostBody({ body }: { body: string }) {
  const blocks: ReactNode[] = [];
  const lines = body.trim().split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === "") {
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="mt-8 text-lg font-semibold">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
    } else if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="mt-10 text-2xl font-bold tracking-tight">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="mt-4 list-disc space-y-2 pl-6 text-muted">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    } else if (line.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="mt-4 rounded-r-xl border-l-4 border-accent/60 bg-surface-2 px-5 py-3 text-muted"
        >
          {quote.map((q, j) =>
            q === "" ? (
              <div key={j} className="h-3" />
            ) : (
              <p key={j}>{renderInline(q)}</p>
            )
          )}
        </blockquote>
      );
    } else {
      blocks.push(
        <p key={key++} className="mt-4 leading-relaxed text-muted">
          {renderInline(line)}
        </p>
      );
      i++;
    }
  }

  return <div className="text-[1.05rem]">{blocks}</div>;
}
