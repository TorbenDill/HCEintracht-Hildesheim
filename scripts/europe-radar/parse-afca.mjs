// Parst die AFCA-Coaches-All-America-Tabellen 2025 (Division II und III).
// Tabellenspalten: Pos | Name | Ht. | Wt. | Cl. | School | Coach | Hometown (High School)
// Die AFCA waehlt unabhaengig von der AP aus und dient deshalb als Zweitquelle.
import fs from "node:fs";

const FILES = [
  { file: "afca_d2.html", division: "NCAA Division II", url: "https://www.afca.com/virginia-unions-curtis-allen-and-livingstones-kenyon-garner-headline-the-2025-afca-division-ii-coaches-all-america-teams/" },
  { file: "afca_d3.html", division: "NCAA Division III", url: "https://www.afca.com/currys-montie-quinn-and-adrians-ethan-burrows-headline-the-2025-afca-division-iii-coaches-all-america-teams/" },
];

const clean = (s) =>
  s.replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;|&#x27;/g, "’")
    .replace(/\s+/g, " ")
    .trim();

const out = [];

for (const src of FILES) {
  const html = fs.readFileSync(src.file, "utf8");
  let count = 0;

  // Jede Tabelle im Artikel ist ein Team-Abschnitt; die vorangehende Ueberschrift
  // ("First Team-Offense" etc.) steht im Text davor.
  const tables = [...html.matchAll(/<table[\s\S]*?<\/table>/g)];
  for (const tbl of tables) {
    const before = clean(html.slice(Math.max(0, tbl.index - 400), tbl.index));
    const sec = before.match(/((?:First|Second|Third)\s*Team\s*[-–—]?\s*(?:Offense|Defense|Specialists?|Special Teams))\s*$/i);
    const section = sec ? sec[1].replace(/\s+/g, " ") : null;

    const rows = [...tbl[0].matchAll(/<tr[\s\S]*?<\/tr>/g)];
    for (const r of rows) {
      const cells = [...r[0].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => clean(c[1]));
      if (cells.length < 6) continue;
      const [pos, name, ht, wt, cl, school] = cells;
      if (!name || /^name$/i.test(name) || /^pos/i.test(pos)) continue;
      const hometown = cells[7] ?? cells[6] ?? null;

      out.push({
        name,
        position: pos.toUpperCase(),
        college: school,
        division: src.division,
        class_year: cl || null,
        height: /^\d+-\d{1,2}$/.test(ht) ? ht.replace("-", "'") + '"' : null,
        weight: /^\d{2,3}$/.test(wt) ? wt + " lbs" : null,
        hometown: hometown && !/coach/i.test(hometown) ? hometown : null,
        afca_section: section,
        afca_url: src.url,
      });
      count++;
    }
  }
  console.log(`${src.division}: ${count} AFCA-Eintraege`);
}

fs.writeFileSync("afca-allamerica-2025.json", JSON.stringify(out, null, 2));
const bySec = {};
out.forEach((p) => (bySec[p.division + " / " + p.afca_section] = (bySec[p.division + " / " + p.afca_section] ?? 0) + 1));
console.log(bySec);
console.log("Gesamt:", out.length);
console.log("Beispiel:", out[0]);
