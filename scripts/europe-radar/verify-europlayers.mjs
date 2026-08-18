// Prueft Europlayers-Kandidaten. Der gecrawlte Index enthaelt nur Name und
// Profil-ID - ein Namenstreffer allein waere zu schwach, um einem deutschen
// Klub einen Link zu praesentieren. Das oeffentliche Profil nennt aber Position,
// Groesse, Gewicht und Staatsbuergerschaft. Ein Treffer gilt nur als bestaetigt,
// wenn Positionsgruppe UND Koerpermasse zum College-Datensatz passen.
import fs from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const CONCURRENCY = 4; // Europlayers ist langsam, hier bewusst zurueckhaltend

const pool = JSON.parse(fs.readFileSync("pool-2plus.json", "utf8"));
const index = JSON.parse(fs.readFileSync("europlayers-index.json", "utf8"));

const slugOf = (name) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'.]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const bySlug = new Map();
for (const e of index) {
  if (!bySlug.has(e.slug)) bySlug.set(e.slug, []);
  bySlug.get(e.slug).push(e);
}

const POS_GROUP = {
  QB: "QB", RB: "RB", FB: "RB", WR: "WR", TE: "TE",
  OL: "OL", T: "OL", G: "OL", C: "OL", OT: "OL", OG: "OL",
  DL: "DL", DE: "DL", DT: "DL", NT: "DL",
  LB: "LB", ILB: "LB", OLB: "LB",
  DB: "DB", CB: "DB", S: "DB", FS: "DB", SS: "DB",
};
// Europlayers schreibt Positionen aus
const EP_POS = [
  [/quarterback/i, "QB"], [/running back|full ?back/i, "RB"], [/wide receiver/i, "WR"],
  [/tight end/i, "TE"], [/offensive (line|tackle|guard)|center/i, "OL"],
  [/defensive (line|tackle|end)/i, "DL"], [/linebacker/i, "LB"],
  [/corner ?back|safety|defensive back/i, "DB"],
];

const inchesOf = (h) => {
  const m = (h ?? "").match(/(\d+)'(\d+)/);
  return m ? Number(m[1]) * 12 + Number(m[2]) : null;
};
const lbsOf = (w) => {
  const m = (w ?? "").match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

const jobs = [];
for (const p of pool) {
  const cands = bySlug.get(slugOf(p.name)) ?? [];
  for (const c of cands) jobs.push({ player: p, cand: c });
}
console.log(`${jobs.length} Europlayers-Kandidaten fuer ${pool.length} Spieler`);

const confirmed = new Map();
const rejected = [];
let done = 0;

async function worker() {
  while (jobs.length) {
    const { player, cand } = jobs.shift();
    const url = `https://www.europlayers.com/Profile/${cand.id}/${cand.slug}`;
    let text = "";
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const html = await res.text();
      text = html
        .replace(/<script[\s\S]*?<\/script>/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&#39;|&#x27;|&rsquo;|&#8217;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ");
    } catch (err) {
      rejected.push({ player: player.name, url, reason: "nicht erreichbar: " + err.message });
      done++;
      continue;
    }

    const posText = (text.match(/Position:\s*(.*?)\s*Age:/i) ?? [])[1] ?? "";
    const epGroups = EP_POS.filter(([re]) => re.test(posText)).map(([, g]) => g);
    const wantGroup = POS_GROUP[player.position.toUpperCase()] ?? null;

    // "183 cm - 6' 0''" aber auch "183 cm - 6'" ohne Zollangabe
    const epIn = text.match(/Height:\s*\d+\s*cm\s*-\s*(\d+)\s*'\s*(\d+)?/);
    const epInches = epIn ? Number(epIn[1]) * 12 + Number(epIn[2] ?? 0) : null;
    const epLbs = Number((text.match(/Weight:\s*\d+\s*kg\s*-\s*(\d+)\s*lbs/) ?? [])[1]) || null;

    // Staerkstes Signal: Europlayers nennt das aktuelle Team
    const epTeam = (text.match(/Current team:\s*(.*?)\s*(?:Please login|Highlight|$)/i) ?? [])[1] ?? "";
    const collegeTokens = player.college.toLowerCase().replace(/\(.*?\)/g, " ").split(/[^a-z]+/).filter((t) => t.length > 3 && !["state", "university", "college"].includes(t));
    const teamOk = epTeam && collegeTokens.length ? collegeTokens.some((t) => epTeam.toLowerCase().includes(t)) : null;

    const wantInches = inchesOf(player.height);
    const wantLbs = lbsOf(player.weight);

    const posOk = wantGroup && epGroups.length ? epGroups.includes(wantGroup) : null;
    const htOk = wantInches && epInches ? Math.abs(wantInches - epInches) <= 2 : null;
    const wtOk = wantLbs && epLbs ? Math.abs(wantLbs - epLbs) <= 20 : null;

    const checks = [posOk, htOk, wtOk].filter((v) => v !== null);
    // Team-Treffer allein reicht (eindeutig), sonst mind. zwei stimmige Merkmale
    const passed = teamOk === true || (checks.length >= 2 && checks.every(Boolean));

    if (passed) {
      confirmed.set(`${player.name}|${player.division}`, {
        url,
        evidence: { posText: posText.trim().slice(0, 60), epTeam, epInches, epLbs, posOk, htOk, wtOk, teamOk },
      });
    } else {
      rejected.push({
        player: player.name, url, college: player.college,
        reason: `nicht belegt (Team "${epTeam}" ${teamOk}, Position ${posOk} [${posText.slice(0, 40)}], Groesse ${htOk}, Gewicht ${wtOk})`,
      });
    }
    if (++done % 10 === 0) console.log(`${done} geprueft, ${confirmed.size} bestaetigt`);
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
fs.writeFileSync("europlayers-matched.json", JSON.stringify([...confirmed].map(([k, v]) => ({ key: k, ...v })), null, 2));
fs.writeFileSync("europlayers-rejected.json", JSON.stringify(rejected, null, 2));
console.log(`\nBestaetigt: ${confirmed.size} | verworfen: ${rejected.length}`);
[...confirmed].forEach(([k, v]) => console.log("  ", k, "->", v.url, JSON.stringify(v.evidence)));
