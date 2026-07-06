import Link from "next/link";

import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { getTool } from "@/lib/tools";

export function SiteFooter() {
  const liveTools = LIVE_TOOL_SLUGS.map((slug) => getTool(slug)).filter(
    Boolean
  );

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-semibold">VyomaStack</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The AI Workspace for Software Engineers. Format, explain, fix, and
            generate — with browser-secure tools and AI-powered workflows.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Tools</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {liveTools.map((tool) =>
              tool ? (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ) : null
            )}
            <li>
              <Link
                href="/#tools"
                className="transition-colors hover:text-primary"
              >
                All tools →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Platform</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/#categories"
                className="transition-colors hover:text-primary"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="transition-colors hover:text-primary"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} VyomaStack. All rights reserved.</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/privacy" className="transition-colors hover:text-primary">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-primary">
            Terms
          </Link>
        </p>
      </div>
    </footer>
  );
}
