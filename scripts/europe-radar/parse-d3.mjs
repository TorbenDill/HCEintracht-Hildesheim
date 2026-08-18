// Parst das D3football.com-All-America-Team 2025 (First/Second/Third Team).
// Spalten: Pos. | Name | School | Yr. | Hometown
// D3football.com waehlt unabhaengig von AP und AFCA aus -> taugliche Zweitquelle.
import fs from "node:fs";

const URL = "https://www.d3football.com/awards/all-americans/2025";
const html = fs.readFileSync("d3_direct.html", "utf8");

const clean = (s) =>
  s.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

const out = [];
let section = null;

// Die Seite nutzt eine durchgehende Tabelle; Abschnittszeilen ("First team offense")
// stehen als eigene Zeile mit nur einer gefuellten Zelle.
for (const r of [...html.matchAll(/<tr[\s\S]*?<\/tr>/g)]) {
  const cells = [...r[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => clean(c[1]));
  const filled = cells.filter(Boolean);

  const secMatch = filled[0]?.match(/^((?:First|Second|Third|Fourth|Fifth) team (?:offense|defense|specialists?))/i);
  if (secMatch && filled.length <= 2) {
    section = secMatch[1];
    continue;
  }
  if (filled.length < 4) continue;
  const [pos, name, school, yr] = filled;
  if (/^pos/i.test(pos) || /^name$/i.test(name)) continue;
  if (!section) continue;

  out.push({
    name,
    position: pos.toUpperCase(),
    college: school,
    division: "NCAA Division III",
    class_year: yr || null,
    height: null,
    weight: null,
    hometown: filled[4] ?? null,
    d3_section: section,
    d3_url: URL,
  });
}

fs.writeFileSync("d3football-allamerica-2025.json", JSON.stringify(out, null, 2));
const bySec = {};
out.forEach((p) => (bySec[p.d3_section] = (bySec[p.d3_section] ?? 0) + 1));
console.log("D3football-Eintraege:", out.length);
console.log(bySec);
console.log("Beispiel:", out[0]);
