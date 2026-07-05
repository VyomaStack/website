import type { Metadata } from "next";
import { Geist } from "next/font/google";

import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SITE_URL } from "@/lib/tools";
import { cn } from "@/lib/utils";
import "../styles/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VyomaStack — AI Workspace for Software Engineers",
    template: "%s | VyomaStack",
  },
  description:
    "The AI workspace for SQL, Spark, Java, and data engineering. Format, explain, fix, and generate — free tools with AI-powered workflows.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VyomaStack",
    title: "VyomaStack — AI Workspace for Software Engineers",
    description:
      "Format, explain, fix, and generate. AI-powered workflows for SQL, Spark, and data engineering.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VyomaStack — AI Workspace for Software Engineers",
    description:
      "Format, explain, fix, and generate. AI-powered workflows for SQL, Spark, and data engineering.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
