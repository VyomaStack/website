import type { Tool } from "@/types/tool";

export const tools: Tool[] = [
  {
    slug: "sql-formatter",
    name: "SQL Formatter",
    category: "SQL",
    description:
      "Beautify and minify SQL queries. Supports MySQL, PostgreSQL, T-SQL, Spark SQL, and more.",
    relatedTools: ["json-formatter", "jwt-decoder"],
    faqs: [
      {
        question: "What SQL dialects are supported?",
        answer:
          "MySQL, PostgreSQL, MariaDB, SQL Server (T-SQL), Spark SQL, Redshift, BigQuery, SQLite, and standard SQL.",
      },
      {
        question: "Is my SQL sent to a server?",
        answer:
          "No. All formatting runs entirely in your browser. Your queries never leave your device.",
      },
    ],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "JSON",
    description: "Format, validate, and minify JSON data.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Security",
    description: "Decode and inspect JSON Web Tokens.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator",
    category: "Developer",
    description: "Generate random UUID v4 identifiers.",
  },
  {
    slug: "base64-encoder",
    name: "Base64 Encoder",
    category: "Developer",
    description: "Encode and decode Base64 strings.",
  },
  {
    slug: "spark-memory-calculator",
    name: "Spark Memory Calculator",
    category: "Spark",
    description: "Estimate Spark executor memory requirements.",
  },
];

export const categories = [
  "AI",
  "Developer",
  "SQL",
  "JSON",
  "PDF",
  "Images",
  "Security",
  "Spark",
  "API",
] as const;

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((t) => t.category === category);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.vyomastack.com";
