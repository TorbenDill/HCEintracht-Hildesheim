import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/news",
    "/spieltag",
    "/spieltag/tabelle",
    "/spieltag/spielplan",
    "/spieltag/liveticker",
    "/spieltag/livestream",
    "/tickets",
    "/tickets/ticketshop",
    "/tickets/dauerkarten",
    "/tickets/gaestefans",
    "/mannschaft",
    "/mannschaft/kader",
    "/mannschaft/trainerteam",
    "/mannschaft/statistiken",
    "/jugend",
    "/business",
    "/business/logen",
    "/business/werbemoeglichkeiten",
    "/business/b2b-netzwerk",
    "/business/catering",
    "/fans",
    "/fans/fanshop",
    "/fans/fanartikel",
    "/fans/fanchoreografie",
    "/verein",
    "/verein/geschichte",
    "/verein/vorstand",
    "/verein/hallenfinder",
    "/verein/kontakt",
    "/impressum",
    "/datenschutz",
  ];

  return pages.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
