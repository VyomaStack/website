import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FaqJsonLd, WebAppJsonLd } from "@/components/seo/json-ld";
import { isLiveTool, LIVE_TOOL_SLUGS, TOOL_COMPONENTS } from "@/lib/live-tools";
import { getTool, SITE_URL, tools } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

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

  return (
    <>
      {tool.faqs && <FaqJsonLd faqs={tool.faqs} />}
      <WebAppJsonLd
        name={tool.h1 ?? tool.name}
        description={tool.seoDescription ?? tool.description}
        url={pageUrl}
      />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav
          className="mb-6 text-sm text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="transition-colors hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/#tools" className="transition-colors hover:text-primary">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{tool.name}</span>
        </nav>

        <div className="mb-8">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tool.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {tool.h1 ?? tool.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {tool.description}
          </p>
        </div>

        <ToolComponent />

        {tool.dialects && tool.dialects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Supported SQL Dialects</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Select your dialect from the dropdown above for best results.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {tool.dialects.map((d) => (
                <div
                  key={d.name}
                  className="rounded-lg border border-border p-4"
                >
                  <h3 className="font-medium">{d.name} SQL Formatter</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {d.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tool.relatedTools && tool.relatedTools.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Related Tools</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {tool.relatedTools.map((relatedSlug) => {
                const related = getTool(relatedSlug);
                if (!related || !isLiveTool(relatedSlug)) return null;
                return (
                  <li key={relatedSlug}>
                    <Link
                      href={`/tools/${relatedSlug}`}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
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
          <section className="mt-12">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <dl className="mt-4 space-y-4">
              {tool.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-border p-4"
                >
                  <dt className="font-medium">{faq.question}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </>
  );
}
