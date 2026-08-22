// Gleicht die Radar-Spieler gegen American Football International ab, das
// Fachmedium fuer europaeische Verpflichtungen. AFI vergibt pro Spieler ein
// Tag (/tag/<name>/) und schreibt den Namen in den Artikel-Slug - beides
// laesst sich offline gegen unsere Namensliste matchen, ohne jeden Artikel
// einzeln zu laden.
//
// robots.txt von AFI setzt Crawl-delay: 10 - wird hier eingehalten.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const DELAY = 10_000;

const players = JSON.parse(fs.readFileSync("europe-radar.json", "utf8")).players;
const slugOf = (n) =>
  n.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const targets = new Map();
for (const p of players) {
  const s = slugOf(p.name);
  if (!targets.has(s)) targets.set(s, []);
  targets.get(s).push(p);
}

const idx = fs.readFileSync("afi_idx.xml", "utf8");
const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1])
  // WordPress nummeriert die Post-Sitemaps aufsteigend nach Alter: -1 ist die
  // NEUESTE. Fuer Verpflichtungen der Saison 2026 zaehlen daher 1 bis 3.
  .filter((u) => /post_tag|posts-post-[123]\.xml/.test(u));
console.log(`${maps.length} Sitemaps pruefen, ${targets.size} Namen`);

const hits = new Map();
for (const [i, url] of maps.entries()) {
  if (i) await new Promise((r) => setTimeout(r, DELAY)); // Crawl-delay einhalten
  let xml = "";
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(45000) });
    xml = await res.text();
  } catch (e) {
    console.log(`  ${url}: ${e.message}`);
    continue;
  }
  let found = 0;
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const loc = m[1];
    for (const slug of targets.keys()) {
      // Tag-URL endet exakt auf den Namen; Artikel-Slug enthaelt ihn
      if (new RegExp(`/tag/${slug}/?$`).test(loc) || loc.includes(`-${slug}-`) || loc.endsWith(`-${slug}/`)) {
        if (!hits.has(slug)) hits.set(slug, new Set());
        hits.get(slug).add(loc);
        found++;
      }
    }
  }
  console.log(`  ${url.split("/").pop()}: ${found} Treffer (kumuliert ${hits.size} Namen)`);
}

const out = [...hits].map(([slug, urls]) => ({
  slug,
  players: targets.get(slug).map((p) => `${p.name} (${p.position}, ${p.college})`),
  urls: [...urls],
}));
fs.writeFileSync("afi-hits.json", JSON.stringify(out, null, 2));
console.log(`\n${out.length} Spieler mit AFI-Erwaehnung:`);
out.forEach((h) => console.log(` ${h.players.join(" / ")}\n   ${h.urls.slice(0, 3).join("\n   ")}`));
