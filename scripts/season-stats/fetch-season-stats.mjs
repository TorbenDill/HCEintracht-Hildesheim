// Saisonstatistiken + Steckbrief-Verifikation fuer alle Board-Spieler.
//
// Quelle: cfbstats.com (statisches HTML, deckt alle FBS-Teams ab, Stand
// jeweils "through <Datum>" im Seitenkopf). Fuer jeden Spieler aus
// data/research2027.json wird das Team-Roster gelesen (Klasse, Position,
// Groesse, Gewicht, Heimatort) und - falls der Spieler Statistiken hat -
// seine Spielerseite (Passing, Rushing, Receiving, Tackles, Sacks, ...).
//
// Ausgabe: data/season-2026.json, gekeyt ueber denselben Slug wie
// getPlayerSlug (lib/player-service.ts).
//
// Aufruf:  node scripts/season-stats/fetch-season-stats.mjs [--extra kandidaten.json]
//   --extra: zusaetzliche [{name, school}] (z. B. Neuzugaenge vor der
//            Aufnahme), landen unter "extra" in der Ausgabe.
//
// Hoeflich crawlen: eine Anfrage nach der anderen, Pause dazwischen,
// Antworten werden in .cache/ zwischengespeichert (nicht im Repo).

import fs from "node:fs";
import path from "node:path";
import dns from "node:dns";

// Auf diesem Rechner laeuft Nodes fetch ueber IPv6 in einen Connect-Timeout,
// waehrend curl funktioniert. IPv4 zuerst behebt das.
dns.setDefaultResultOrder("ipv4first");

const SEASON = 2026;
const BASE = "https://cfbstats.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), "../..");
const CACHE = path.join(ROOT, "scripts/season-stats/.cache");
const OUT = path.join(ROOT, "data/season-2026.json");
const DELAY_MS = 700;

// Unsere Schreibweise -> cfbstats-Teamname (nur wo abweichend).
const SCHOOL_ALIAS = {
  Miami: "Miami (FL)",
  "Ole Miss": "Ole Miss",
  Mississippi: "Ole Miss",
  Cal: "California",
  "Boise St": "Boise State",
  "Southern California": "USC",
  "Central Florida": "UCF",
  "NC State": "North Carolina State",
};

// Namensvarianten (unser Name -> cfbstats-Name), z. B. Spitznamen.
const NAME_ALIAS = {
  "Tae Johnson": "Brauntae Johnson",
  "Justin Evans-Jenkins": "Justin Evans",
  "Nyckoles Harbor": "Nyck Harbor",
  "Alexander Honig": "Alex Honig",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&#039;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .trim();
const norm = (s) =>
  decode(s)
    // Spitznamen in Anfuehrungszeichen weg: Romanas "OJ" Frederique Jr.
    .replace(/"[^"]*"/g, " ")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/[.,'’`-]/g, "")
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
export const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[.'’]/g, "");

let lastFetch = 0;
async function get(urlPath) {
  const file = path.join(CACHE, urlPath.replace(/[^a-z0-9]+/gi, "_") + ".html");
  if (fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  let html;
  // Einzelne Verbindungen laufen sporadisch in Timeouts - bis zu vier
  // Versuche mit wachsender Pause, erst dann aufgeben.
  for (let attempt = 1; ; attempt++) {
    const wait = lastFetch + DELAY_MS * attempt - Date.now();
    if (wait > 0) await sleep(wait);
    lastFetch = Date.now();
    try {
      const res = await fetch(BASE + urlPath, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      html = await res.text();
      break;
    } catch (e) {
      if (attempt >= 4) throw new Error(`${urlPath}: ${e.cause?.code || e.message}`);
      await sleep(2000 * attempt);
    }
  }
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(file, html);
  return html;
}

async function loadTeams() {
  const html = await get(`/${SEASON}/team/index.html`);
  const map = new Map();
  for (const m of html.matchAll(/href="\/\d+\/team\/(\d+)\/index\.html">([^<]+)<\/a>/g)) {
    map.set(decode(m[2]).toLowerCase(), m[1]);
  }
  return map;
}

function parseRoster(html) {
  const rows = [];
  for (const tr of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const tds = [...tr[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((t) => t[1]);
    if (tds.length < 7) continue;
    const link = tds[1].match(/href="([^"]+)"/);
    rows.push({
      number: decode(tds[0].replace(/<[^>]+>/g, "")),
      name: decode(tds[1].replace(/<[^>]+>/g, "")),
      pos: decode(tds[2]),
      yr: decode(tds[3]),
      ht: decode(tds[4]),
      wt: decode(tds[5]),
      hometown: decode(tds[6].replace(/<[^>]+>/g, "")),
      href: link ? link[1] : null,
    });
  }
  return rows;
}

function parsePlayer(html) {
  const through = (html.match(/through (\d{1,2}\/\d{1,2}\/\d{4})/) || [])[1] || null;
  const stats = {};
  for (const t of html.matchAll(/<table class="player-home">([\s\S]*?)<\/table>/g)) {
    const cap = (t[1].match(/<caption>([^<]+)<\/caption>/) || [])[1];
    if (!cap) continue;
    const heads = [...t[1].matchAll(/<th[^>]*class="([^"]+)"[^>]*>/g)].map((h) => h[1]);
    const rows = [...t[1].matchAll(/<tr>\s*(<td[\s\S]*?)<\/tr>/g)];
    if (!rows.length) continue;
    const vals = [...rows[0][1].matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((v) => decode(v[1]));
    const obj = {};
    heads.forEach((h, i) => {
      const v = vals[i];
      if (v === undefined || v === "") return;
      obj[h] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
    });
    stats[decode(cap).toLowerCase()] = obj;
  }
  return { through, stats };
}

async function main() {
  const extraIdx = process.argv.indexOf("--extra");
  const extra = extraIdx > -1 ? JSON.parse(fs.readFileSync(process.argv[extraIdx + 1], "utf8")) : [];
  const research = JSON.parse(fs.readFileSync(path.join(ROOT, "data/research2027.json"), "utf8"));

  const wanted = [
    ...research.players.map((p) => ({ name: p.name, school: p.school, group: "board" })),
    ...extra.map((p) => ({ name: p.name, school: p.school, group: "extra" })),
  ];

  const teams = await loadTeams();
  const rosterCache = new Map();
  const out = { meta: { source: "cfbstats.com", season: SEASON, through: null, generated: new Date().toISOString().slice(0, 10) }, board: {}, extra: {} };
  const problems = [];

  for (const w of wanted) {
    const teamName = (SCHOOL_ALIAS[w.school] || w.school).toLowerCase();
    const teamId = teams.get(teamName);
    if (!teamId) {
      problems.push(`kein FBS-Team: ${w.name} (${w.school})`);
      continue;
    }
    if (!rosterCache.has(teamId)) rosterCache.set(teamId, parseRoster(await get(`/${SEASON}/team/${teamId}/roster.html`)));
    const roster = rosterCache.get(teamId);
    const target = norm(NAME_ALIAS[w.name] || w.name);
    const row = roster.find((r) => norm(r.name) === target);
    if (!row) {
      problems.push(`nicht im Roster: ${w.name} (${w.school})`);
      continue;
    }
    const entry = {
      team: decode([...teams.entries()].find(([, id]) => id === teamId)[0]),
      roster_name: row.name,
      number: row.number,
      pos: row.pos,
      yr: row.yr,
      ht: row.ht,
      wt: row.wt,
      hometown: row.hometown,
      url: `${BASE}/${SEASON}/team/${teamId}/roster.html`,
      stats: null,
      games: null,
    };
    if (row.href) {
      const p = parsePlayer(await get(row.href));
      entry.url = BASE + row.href;
      entry.stats = p.stats;
      entry.games = Math.max(0, ...Object.values(p.stats).map((s) => s.g || 0)) || null;
      if (p.through) out.meta.through = p.through;
    }
    out[w.group][slugify(w.name)] = entry;
  }

  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(`board: ${Object.keys(out.board).length} | extra: ${Object.keys(out.extra).length} | Stand: ${out.meta.through}`);
  if (problems.length) console.log("Nicht zugeordnet:\n  " + problems.join("\n  "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
