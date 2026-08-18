// Baut data/europe-radar.json fuer die Seite /europa-talente.
//
// Regeln:
//  - nur Spieler mit >= 2 unabhaengigen Quellen (Regel im Seitenfuss)
//  - Hudl-Link nur, wenn das Profil existiert UND die Schule zum College passt
//  - Europlayers-Link nur, wenn Team bzw. Position + Koerpermasse zum Spieler passen
//  - Instagram nur bei belegter Zuordnung (aktuell keine belegbare Quelle)
//  - Spieler mit bekanntem NFL-Vertrag werden markiert, nicht stillschweigend
//    als Europa-Kandidat gefuehrt
import fs from "node:fs";

const pool = JSON.parse(fs.readFileSync("pool-2plus.json", "utf8"));
// Die ausfuehrlich gescouteten Spieler stehen oben auf der Seite als Karte.
// Sie bleiben im Radar (damit Positionsfilter vollstaendig sind), werden aber
// als Detailprofil markiert, statt kommentarlos doppelt aufzutauchen.
const detailNames = new Set(
  JSON.parse(
    fs.readFileSync(
      "C:/Users/torbe/Downloads/HCEintracht-Hildesheim/data/europe-talents.json",
      "utf8",
    ),
  ).players.map((p) => p.name.toLowerCase()),
);
const hudl = JSON.parse(fs.readFileSync("hudl-matched.json", "utf8"));
// Europlayers: nur die verifizierten Treffer aus verify-europlayers.mjs.
// Ein reiner Namenstreffer reicht nicht - es gibt dort z. B. einen zweiten
// Tyler Walker (Benedictine statt Montana Western), der sonst faelschlich
// verlinkt worden waere.
const epMatched = JSON.parse(fs.readFileSync("europlayers-matched.json", "utf8"));

// Hudl
const hudlByKey = new Map(hudl.map((h) => [h.key, h.url]));

const epByKey = new Map(epMatched.map((e) => [e.key, e.url]));

// Belegte NFL-Bindungen (recherchiert, mit Quelle im Kommentar)
const NFL_STATUS = {
  // ncaa.com, 2026-08-07: "former DII star now with the Atlanta Falcons"
  "Jack Strand|NCAA Division II": "Unter Vertrag bei den Atlanta Falcons (Stand 08/2026) – kein Europa-Kandidat.",
};

// Die Quellen schreiben die Class mal aus, mal abgekuerzt ("senior" vs. "Sr.").
const CLASS_LABEL = {
  fr: "Freshman", "fr.": "Freshman", freshman: "Freshman",
  so: "Sophomore", "so.": "Sophomore", sophomore: "Sophomore",
  jr: "Junior", "jr.": "Junior", junior: "Junior",
  sr: "Senior", "sr.": "Senior", senior: "Senior",
  gr: "Graduate", "gr.": "Graduate", graduate: "Graduate", "grad student": "Graduate",
  "redshirt freshman": "Redshirt Freshman",
  "redshirt sophomore": "Redshirt Sophomore",
  "redshirt junior": "Redshirt Junior",
  "redshirt senior": "Redshirt Senior",
  "fifth-year senior": "Fifth-Year Senior",
};
const normClass = (c) => (c ? CLASS_LABEL[c.toLowerCase().trim()] ?? c : null);

// Hometown-Reste absichern: falls doch mal Script-Text durchrutscht, lieber
// nichts anzeigen als Muell.
const cleanHometown = (h) => {
  if (!h) return null;
  const parts = h.split(",").map((s) => s.trim());
  if (parts.length < 2) return h.length > 60 ? null : h;
  // Nur der letzte Teil wird am Satzende gekappt - "St. Petersburg" im ersten
  // Teil darf nicht zu "St" werden.
  const tail = parts[1].replace(/\.\s+\S.*$/, "").replace(/\.$/, "").trim();
  const out = `${parts[0]}, ${tail}`;
  return out.length > 60 || /[{};]|function|window\./.test(out) ? null : out;
};

let epHits = 0, hudlHits = 0, nflFlagged = 0;

const players = pool.map((p) => {
  const key = `${p.name}|${p.division}`;

  const europlayers_url = epByKey.get(key) ?? null;
  if (europlayers_url) epHits++;

  const hudl_url = hudlByKey.get(key) ?? null;
  if (hudl_url) hudlHits++;
  const nfl_note = NFL_STATUS[key] ?? null;
  if (nfl_note) nflFlagged++;

  return {
    name: p.name,
    position: p.position,
    college: p.college,
    division: p.division,
    class_year: normClass(p.class_year),
    height: p.height,
    weight: p.weight,
    hometown: cleanHometown(p.hometown),
    honors: p.honors,
    sources: p.sources,
    europlayers_url,
    hudl_url,
    instagram: null,
    nfl_note,
    has_detail: detailNames.has(p.name.toLowerCase()),
  };
});

// Sortierung: Division, dann Positionsgruppe, dann Name
const DIV_ORDER = { "NCAA Division II": 0, "NCAA Division III": 1, NAIA: 2 };
const POS_ORDER = ["QB", "RB", "WR", "TE", "OL", "T", "G", "C", "DL", "DE", "DT", "LB", "DB", "CB", "S", "K", "P", "LS", "RS", "RET", "APB", "AP", "ATH", "ST"];
players.sort(
  (a, b) =>
    DIV_ORDER[a.division] - DIV_ORDER[b.division] ||
    (POS_ORDER.indexOf(a.position) + 1 || 99) - (POS_ORDER.indexOf(b.position) + 1 || 99) ||
    a.name.localeCompare(b.name),
);

const out = {
  updated: "2026-08-18",
  note:
    "Alle All-America-Auswahlen der Saison 2025 aus NCAA Division II, Division III und NAIA, " +
    "die sich mit mindestens zwei unabhängigen Quellen belegen lassen – ausgewertet wurden " +
    "die Teams von Associated Press, AFCA und D3football.com. Europlayers- und Hudl-Links " +
    "erscheinen nur, wenn dort wirklich ein Profil existiert und eindeutig diesem Spieler " +
    "zugeordnet werden konnte.",
  players,
};

fs.writeFileSync("europe-radar.json", JSON.stringify(out, null, 2));
console.log(`Spieler: ${players.length}`);
console.log(`Europlayers-Links (verifiziert): ${epHits}`);
console.log(`Hudl-Links: ${hudlHits}`);
console.log(`NFL-Markierungen: ${nflFlagged}`);
console.log(`Auch als Detailprofil: ${players.filter((p) => p.has_detail).length}`);
const byDiv = {};
players.forEach((p) => (byDiv[p.division] = (byDiv[p.division] ?? 0) + 1));
console.log("Nach Division:", byDiv);
