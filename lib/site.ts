import boardMeta from "@/data/board-meta.json";

/**
 * Kanonische Basis-URL der Seite.
 * Reihenfolge: ENV (Vercel/Custom) > board-meta.json > Fallback.
 * So lässt sich die Domain ohne Code-Änderung umstellen.
 */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  boardMeta.siteUrl ||
  "https://www.nfldraft-scouting.de"
).replace(/\/$/, "");

export const SITE_NAME: string =
  boardMeta.siteName || "NFL Draft Board 2027 – Forstner Scouting";

/** localStorage-Schlüssel der Cookie-Einwilligung. */
export const CONSENT_KEY = "nfl-consent-v1";

/** AdSense-Publisher-ID (muss mit /ads.txt übereinstimmen). */
export const ADSENSE_CLIENT = "ca-pub-3725697242603398";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
