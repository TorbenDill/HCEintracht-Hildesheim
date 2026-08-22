// Gleicht die Radar-Spieler gegen die europaeische Fachpresse ab: Wer hat
// laengst unterschrieben? Ein rein amerikanischer Blick reicht dafuer nicht.
//
// Lehre aus dem ersten Lauf: check-afi.mjs fand nur Bay Harvey (GFL). Gavin
// Sukup spielt seit Maerz 2026 bei den Salzburg Ducks - gemeldet aber von
// football-austria.com, nicht von AFI. Ein einzelnes Medium deckt den Markt
// nicht ab, deshalb hier mehrere Sitemaps.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const SOURCES = [
  {
    host: "americanfootballinternational.com",
    index: "https://www.americanfootballinternational.com/wp-sitemap.xml",
    // WordPress nummeriert aufsteigend nach Alter: -1 ist die neueste.
    keep: /post_tag|posts-post-[123]\.xml/,
    delayMs: 10_000, // robots.txt: Crawl-delay 10
  },
  {
    host: "football-austria.com",
    index: "https://football-austria.com/sitemap_index.xml",
    keep: /post-sitemap\d*\.xml/,
    delayMs: 2_000,
  },
];

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
console.log(`${targets.size} Namen gegen ${SOURCES.length} Medien pruefen`);

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(45000) });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

const hits = new Map();
for (const src of SOURCES) {
  let maps = [];
  try {
    const idx = await get(src.index);
    maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => src.keep.test(u));
  } catch (e) {
    console.log(`${src.host}: Index nicht erreichbar (${e.message})`);
    continue;
  }
  console.log(`${src.host}: ${maps.length} Sitemaps`);

  for (const [i, url] of maps.entries()) {
    if (i) await new Promise((r) => setTimeout(r, src.delayMs));
    let xml = "";
    try { xml = await get(url); } catch (e) { console.log(`  ${url}: ${e.message}`); continue; }
    let found = 0;
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const loc = m[1];
      for (const slug of targets.keys()) {
        if (new RegExp(`/tag/${slug}/?$`).test(loc) || loc.includes(`-${slug}-`) || loc.endsWith(`-${slug}/`)) {
          const key = `${slug}|${src.host}`;
          if (!hits.has(key)) hits.set(key, new Set());
          hits.get(key).add(loc);
          found++;
        }
      }
    }
    if (found) console.log(`  ${url.split("/").pop()}: ${found} Treffer`);
  }
}

const out = [...hits].map(([key, urls]) => {
  const [slug, host] = key.split("|");
  return { slug, host, players: targets.get(slug).map((p) => `${p.name} (${p.position}, ${p.college})`), urls: [...urls] };
});
fs.writeFileSync("europe-hits.json", JSON.stringify(out, null, 2));
console.log(`\n${out.length} Treffer insgesamt:`);
out.forEach((h) => console.log(` [${h.host}] ${h.players.join(" / ")}\n   ${h.urls.slice(0, 3).join("\n   ")}`));
