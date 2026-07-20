// Lädt zur Build-Zeit emotionale Football-Fotografie über die Pexels-API
// und schreibt die Bild-URLs nach data/visuals.json.
//
// - Läuft als "prebuild"-Hook (npm run build → prebuild → build).
// - Benötigt die Umgebungsvariable PEXELS_API_KEY (in Vercel hinterlegen).
// - Ohne Key oder bei Fehlern: vorhandene visuals.json bleibt unverändert,
//   die Seite baut ohne Fotos (graceful fallback). Exit-Code immer 0.
//
// Lizenz: Pexels-Fotos sind kostenlos nutzbar (Pexels-Lizenz). Wir speichern
// Fotografen-Name und Foto-URL für die Bildnachweise.

import { writeFileSync, readFileSync } from "node:fs";

const KEY = process.env.PEXELS_API_KEY;
const OUT = new URL("../data/visuals.json", import.meta.url);

const SLOTS = [
  {
    slot: "hero",
    query: "american football stadium night lights",
    orientation: "landscape",
  },
  {
    slot: "info",
    query: "american football player silhouette",
    orientation: "landscape",
  },
  {
    slot: "simulator",
    query: "american football field turf close up",
    orientation: "landscape",
  },
];

async function searchOne({ slot, query, orientation }) {
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}` +
    `&per_page=6&orientation=${orientation}&size=large`;
  const res = await fetch(url, { headers: { Authorization: KEY } });
  if (!res.ok) throw new Error(`Pexels ${res.status} for "${query}"`);
  const data = await res.json();
  const photo = (data.photos || []).find((p) => p.src?.large2x) || data.photos?.[0];
  if (!photo) return null;
  return {
    slot,
    url: photo.src.large2x || photo.src.large,
    urlSmall: photo.src.large,
    alt: photo.alt || query,
    avgColor: photo.avg_color || "#0b0d10",
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
  };
}

async function main() {
  if (!KEY) {
    console.log("[visuals] PEXELS_API_KEY nicht gesetzt – überspringe Foto-Fetch.");
    return;
  }
  try {
    const results = {};
    for (const s of SLOTS) {
      const r = await searchOne(s);
      if (r) results[s.slot] = r;
      console.log(`[visuals] ${s.slot}: ${r ? r.url : "kein Treffer"}`);
    }
    if (Object.keys(results).length === 0) {
      console.log("[visuals] keine Ergebnisse – behalte bestehende visuals.json");
      return;
    }
    let existing = {};
    try {
      existing = JSON.parse(readFileSync(OUT, "utf8"));
    } catch {}
    writeFileSync(OUT, JSON.stringify({ ...existing, ...results }, null, 2));
    console.log("[visuals] data/visuals.json aktualisiert.");
  } catch (err) {
    console.log(`[visuals] Fehler (${err.message}) – Seite baut ohne neue Fotos.`);
  }
}

await main();
