// Holt zur Build-Zeit frei lizenzierte Spielerfotos von Wikipedia/Wikimedia
// Commons und schreibt sie nach data/player-images.json.
//
// Rechtlich sauber: Es werden AUSSCHLIESSLICH Bilder mit freier Lizenz
// (CC-BY, CC-BY-SA, CC0, Public Domain) übernommen. Fair-Use/Non-Free wird
// verworfen. Lizenz und Urheber werden für die Bildnachweise gespeichert.
//
// Fail-safe: Jeder Fehler pro Spieler wird übersprungen (Fallback = Initialen-
// Avatar). Der Build bricht nie ab. Kein API-Key nötig.

import { readFileSync, writeFileSync } from "node:fs";

const DATA = new URL("../data/data.json", import.meta.url);
const OUT = new URL("../data/player-images.json", import.meta.url);
const API = "https://en.wikipedia.org/w/api.php";
const UA =
  "NFLDraftScoutingBot/1.0 (https://www.nfldraft-scouting.de; info@marketingberatung-dill.de)";

// Als frei akzeptierte Lizenzen
const FREE = /(cc[-\s]?(by|by-sa|zero|0)|public domain|^pd|no restrictions|attribution)/i;
const SUFFIX = /^(jr|sr|ii|iii|iv|v)\.?$/i;

function slug(name) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
}

async function api(params) {
  const qs = new URLSearchParams({ format: "json", ...params });
  const res = await fetch(`${API}?${qs}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`wiki ${res.status}`);
  return res.json();
}

function nameTokens(name) {
  return name
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .split(/\s+/)
    .filter((t) => t && !SUFFIX.test(t));
}

async function findImage(name) {
  // 1) Wikipedia-Seite über die Suche finden (Football-qualifiziert)
  const search = await api({
    action: "query",
    list: "search",
    srsearch: `"${name}" American football`,
    srlimit: "1",
  });
  const hit = search?.query?.search?.[0];
  if (!hit) return null;
  const title = hit.title;

  // Namens-Abgleich: alle Namensteile müssen im Seitentitel vorkommen
  const t = title.toLowerCase().replace(/[.'’]/g, "");
  if (!nameTokens(name).every((tok) => t.includes(tok))) return null;

  // 2) Lead-Bild der Seite holen + Disambiguierung ausschließen
  const page = await api({
    action: "query",
    titles: title,
    redirects: "1",
    prop: "pageimages|pageprops",
    piprop: "thumbnail|name",
    pithumbsize: "640",
  });
  const p = Object.values(page?.query?.pages || {})[0];
  if (!p || p.pageprops?.disambiguation !== undefined) return null;
  const file = p.pageimage;
  const thumb = p.thumbnail?.source;
  if (!file || !thumb) return null;

  // 3) Lizenz + Urheber über die File-Seite prüfen
  const info = await api({
    action: "query",
    titles: `File:${file}`,
    prop: "imageinfo",
    iiprop: "extmetadata|url",
    iiurlwidth: "640",
  });
  const ip = Object.values(info?.query?.pages || {})[0];
  const ii = ip?.imageinfo?.[0];
  const md = ii?.extmetadata || {};
  const license = (md.LicenseShortName?.value || md.License?.value || "").trim();
  const restrictions = (md.Restrictions?.value || "").trim();
  if (!FREE.test(license) || restrictions || /fair use|non-free/i.test(license)) {
    return null;
  }

  const artist =
    (md.Artist?.value || "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim() || "Wikimedia Commons";
  const url = ii?.thumburl || thumb;
  const sourceUrl =
    ii?.descriptionurl ||
    `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file)}`;
  return { url, license, artist, sourceUrl };
}

async function main() {
  let players;
  try {
    players = JSON.parse(readFileSync(DATA, "utf8"));
  } catch {
    console.log("[player-images] data.json fehlt, überspringe.");
    return;
  }

  let out = {};
  try {
    out = JSON.parse(readFileSync(OUT, "utf8"));
  } catch {}

  let found = 0;
  let checked = 0;
  for (const pl of players) {
    const key = slug(pl.name);
    if (out[key]?.url) continue; // bereits im Cache -> nicht erneut abfragen
    checked++;
    try {
      const img = await findImage(pl.name);
      if (img) {
        out[key] = img;
        found++;
        console.log(`[player-images] ${pl.name}: ${img.license}`);
      }
    } catch {
      // still, Fallback = Initialen-Avatar
    }
    await new Promise((r) => setTimeout(r, 200)); // höflich zu Wikimedia
  }

  writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(
    `[player-images] ${found} neue Fotos (${checked} geprüft, ${Object.keys(out).length} gesamt).`
  );
}

await main().catch((e) => console.log(`[player-images] Fehler: ${e.message}`));
