// Crawlt den öffentlichen American-Football-Spielerindex von Europlayers.
// robots.txt erlaubt /SearchPlayer.aspx (nur /Member/ und /Pic/ sind gesperrt).
// Die Seite antwortet sehr langsam (15-27 s), daher moderate Parallelität.
// Ergebnis: lokale Slug -> ProfileId-Map für den Offline-Abgleich.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const OUT = "europlayers-index.json";
const CONCURRENCY = 6;
const MAX_PAGE = 420;

const players = new Map();
let done = 0;
let lastNonEmpty = 0;
let queue = Array.from({ length: MAX_PAGE }, (_, i) => i + 1);

async function fetchPage(page, attempt = 1) {
  const url = `https://www.europlayers.com/SearchPlayer.aspx?SportId=1&SortBy=LastName&AscDesc=ASC&PageId=${page}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.text();
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 2000 * attempt));
      return fetchPage(page, attempt + 1);
    }
    process.stdout.write(`FEHLER Seite ${page}: ${err.message}\n`);
    return "";
  }
}

async function worker() {
  while (queue.length) {
    const page = queue.shift();
    // Wenn wir das Ende des Index schon sicher kennen, restliche Seiten sparen.
    if (lastNonEmpty && page > lastNonEmpty + 10) continue;
    const html = await fetchPage(page);
    const hits = [...html.matchAll(/Profile\/(\d+)\/([a-z0-9-]+)/g)];
    for (const [, id, slug] of hits) if (!players.has(slug)) players.set(slug, { id, slug });
    if (hits.length) lastNonEmpty = Math.max(lastNonEmpty, page);
    done++;
    if (done % 20 === 0) {
      process.stdout.write(`fortschritt: ${done} Seiten, ${players.size} Profile (letzte gefüllte Seite: ${lastNonEmpty})\n`);
      fs.writeFileSync(OUT, JSON.stringify([...players.values()]));
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
fs.writeFileSync(OUT, JSON.stringify([...players.values()]));
process.stdout.write(`FERTIG: ${players.size} Europlayers-Profile in ${OUT}\n`);
