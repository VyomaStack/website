import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaqJsonLd, WebAppJsonLd } from "@/components/seo/json-ld";
import { isLiveTool, LIVE_TOOL_SLUGS, TOOL_COMPONENTS } from "@/lib/live-tools";
import { getTool, SITE_URL } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

const SHORT_HINTS: Record<string, string> = {
  "text-compare": "Diff two texts in your browser",
  "sql-formatter": "Format & explain SQL",
  "json-formatter": "Format JSON · generate POJOs",
  "yaml-formatter": "Format & validate YAML",
  "jwt-decoder": "Decode JWT claims locally",
  "timestamp-converter": "Unix epoch ↔ date",
  "log-analyzer": "Paste logs · get root cause",
  "spark-error-explainer": "Explain Spark stack traces",
  "spark-memory-calculator": "Size executors",
  "password-generator": "Generate strong passwords",
  "hash-generator": "MD5 · SHA hashes",
  "regex-tester": "Test regex live",
  "cron-generator": "Build cron schedules",
  "uuid-generator": "Generate UUIDs",
  "base64-encoder": "Encode / decode Base64",
  "url-encoder": "Encode / decode URLs",
  "qr-code-generator": "Create QR codes",
};

export async function generateStaticParams() {
  return LIVE_TOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const url = `${SITE_URL}/tools/${slug}`;
  const title = tool.seoTitle ?? `${tool.name} — Free Online Tool | VyomaStack`;
  const description = tool.seoDescription ?? tool.description;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "VyomaStack",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool || !isLiveTool(slug)) notFound();

  const ToolComponent = TOOL_COMPONENTS[slug];
  const pageUrl = `${SITE_URL}/tools/${slug}`;
  const hint = SHORT_HINTS[slug] ?? tool.description;

  return (
    <>
      {tool.faqs && <FaqJsonLd faqs={tool.faqs} />}
      <WebAppJsonLd
        name={tool.h1 ?? tool.name}
        description={tool.seoDescription ?? tool.description}
        url={pageUrl}
      />

      <div className="mx-auto max-w-[1600px] px-3 pb-10 pt-3 sm:px-5 lg:px-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
              {tool.name}
            </h1>
            <span className="hidden truncate text-sm text-muted-foreground sm:inline">
              {hint}
            </span>
          </div>
          <nav className="text-xs text-muted-foreground" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/tools" className="hover:text-primary">
              All tools
            </Link>
          </nav>
        </div>

        <p className="sr-only">{tool.description}</p>

        <ToolComponent />

        {tool.relatedTools && tool.relatedTools.length > 0 && (
          <section className="mt-10 border-t border-border pt-6">
            <h2 className="text-sm font-medium text-muted-foreground">
              Related tools
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {tool.relatedTools.map((relatedSlug) => {
                const related = getTool(relatedSlug);
                if (!related || !isLiveTool(relatedSlug)) return null;
                return (
                  <li key={relatedSlug}>
                    <Link
                      href={`/tools/${relatedSlug}`}
                      className="rounded-full border border-border px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                    >
                      {related.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {tool.faqs && tool.faqs.length > 0 && (
          <section className="mt-8 max-w-3xl">
            <details className="group rounded-lg border border-border">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-muted-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                FAQ
                <span className="ml-2 text-xs group-open:hidden">
                  (click to expand)
                </span>
              </summary>
              <dl className="space-y-3 border-t border-border px-4 py-3">
                {tool.faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-sm font-medium">{faq.question}</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>
          </section>
        )}
      </div>
    </>
  );
}
