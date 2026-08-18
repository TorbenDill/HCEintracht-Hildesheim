// Prueft die Hudl-Kandidaten: ein Slug-Treffer allein beweist nichts (Hudl hat
// Millionen Profile, "michael-clark" liefert 67 Kandidaten). Die og:description
// eines Profils nennt Schule, Position und Class - erst wenn die Schule zum
// College des Spielers passt, gilt das Profil als zugeordnet.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const CONCURRENCY = 10;

const pool = JSON.parse(fs.readFileSync("pool-2plus.json", "utf8"));
const candidates = JSON.parse(fs.readFileSync("hudl-candidates.json", "utf8"));

const slugOf = (name) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Fuellwoerter, die kein Unterscheidungsmerkmal sind
const STOP = new Set(["university", "college", "state", "st", "the", "of", "football", "mens", "varsity", "team"]);
const tokens = (s) =>
  (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, " ").replace(/[^a-z ]/g, " ")
    .split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t));

// Bekannte Kurzformen aus den Quellen auf die Klarnamen abbilden
const ALIASES = {
  "msu moorhead": "minnesota state moorhead",
  uindy: "indianapolis",
  "uw-river falls": "wisconsin river falls",
  "uw-la crosse": "wisconsin la crosse",
  "uw-whitewater": "wisconsin whitewater",
  "uw-platteville": "wisconsin platteville",
  "uw-oshkosh": "wisconsin oshkosh",
  "csu pueblo": "colorado state pueblo",
  "colorado mines": "colorado school of mines",
  "north central": "north central",
  "mary hardin-baylor": "mary hardin baylor",
};

const bySlug = new Map();
for (const p of pool) {
  const s = slugOf(p.name);
  if (!bySlug.has(s)) bySlug.set(s, []);
  bySlug.get(s).push(p);
}

const jobs = [];
for (const c of candidates) for (const url of c.urls) jobs.push({ slug: c.slug, url });
console.log(`${jobs.length} Kandidatenprofile pruefen`);

const results = [];
let done = 0, failed = 0;

async function worker() {
  while (jobs.length) {
    const job = jobs.shift();
    try {
      const res = await fetch(job.url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const html = await res.text();
      const desc = (html.match(/property="og:description" content="([^"]*)"/) ?? [])[1] ?? "";
      const info = desc.replace(/&#x27;/g, "’").replace(/&amp;/g, "&");
      results.push({ slug: job.slug, url: job.url, info });
    } catch {
      failed++;
    }
    if (++done % 200 === 0) console.log(`${done}/${done + jobs.length} geprueft, ${failed} Fehler`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`Profile geladen: ${results.length}, Fehler: ${failed}`);

// Zuordnen
const matched = new Map(); // "name|division" -> {url, info}
const ambiguous = [];
for (const [slug, players] of bySlug) {
  const cands = results.filter((r) => r.slug === slug);
  for (const p of players) {
    const collegeRaw = (ALIASES[p.college.toLowerCase()] ?? p.college);
    const want = tokens(collegeRaw);
    if (!want.length) continue;

    const hits = cands.filter((c) => {
      const infoLc = c.info.toLowerCase();
      if (/high school/.test(infoLc)) return false; // Highschool-Profile ausschliessen
      const have = tokens(c.info);
      const overlap = want.filter((t) => have.includes(t));
      return overlap.length === want.length || (want.length > 1 && overlap.length >= 2);
    });

    const key = `${p.name}|${p.division}`;
    if (hits.length === 1) matched.set(key, { url: hits[0].url, info: hits[0].info });
    else if (hits.length > 1) ambiguous.push({ key, count: hits.length, urls: hits.map((h) => h.url) });
  }
}

fs.writeFileSync("hudl-matched.json", JSON.stringify([...matched].map(([k, v]) => ({ key: k, ...v })), null, 2));
fs.writeFileSync("hudl-ambiguous.json", JSON.stringify(ambiguous, null, 2));
console.log(`Eindeutig zugeordnet: ${matched.size} | mehrdeutig (verworfen): ${ambiguous.length}`);
console.log("Stichprobe:");
[...matched].slice(0, 10).forEach(([k, v]) => console.log("  ", k, "->", v.info.slice(0, 110)));
