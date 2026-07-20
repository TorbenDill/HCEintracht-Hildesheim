import type { MetadataRoute } from "next";
import { getPlayers, getPlayerSlug, getBoardMeta } from "@/lib/player-service";
import lexikon from "@/data/lexikon.json";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const meta = getBoardMeta();
  const lastModified = new Date(meta.updated);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/simulator"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: absoluteUrl("/mock-draft"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const playerRoutes: MetadataRoute.Sitemap = getPlayers().map((p) => ({
    url: absoluteUrl(`/player/${getPlayerSlug(p.name)}`),
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const lexikonRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/lexikon"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...(lexikon as { slug: string }[]).map((e) => ({
      url: absoluteUrl(`/lexikon/${e.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...playerRoutes, ...lexikonRoutes];
}
