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
      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              VyomaStack
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {LIVE_TOOL_SLUGS.length} tools · pick one and start · no login
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:max-w-md sm:items-end">
            <HomeSearchBar />
            <Link
              href="#try-it"
              className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-primary hover:underline sm:self-end"
            >
              <Wand2 className="size-3.5" />
              Or paste anything — we&apos;ll detect it
            </Link>
          </div>
        </div>

        <HomeToolDirectory tools={tools} liveSlugs={liveSlugs} />
      </div>

      <SmartPastePlayground />
    </HomeSearchProvider>
  );
}
