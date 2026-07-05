import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "../styles/globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VyomaStack — AI-Powered Developer Platform",
  description:
    "Search 500+ developer tools: SQL, JSON, AI, security, and more. The GitHub of Developer Tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
