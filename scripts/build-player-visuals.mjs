// Visuelle Daten fuer Spieler ohne frei lizenziertes Foto: Rueckennummer
// (aus dem offiziellen Roster via data/season-2026.json) und Teamfarben
// (ESPN-Team-Schnittstelle). PlayerAvatar rendert daraus eine Trikot-Karte
// statt eines Initialen-Kreises. Logos werden bewusst NICHT verwendet
// (Markenrecht) – nur Farben und Nummer.
//
// Aufruf: node scripts/build-player-visuals.mjs
// Ausgabe: data/player-visuals.json  (Slug -> { number, primary, secondary })
import { readFileSync, writeFileSync } from "node:fs";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const ROOT = new URL("../", import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, ROOT), "utf8"));
const ESPN = "https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=1000";

// Unsere Schulnamen -> ESPN "location", wo abweichend.
const ALIAS = {
  Miami: "Miami",
  "Ole Miss": "Ole Miss",
  California: "California",
  "Boise St": "Boise State",
};

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[.'’]/g, "");

// FCS-Spieler fehlen bei cfbstats; Nummern hier von ESPN (Stand Oktober 2026).
const NUMBER_OVERRIDES = { "matti-krueger": "90", "konstantin-paschos": "99" };

// Sehr helle Sekundaerfarben (Weiss) taugen nicht als Kontrastfarbe auf
// hellem Grund – dann eine dunkle Variante der Primaerfarbe nehmen.
function lum(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function main() {
  const res = await fetch(ESPN, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`ESPN ${res.status}`);
  const teams = (await res.json()).sports[0].leagues[0].teams.map((t) => t.team);
  // Bei Namensgleichheit (Miami FL/OH) gewinnt der erste FBS-Eintrag mit Farbe;
  // "Miami (OH)" heisst bei ESPN "Miami (OH)", "Miami" ist Florida.
  const byLocation = new Map();
  for (const t of teams) if (t.color && !byLocation.has(t.location)) byLocation.set(t.location, t);

  const data = read("data/data.json");
  const season = read("data/season-2026.json");
  const out = {};
  const missing = [];
  for (const p of data) {
    const slug = slugify(p.name);
    const team = byLocation.get(ALIAS[p.college] || p.college);
    const roster = season.board[slug] || season.extra[slug];
    if (!team) missing.push(`${p.name} (${p.college})`);
    const primary = team?.color ? `#${team.color}` : null;
    let secondary = team?.alternateColor ? `#${team.alternateColor}` : null;
    if (!secondary || secondary === primary) secondary = "#ffffff";
    // Lesbarkeit der Nummer: zu geringer Helligkeitsabstand (z. B. Bucknell
    // Dunkelblau auf Dunkelblau) -> Weiss bzw. Schwarz je nach Grundfarbe.
    if (primary && Math.abs(lum(primary.slice(1)) - lum(secondary.slice(1))) < 0.3) {
      secondary = lum(primary.slice(1)) < 0.5 ? "#ffffff" : "#111111";
    }
    out[slug] = {
      number:
        NUMBER_OVERRIDES[slug] ??
        (roster?.number && /^\d+$/.test(roster.number) ? roster.number : null),
      primary,
      secondary,
    };
  }
  writeFileSync(new URL("data/player-visuals.json", ROOT), JSON.stringify(out, null, 2) + "\n");
  const withNum = Object.values(out).filter((v) => v.number).length;
  const withColor = Object.values(out).filter((v) => v.primary).length;
  console.log(`[player-visuals] ${data.length} Spieler | Nummer: ${withNum} | Teamfarbe: ${withColor}`);
  if (missing.length) console.log("Ohne Teamfarbe:", missing.join(", "));
}

main().catch((e) => {
  console.log(`[player-visuals] Fehler: ${e.message}`);
});
