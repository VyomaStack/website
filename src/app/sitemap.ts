import type { MetadataRoute } from "next";

import { LIVE_TOOL_SLUGS } from "@/lib/live-tools";
import { SITE_URL } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = LIVE_TOOL_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tools/${slug}`,
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
