// Parst das D2CCA-All-America-Team 2025 aus dem PDF (via pdf-text.mjs).
// Zeilenformat: "<Pos> <Name...> <School...> <Class> <Hometown, ST> <Conference>"
//
// Name und School sind nicht durch ein Trennzeichen getrennt. Die Schule wird
// deshalb gegen die bereits bekannten College-Namen aus AP/AFCA aufgeloest;
// nur wenn das fehlschlaegt, greift die Heuristik "Name = erste zwei Woerter".
import fs from "node:fs";

const lines = JSON.parse(fs.readFileSync("d2cca-lines.json", "utf8"));
const known = JSON.parse(fs.readFileSync("pool-2plus.json", "utf8"))
  .concat(JSON.parse(fs.readFileSync("pool-single.json", "utf8")))
  .filter((p) => p.division === "NCAA Division II");

const normSchool = (s) =>
  s.toLowerCase().replace(/\(.*?\)/g, " ").replace(/[^a-z ]/g, " ").replace(/\s+/g, " ").trim();
const knownSchools = new Set(known.map((p) => normSchool(p.college)));
// Schreibvarianten zwischen den Quellen
const SCHOOL_ALIAS = {
  "colorado state pueblo": "csu pueblo",
  "minnesota state moorhead": "msu moorhead",
  indianapolis: "uindy",
  "california pa": "california pa",
};

// Das D2CCA-Team unterscheidet die Secondary (CB/S) und die Line feiner als
// die AP-Artikel - fehlt eine dieser Positionen hier, verschwinden lautlos
// ganze Zeilen aus dem Ergebnis.
const POS = /^(QB|RB|FB|WR|TE|OL|OT|OG|C|DL|DE|DT|NT|LB|ILB|OLB|DB|CB|S|FS|SS|PK|P|RS|AP|ATH|K|LS)\b/;
const CLASS = /^(R-)?(Fr|So|Jr|Sr|Gr)\.$/;
const CLASS_LABEL = { Fr: "Freshman", So: "Sophomore", Jr: "Junior", Sr: "Senior", Gr: "Graduate" };

const out = [];
let team = null, side = null;

for (const { text } of lines) {
  const t = text.trim();
  if (/^(FIRST|SECOND|THIRD) TEAM$/i.test(t)) { team = t.split(" ")[0]; continue; }
  if (/^(OFFENSE|DEFENSE|SPECIAL TEAMS?)$/i.test(t)) { side = t; continue; }
  if (!POS.test(t) || !team) continue;

  const parts = t.split(/\s+/);
  const position = parts.shift();
  const clsIdx = parts.findIndex((p) => CLASS.test(p));
  if (clsIdx < 2) continue; // braucht mindestens Name + Schule davor

  const clsRaw = parts[clsIdx];
  const rs = clsRaw.startsWith("R-");
  const cls = clsRaw.replace("R-", "").replace(".", "");
  const class_year = (rs ? "Redshirt " : "") + (CLASS_LABEL[cls] ?? cls);

  const head = parts.slice(0, clsIdx); // Name + School
  const tail = parts.slice(clsIdx + 1); // Hometown + Conference

  // Schule von hinten aufloesen: laengste passende Endung gewinnt
  let split = -1;
  for (let n = 1; n <= head.length - 2 && n <= 4; n++) {
    const cand = normSchool(head.slice(head.length - n).join(" "));
    if (knownSchools.has(cand) || knownSchools.has(SCHOOL_ALIAS[cand] ?? "")) split = head.length - n;
  }
  if (split === -1) split = 2; // Fallback: Vor- + Nachname

  const name = head.slice(0, split).join(" ");
  const college = head.slice(split).join(" ");
  const hometown = tail.slice(0, -1).join(" ").replace(/,$/, "") || null;

  out.push({
    name, position, college,
    division: "NCAA Division II",
    class_year, height: null, weight: null,
    hometown: hometown || null,
    d2cca_team: team,
    d2cca_side: side,
  });
}

fs.writeFileSync("d2cca-allamerica-2025.json", JSON.stringify(out, null, 2));
const byTeam = {};
out.forEach((p) => (byTeam[p.d2cca_team + " " + p.d2cca_side] = (byTeam[p.d2cca_team + " " + p.d2cca_side] ?? 0) + 1));
console.log("D2CCA-Eintraege:", out.length, byTeam);
out.slice(0, 6).forEach((p) => console.log(` ${p.position.padEnd(3)} ${p.name.padEnd(20)} ${p.college.padEnd(24)} ${p.class_year.padEnd(18)} ${p.hometown ?? ""}`));
const suspicious = out.filter((p) => p.name.split(" ").length > 3 || p.college.length < 3);
if (suspicious.length) console.log("Pruefen:", suspicious.map((p) => `${p.name} / ${p.college}`).join(" | "));
