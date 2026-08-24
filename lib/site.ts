export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.hceintracht-hildesheim.de";

export const SITE_NAME = "HC Eintracht Hildesheim";

export const SITE_DESCRIPTION =
  "Offizielle Website des HC Eintracht Hildesheim – Handball aus Leidenschaft. News, Spieltag, Tickets und mehr.";

export const TOURNAMENT_ID = "sportradar.dhbdata.16059";

export const EXTERNAL_LINKS = {
  shop: "https://shop.hceintracht-hildesheim.de",
  livestream: "https://sporteurope.tv",
  statistics: "https://www.handball.net",
  instagram: "https://www.instagram.com/hceintracht",
  facebook: "https://www.facebook.com/hceintracht",
} as const;
