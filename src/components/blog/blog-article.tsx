import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/blog";

function renderInline(text: string) {
  const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    const link = part.match(/^\[(.+)\]\((.+)\)$/);
    if (link) {
      const href = link[2];
      const internal = href.startsWith("/");
      return internal ? (
        <Link key={i} href={href} className="text-primary underline-offset-4 hover:underline">
          {link[1]}
        </Link>
      ) : (
        <a key={i} href={href} className="text-primary underline-offset-4 hover:underline">
          {link[1]}
        </a>
      );
    }
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {bold[1]}
        </strong>
      );
    }
    const code = part.match(/^`([^`]+)`$/);
    if (code) {
      return (
        <code key={i} className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
          {code[1]}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function BlogArticle({ post }: { post: BlogPost }) {
  const blocks = post.content.split("\n\n");

  return (
    <article className="prose-blog mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-muted-foreground">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 text-lg font-semibold text-foreground">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={i} className="pt-2 text-base font-semibold text-foreground">
              {trimmed.slice(4)}
            </h3>
          );
        }

        if (trimmed.startsWith("```")) {
          const code = trimmed.replace(/^```\n?/, "").replace(/\n?```$/, "");
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg border border-input bg-muted/40 p-4 font-mono text-xs text-foreground"
            >
              {code}
            </pre>
          );
        }

        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => !r.includes("---"));
          return (
            <div key={i} className="overflow-x-auto rounded-lg border border-input">
              <table className="w-full text-left text-sm">
                <tbody>
                  {rows.map((row, ri) => {
                    const cells = row.split("|").filter(Boolean).map((c) => c.trim());
                    return (
                      <tr key={ri} className={ri === 0 ? "bg-muted/50 font-medium" : "border-t border-input"}>
                        {cells.map((cell, ci) => (
                          <td key={ci} className="px-3 py-2">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").map((l) => l.replace(/^- /, ""));
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i}>{renderInline(trimmed)}</p>
        );
      })}

      <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="font-medium text-foreground">Ready to try it?</p>
        <p className="mt-1 text-sm">Free, no signup — runs in your browser.</p>
        <Link href={post.toolHref} className="mt-4 inline-block">
          <Button>{post.toolLabel}</Button>
        </Link>
      </div>
    </article>
  );
}
