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
            The GitHub of Developer Tools. AI-powered utilities for modern
            developers.
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
              <span className="text-muted-foreground/70">Blog — coming soon</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VyomaStack. All rights reserved.
      </div>
    </footer>
  );
}
