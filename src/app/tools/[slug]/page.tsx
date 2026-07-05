import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SqlFormatterTool } from "@/components/tools/sql-formatter-tool";
import { getTool, SITE_URL, tools } from "@/lib/tools";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return tools
    .filter((t) => t.slug === "sql-formatter")
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};

  const url = `${SITE_URL}/tools/${slug}`;

  return {
    title: `${tool.name} — Free Online Tool | VyomaStack`,
    description: tool.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${tool.name} | VyomaStack`,
      description: tool.description,
      url,
      siteName: "VyomaStack",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool || slug !== "sql-formatter") notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 text-sm text-muted-foreground">
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
          {tool.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{tool.description}</p>
      </div>

      <SqlFormatterTool />

      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
          <dl className="mt-4 space-y-4">
            {tool.faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-border p-4">
                <dt className="font-medium">{faq.question}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
