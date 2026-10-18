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
import dns from "node:dns";

// Lokal laeuft Nodes fetch ueber IPv6 in Timeouts; IPv4 zuerst behebt das
// (auf Vercel wirkungslos, aber harmlos).
dns.setDefaultResultOrder("ipv4first");

const DATA = new URL("../data/data.json", import.meta.url);
const OUT = new URL("../data/player-images.json", import.meta.url);
const API = "https://en.wikipedia.org/w/api.php";
const UA =
  "NFLDraftScoutingBot/1.0 (https://www.nfldraft-scouting.de; info@marketingberatung-dill.de)";

// Als frei akzeptierte Lizenzen
const FREE = /(cc[-\s]?(by|by-sa|zero|0)|public domain|^pd|no restrictions|attribution)/i;
// "CC BY-NC-SA" enthaelt "cc by" und rutschte frueher durch FREE. Nicht-
// kommerzielle (NC) und Keine-Bearbeitung-Lizenzen (ND, Zuschnitt!) sind fuer
// diese Seite nicht zulaessig.
const NONFREE = /\b(nc|nd)\b|non-?commercial|no-?deriv|fair use|non-free/i;
const SUFFIX = /^(jr|sr|ii|iii|iv|v)\.?$/i;
const COMMONS = "https://commons.wikimedia.org/w/api.php";
// Von Hand gepruefte Fehltreffer der Commons-Suche (Datei zeigt eine andere
// Person). Format: Slug -> Liste gesperrter Dateititel.
const BLOCKED_FILES = {
  // Kategorie sagt Jeremiah Smith, die Beschreibung aber "Image of gio hird,
  // florida gators WR" - widerspruechlich, deshalb gesperrt.
  "jeremiah-smith": ["File:Jeremiah Smith 2024.jpg"],
};

function slug(name) {
  // Muss identisch zu getPlayerSlug (lib/player-service.ts) und slugify
  // (scripts/build_2027.py) bleiben - inklusive Umlaut-Transliteration.
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[.'’]/g, "");
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
  if (!FREE.test(license) || restrictions || NONFREE.test(license)) {
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

async function commonsApi(params) {
  const qs = new URLSearchParams({ format: "json", ...params });
  const res = await fetch(`${COMMONS}?${qs}`, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`commons ${res.status}`);
  return res.json();
}

const plain = (s) =>
  (s || "")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Zweiter Weg fuer Spieler ohne Wikipedia-Artikel: direkte Suche nach
 * Dateien auf Wikimedia Commons. Weil Namenstreffer allein wertlos sind
 * (fuer "Charlie Becker" liefert Commons einen Dompteur von 1924), muss
 * jede Datei vier Pruefungen bestehen:
 *  1. voller Name als zusammenhaengende Wortfolge im Dateititel,
 *  2. Football-Kontext ("football" oder Schulname) in Titel/Beschreibung/Kategorien,
 *  3. Aufnahmedatum nicht vor 2019 (die Spieler sind um die 20),
 *  4. freie Lizenz ohne NC/ND, ohne Einschraenkungen.
 */
async function findCommonsImage(player) {
  const tokens = nameTokens(player.name);
  if (tokens.length < 2) return null;
  const phrase = new RegExp(tokens.map((t) => t.replace(/[^a-z0-9]/g, "")).join("[\\s_\\-.,']+"), "i");
  const search = await commonsApi({
    action: "query",
    list: "search",
    srnamespace: "6",
    srsearch: `"${player.name}"`,
    srlimit: "10",
  });
  const blocked = new Set(BLOCKED_FILES[slug(player.name)] || []);
  const titles = (search?.query?.search || [])
    .map((h) => h.title)
    .filter((t) => !blocked.has(t) && phrase.test(plain(t).replace(/^file:/, "")))
    .filter((t) => /\.(jpe?g|png|webp)$/i.test(t));
  if (!titles.length) return null;

  const info = await commonsApi({
    action: "query",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "extmetadata|url",
    iiurlwidth: "640",
  });
  const school = plain(player.college).replace(/\(.*\)/, "").trim();
  const byTitle = new Map(Object.values(info?.query?.pages || {}).map((p) => [p.title, p]));
  for (const t of titles) {
    const ii = byTitle.get(t)?.imageinfo?.[0];
    if (!ii) continue;
    const md = ii.extmetadata || {};
    const license = (md.LicenseShortName?.value || md.License?.value || "").trim();
    if (!FREE.test(license) || NONFREE.test(license) || (md.Restrictions?.value || "").trim()) continue;
    const context = plain(`${t} ${md.ImageDescription?.value} ${md.Categories?.value} ${md.ObjectName?.value}`);
    if (!context.includes("football") && !(school && context.includes(school))) continue;
    const year = Number((md.DateTimeOriginal?.value || "").match(/(19|20)\d{2}/)?.[0] || (t.match(/(19|20)\d{2}/) || [])[0] || 0);
    if (year && year < 2019) continue;
    const artist =
      (md.Artist?.value || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "Wikimedia Commons";
    return {
      url: ii.thumburl || ii.url,
      license,
      artist,
      sourceUrl: ii.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(t)}`,
      file: t,
      via: "commons-search",
    };
  }
  return null;
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
      // Die Commons-Suche nur auf ausdruecklichen Wunsch (--commons): Ihre
      // Treffer brauchen eine Sichtung von Hand (siehe BLOCKED_FILES) und
      // duerfen deshalb nicht ungeprueft beim Deploy (prebuild) live gehen.
      const img =
        (await findImage(pl.name)) ||
        (process.argv.includes("--commons") ? await findCommonsImage(pl) : null);
      if (img) {
        out[key] = img;
        found++;
        console.log(`[player-images] ${pl.name}: ${img.license}${img.file ? ` (${img.file})` : ""}`);
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
