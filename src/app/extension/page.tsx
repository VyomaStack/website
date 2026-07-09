import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Chrome, Puzzle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SITE_URL } from "@/lib/tools";

export const metadata: Metadata = {
  title: "Chrome Extension — Dev Tools in Your Browser",
  description:
    "Install the VyomaStack Chrome extension. Format SQL, JSON, and decode JWT from any page with right-click or the toolbar popup.",
  alternates: { canonical: `${SITE_URL}/extension` },
};

const STEPS = [
  {
    title: "Build the extension",
    description:
      "Clone the repo, run npm install && npm run build in the extension/ folder.",
  },
  {
    title: "Load in Chrome",
    description:
      "Open chrome://extensions, enable Developer mode, Load unpacked → select extension/dist.",
  },
  {
    title: "Pin & use",
    description:
      "Pin VyomaStack in the toolbar. Select text on any page → right-click → VyomaStack.",
  },
];

export default function ExtensionPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center gap-3">
        <Chrome className="size-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            VyomaStack Chrome Extension
          </h1>
          <p className="mt-1 text-muted-foreground">
            SQL, JSON, and JWT tools on any webpage — local and private.
          </p>
        </div>
      </div>

      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="size-5 text-primary" />
            v0.1 — Developer install
          </CardTitle>
          <CardDescription>
            Chrome Web Store listing coming soon. For now, install unpacked from
            the repo (free, open build).
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Link href="/tools">
          <Button>
            Use web tools
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Popup actions run locally in your browser. Links to vyomastack.com open
        the full workspace with AI tools (SQL explain, log analyzer, Spark, and
        more).
      </p>
    </div>
  );
}
