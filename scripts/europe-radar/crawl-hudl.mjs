// Durchsucht die oeffentlichen Hudl-Sitemaps (robots.txt erlaubt sie explizit)
// nach Profil-URLs, deren Slug exakt einem unserer Spielernamen entspricht.
// Wichtig: ein Slug-Treffer ist NUR ein Kandidat - Hudl hat Millionen Profile,
// gleiche Namen sind haeufig. Die Zuordnung wird danach gegen die Schule geprueft.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const CONCURRENCY = 10;

const pool = JSON.parse(fs.readFileSync("pool-2plus.json", "utf8"));
const slugOf = (name) =>
  name.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const targets = new Map(); // slug -> [Spieler]
for (const p of pool) {
  const s = slugOf(p.name);
  if (!targets.has(s)) targets.set(s, []);
  targets.get(s).push(p);
}
console.log(`Suche nach ${targets.size} Namens-Slugs in den Hudl-Sitemaps`);

const indexXml = fs.readFileSync("hudl_index.xml", "utf8");
const sitemaps = [...indexXml.matchAll(/<loc>([^<]*a=u[^<]*)<\/loc>/g)].map((m) =>
  m[1].replace(/&amp;/g, "&"),
);
console.log(`${sitemaps.length} Athleten-Sitemaps`);

const found = new Map(); // slug -> Set(url)
let done = 0;
const queue = [...sitemaps];

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(45000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const xml = await res.text();
      for (const m of xml.matchAll(/https:\/\/www\.hudl\.com\/profile\/(\d+)\/([a-z0-9-]+)/g)) {
        const slug = m[2];
        if (!targets.has(slug)) continue;
        if (!found.has(slug)) found.set(slug, new Set());
        found.get(slug).add(m[0]);
      }
    } catch (err) {
      // einzelne Sitemaps duerfen fehlen; Abdeckung wird am Ende ausgewiesen
    }
    if (++done % 250 === 0) {
      console.log(`${done}/${sitemaps.length} Sitemaps, ${found.size} Namen mit Kandidaten`);
      fs.writeFileSync("hudl-candidates.json", JSON.stringify([...found].map(([s, u]) => ({ slug: s, urls: [...u] })), null, 2));
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
fs.writeFileSync(
  "hudl-candidates.json",
  JSON.stringify([...found].map(([s, u]) => ({ slug: s, urls: [...u] })), null, 2),
);
const total = [...found.values()].reduce((a, s) => a + s.size, 0);
console.log(`FERTIG: ${found.size} von ${targets.size} Namen haben Kandidaten, ${total} Kandidaten-URLs`);
