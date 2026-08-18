// Parst die AP-Little-All-America-Tabellen (2025) aus dem Wikitext in
// strukturierte Spielerdatensaetze: Name, Position, College, Division.
import fs from "node:fs";

const wiki = fs.readFileSync("little.wiki", "utf8");
const lines = wiki.split("\n");

const DIVISION_BY_SECTION = {
  "NCAA Division II First team": "NCAA Division II",
  "NCAA Division III First team": "NCAA Division III",
  "NAIA First team": "NAIA",
};

const POS_MAP = {
  Quarterback: "QB",
  "Running back": "RB",
  "Wide receiver": "WR",
  "Tight end": "TE",
  "Offensive line": "OL",
  "Defensive line": "DL",
  Linebacker: "LB",
  "Defensive back": "DB",
  Kicker: "K",
  "Place-kicker": "K",
  Punter: "P",
  "All-purpose": "APB",
  "All-purpose player": "APB",
  "Return specialist": "RS",
  "Long snapper": "LS",
};

// [[Ziel|Anzeige]] oder [[Ziel]] -> Anzeigetext
function unlink(s) {
  return s
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2")
    .replace(/\[\[([^\]]*)\]\]/g, "$1")
    .replace(/<ref[^>]*>.*?<\/ref>/g, "")
    .replace(/<ref[^>]*\/>/g, "")
    .replace(/'''/g, "")
    .trim();
}

const players = [];
let division = null;
let currentPos = null;
let rowsLeft = 0; // wie viele Folgezeilen die aktive rowspan-Position noch abdeckt
let pendingCells = [];

for (const raw of lines) {
  const sec = raw.match(/^==\s*(.+?)\s*==$/);
  if (sec) {
    division = DIVISION_BY_SECTION[sec[1]] ?? null;
    currentPos = null;
    continue;
  }
  if (!division) continue;

  if (raw.startsWith("|-")) {
    pendingCells = [];
    continue;
  }
  if (!raw.startsWith("|") || raw.startsWith("|}")) continue;
  if (/colspan=/.test(raw)) continue; // Offense/Defense-Trennzeilen

  const cell = raw.replace(/^\|\s*/, "");
  // Zellen mit rowspan tragen die Position fuer mehrere Folgezeilen
  const rowspan = raw.match(/rowspan="(\d+)"\s*\|(.*)$/);
  if (rowspan) {
    currentPos = unlink(rowspan[2]);
    rowsLeft = Number(rowspan[1]);
    pendingCells = [];
    continue;
  }
  pendingCells.push(unlink(cell));

  if (rowsLeft > 0) {
    // Innerhalb einer rowspan-Gruppe: Zeile ist nur Spieler | Team
    if (pendingCells.length === 2) {
      const [name, team] = pendingCells;
      players.push({ name, position: POS_MAP[currentPos] ?? currentPos, college: team, division });
      pendingCells = [];
      rowsLeft--;
    }
  } else if (pendingCells.length === 3) {
    // Eigenstaendige Zeile: Position | Spieler | Team
    const [pos, name, team] = pendingCells;
    currentPos = pos;
    players.push({ name, position: POS_MAP[pos] ?? pos, college: team, division });
    pendingCells = [];
  }
}

// Teamnamen aufraeumen (Wiki-Artikelreste)
for (const p of players) {
  p.college = p.college.replace(/\s+football.*$/i, "").replace(/#.*$/, "").trim();
}

const byDiv = {};
for (const p of players) byDiv[p.division] = (byDiv[p.division] ?? 0) + 1;
console.log("Gesamt:", players.length, JSON.stringify(byDiv));
console.log(players.slice(0, 5));
console.log("...");
console.log(players.slice(-5));
fs.writeFileSync("little-all-america-2025.json", JSON.stringify(players, null, 2));
