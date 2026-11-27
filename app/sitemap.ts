import type { MetadataRoute } from "next";
import { getPlayers, getPlayerSlug, getBoardMeta } from "@/lib/player-service";
import lexikon from "@/data/lexikon.json";
import { getAllPositionKeys } from "@/lib/positions";
import { absoluteUrl } from "@/lib/site";
import { getTeams, teamSlug } from "@/lib/teams";

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
      url: absoluteUrl("/mein-board"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
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
    {
      url: absoluteUrl("/deutsche-prospects"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/europa-talente"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/ueber-uns"),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: absoluteUrl("/impressum"),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
    {
      url: absoluteUrl("/datenschutz"),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    },
  ];

  // Profile mit eigener Saison-Meldung tragen deren Datum – so sieht die
  // Suchmaschine, welche Seiten sich zuletzt wirklich geändert haben.
  const playerRoutes: MetadataRoute.Sitemap = getPlayers().map((p) => ({
    url: absoluteUrl(`/player/${getPlayerSlug(p.name)}`),
    lastModified:
      p.update_stand && p.update_stand > meta.updated
        ? new Date(p.update_stand)
        : lastModified,
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

  const positionRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/positionen"),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...getAllPositionKeys().map((pos) => ({
      url: absoluteUrl(`/position/${pos.toLowerCase()}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  // College-Detailseiten sind aggregierte Linklisten (noindex) und gehoeren
  // nicht in die Sitemap. Team-Seiten tragen seit dem Oktober-Umbau eigenen
  // Inhalt (Pick-Situation, Bilanz, Bedarf, Mock-Pick mit Begruendung,
  // passende Prospects) und werden seit 27.11.2026 indexiert.
  const collegeRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/colleges"),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  const teamRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/teams"),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    ...getTeams().map((t) => ({
      url: absoluteUrl(`/team/${teamSlug(t.teamAbbr)}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [
    ...staticRoutes,
    ...playerRoutes,
    ...lexikonRoutes,
    ...positionRoutes,
    ...collegeRoutes,
    ...teamRoutes,
  ];
}
