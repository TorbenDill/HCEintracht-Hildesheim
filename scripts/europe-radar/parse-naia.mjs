// Parst die AFCA-NAIA-All-America-Teams 2025 aus dem Victory-Sports-Network-Bericht.
// Tabellenspalten: Name | School | Pos. | Cl. | Hometown
// Unabhaengig von der AP-Auswahl und daher als Zweitquelle fuer NAIA-Spieler nutzbar.
import fs from "node:fs";

const URL = "https://victorysportsnetwork.com/2025/12/11/2025-afca-naia-football-all-america-teams-announced/";
const html = fs.readFileSync("naia_vsn.html", "utf8");

const clean = (s) =>
  s.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

const out = [];
const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)];

for (const tbl of tables) {
  const before = clean(html.slice(Math.max(0, tbl.index - 500), tbl.index));
  const sec = before.match(/((?:First|Second|Third)\s+Team\s+(?:Offense|Defense|Specialists?|Special Teams))\s*$/i);
  const section = sec ? sec[1] : null;

  for (const r of [...tbl[0].matchAll(/<tr[\s\S]*?<\/tr>/g)]) {
    const cells = [...r[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => clean(c[1])).filter((c) => c !== "");
    if (cells.length < 4) continue;
    const [name, school, pos, cl] = cells;
    if (/^name$/i.test(name) || /^school$/i.test(school)) continue;
    if (!/^[A-Z]/.test(name)) continue;
    out.push({
      name,
      position: pos.toUpperCase().replace(/\./g, ""),
      college: school,
      division: "NAIA",
      class_year: cl || null,
      height: null,
      weight: null,
      hometown: cells[4] ?? null,
      naia_section: section,
      naia_url: URL,
    });
  }
}

fs.writeFileSync("naia-afca-2025.json", JSON.stringify(out, null, 2));
const bySec = {};
out.forEach((p) => (bySec[p.naia_section ?? "?"] = (bySec[p.naia_section ?? "?"] ?? 0) + 1));
console.log("NAIA-AFCA-Eintraege:", out.length, bySec);
console.log("Beispiel:", out[0], out[out.length - 1]);
