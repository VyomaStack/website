import Link from "next/link";
import { Wand2 } from "lucide-react";

import {
  HomeSearchBar,
  HomeSearchProvider,
  HomeToolDirectory,
} from "@/components/home/home-tool-search";
import { SmartPastePlayground } from "@/components/marketing/smart-paste-playground";
import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { tools } from "@/lib/tools";

export default function Home() {
  const liveSlugs = new Set<string>(LIVE_TOOL_SLUGS);

  return (
    <HomeSearchProvider>
      <div className="border-b border-border bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pick a tool. Get the job done.
              </h1>
              <p className="mt-2 text-base text-muted-foreground sm:text-lg">
                Text compare, SQL, JWT, Spark logs, JSON — click any card below
                and go straight inside. No signup.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 lg:max-w-md">
              <HomeSearchBar />
              <Link
                href="#try-it"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Wand2 className="size-3.5" />
                Not sure? Paste anything — we&apos;ll detect it
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <HomeToolDirectory tools={tools} liveSlugs={liveSlugs} />
      </div>

      <SmartPastePlayground />
    </HomeSearchProvider>
  );
}
