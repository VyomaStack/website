import Link from "next/link";

interface LegalPageProps {
  title: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav
        className="mb-6 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: {updated}
      </p>

      <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
