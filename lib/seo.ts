import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

// Zentrale Metadaten fuer alle Seiten. Hintergrund: In Next.js ersetzt ein
// openGraph-/twitter-Objekt einer Seite das des Layouts KOMPLETT (keine tiefe
// Zusammenfuehrung). Seiten mit eigenem openGraph verloren dadurch frueher das
// Vorschaubild, Seiten ohne eigenes openGraph teilten die URL der Startseite.
// pageMetadata() setzt deshalb immer den vollstaendigen Satz.

export const TITLE_SUFFIX = " | NFL Draft Board 2027";
const MAX_TITLE = 62; // inkl. Suffix; laengere Titel erscheinen ohne Markenzusatz
const MAX_DESC = 158;

/** Text an einer Wortgrenze kuerzen (fuer Beschreibungen). */
export function clip(text: string, max = MAX_DESC): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]$/, "") + "…";
}

/** URL des generischen OG-Bildes mit Seitentitel (app/og/seite). */
export function ogImageUrl(title: string, kicker?: string): string {
  const q = new URLSearchParams({ t: title.slice(0, 90) });
  if (kicker) q.set("k", kicker.slice(0, 40));
  return `/og/seite?${q.toString()}`;
}

type Options = {
  /** Seitentitel ohne Markenzusatz. */
  title: string;
  description: string;
  /** Pfad mit fuehrendem Slash, z. B. "/mock-draft". */
  path: string;
  /** Titel ohne Template-Suffix ausgeben (z. B. Startseite). */
  absoluteTitle?: boolean;
  /** Abweichender Titel/Text fuer Social-Vorschauen. */
  ogTitle?: string;
  ogDescription?: string;
  /** Eigenes Vorschaubild; sonst generisches Bild mit Seitentitel. */
  image?: string;
  imageAlt?: string;
  /** Kleine Oberzeile im generischen Vorschaubild. */
  kicker?: string;
  type?: "website" | "article" | "profile";
  robots?: Metadata["robots"];
};

export function pageMetadata(o: Options): Metadata {
  const description = clip(o.description);
  const ogTitle = o.ogTitle ?? o.title;
  const ogDescription = clip(o.ogDescription ?? o.description);
  const image = o.image ?? ogImageUrl(ogTitle, o.kicker);
  const tooLong = (o.title + TITLE_SUFFIX).length > MAX_TITLE;

  return {
    title: o.absoluteTitle || tooLong ? { absolute: o.title } : o.title,
    description,
    alternates: { canonical: o.path },
    ...(o.robots ? { robots: o.robots } : {}),
    openGraph: {
      type: o.type ?? "website",
      locale: "de_DE",
      siteName: SITE_NAME,
      url: absoluteUrl(o.path),
      title: ogTitle,
      description: ogDescription,
      images: [{ url: image, width: 1200, height: 630, alt: o.imageAlt ?? ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}
