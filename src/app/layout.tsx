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
    default: "VyomaStack — AI-Powered Developer Platform",
    template: "%s | VyomaStack",
  },
  description:
    "Search 500+ developer tools: SQL, JSON, AI, security, and more. The GitHub of Developer Tools.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "VyomaStack",
    title: "VyomaStack — AI-Powered Developer Platform",
    description:
      "500+ developer tools for SQL, JSON, security, Spark, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VyomaStack — AI-Powered Developer Platform",
    description:
      "500+ developer tools for SQL, JSON, security, Spark, and more.",
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
