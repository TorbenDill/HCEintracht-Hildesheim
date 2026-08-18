// Fuehrt die drei unabhaengigen Auswahlquellen der Saison 2025 zusammen:
//   - AP All-America (Little All-America), Division II / III / NAIA
//   - AFCA Coaches All-America, Division II / III
//   - Wikipedia-Tabelle der AP-Little-All-America-First-Teams
// Ergebnis: ein Pool mit Herkunftsnachweis je Spieler. Die Seite veroeffentlicht
// nur Spieler mit mindestens zwei unabhaengigen Quellen.
import fs from "node:fs";

const ap = JSON.parse(fs.readFileSync("ap-allamerica-2025.json", "utf8"));
const afca = JSON.parse(fs.readFileSync("afca-allamerica-2025.json", "utf8"));
const wiki = JSON.parse(fs.readFileSync("little-all-america-2025.json", "utf8"));
const naia = JSON.parse(fs.readFileSync("naia-afca-2025.json", "utf8"));
const d3fb = JSON.parse(fs.readFileSync("d3football-allamerica-2025.json", "utf8"));

function normName(s) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[’'.]/g, "")
    .replace(/\b(jr|sr|ii|iii|iv)\b/g, "")
    .replace(/[^a-z ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
const normCollege = (s) => (s ?? "").toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z]/g, "");
const POS_GROUP = { OL: "OL", C: "OL", G: "OL", T: "OL", OT: "OL", OG: "OL", DL: "DL", DE: "DL", DT: "DL", LB: "LB", DB: "DB", CB: "DB", S: "DB", WR: "WR", RB: "RB", QB: "QB", TE: "TE", K: "K", P: "P", PK: "K" };
const group = (p) => POS_GROUP[(p ?? "").toUpperCase()] ?? (p ?? "").toUpperCase();

const pool = []; // {name, position, college, division, ..., sources:{}, honors:[]}

function findMatch(rec) {
  const n = normName(rec.name);
  let best = null;
  for (const m of pool) {
    if (m.division !== rec.division) continue;
    const d = editDistance(n, m._norm);
    if (d > 2) continue;
    // Exakter Name reicht; bei Schreibvarianten zusaetzlich Position ODER Schule
    if (d > 0 && !(group(m.position) === group(rec.position) || normCollege(m.college) === normCollege(rec.college))) continue;
    if (!best || d < best.d) best = { d, m };
  }
  return best?.m ?? null;
}

function add(rec, sourceHost, sourceUrl, honor) {
  let m = findMatch(rec);
  if (!m) {
    m = {
      name: rec.name,
      _norm: normName(rec.name),
      position: rec.position,
      college: rec.college,
      division: rec.division,
      class_year: rec.class_year ?? null,
      height: rec.height ?? null,
      weight: rec.weight ?? null,
      hometown: rec.hometown ?? null,
      honors: [],
      sources: {},
    };
    pool.push(m);
  }
  m.sources[sourceHost] = sourceUrl;
  if (honor) m.honors.push(honor);
  for (const f of ["class_year", "height", "weight", "hometown"]) if (!m[f] && rec[f]) m[f] = rec[f];
  return m;
}

for (const p of ap) add(p, "apnews.com", p.ap_url, `AP ${p.ap_team} Team All-America`);
for (const p of afca) add(p, "afca.com", p.afca_url, "AFCA Coaches All-America");
for (const p of naia) add(p, "victorysportsnetwork.com", p.naia_url, "AFCA NAIA Coaches All-America");
for (const p of d3fb) add(p, "d3football.com", p.d3_url, "D3football.com " + p.d3_section.replace(/ (offense|defense|specialists?)$/i, "") + " All-America");
for (const p of wiki) add(p, "en.wikipedia.org", "https://en.wikipedia.org/wiki/2025_Little_All-America_college_football_team", null);

for (const p of pool) {
  p.honors = [...new Set(p.honors)];
  p.source_count = Object.keys(p.sources).length;
  delete p._norm;
}

const twoPlus = pool.filter((p) => p.source_count >= 2);
const one = pool.filter((p) => p.source_count < 2);

console.log(`Pool gesamt: ${pool.length}`);
console.log(`>= 2 Quellen: ${twoPlus.length}  |  nur 1 Quelle: ${one.length}`);
const byDiv = {}, byPos = {};
twoPlus.forEach((p) => {
  byDiv[p.division] = (byDiv[p.division] ?? 0) + 1;
  byPos[group(p.position)] = (byPos[group(p.position)] ?? 0) + 1;
});
console.log("2+ Quellen nach Division:", byDiv);
console.log("2+ Quellen nach Position:", byPos);
console.log("Nur 1 Quelle nach Division:", one.reduce((a, p) => ((a[p.division] = (a[p.division] ?? 0) + 1), a), {}));

fs.writeFileSync("pool-2plus.json", JSON.stringify(twoPlus, null, 2));
fs.writeFileSync("pool-single.json", JSON.stringify(one, null, 2));
console.log("\nBeispiel:", JSON.stringify(twoPlus[0], null, 1));
