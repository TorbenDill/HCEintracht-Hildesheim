import type { MetadataRoute } from "next";
import { getPlayers, getPlayerSlug, getBoardMeta } from "@/lib/player-service";
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

  return [...staticRoutes, ...playerRoutes];
}
