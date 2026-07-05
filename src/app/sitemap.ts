import type { MetadataRoute } from "next";

import { SITE_URL, tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools
    .filter((t) => t.slug === "sql-formatter")
    .map((tool) => ({
      url: `${SITE_URL}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolPages,
  ];
}
