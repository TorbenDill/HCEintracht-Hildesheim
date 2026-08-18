// Parst die AP-All-America-Artikel 2025 (Division II, III, NAIA).
//
// Zwei Eigenheiten der AP-Seiten, die den naiven Parser brechen:
//  1. Im Artikelkoerper stehen die Abschnittsueberschriften teils als LEERE
//     <h2></h2>; die benannten Ueberschriften liegen in einem separaten Block.
//     Deshalb: jedes h2 im Koerper ist eine Grenze, die Namen kommen der Reihe
//     nach aus der Liste der benannten Ueberschriften.
//  2. Die Feldreihenfolge variiert: meist "Name, School, class, H-H, W, Hometown",
//     bei einzelnen Eintraegen aber "Name, class, School". Daher wird das
//     Class-Year-Token gesucht statt fix indiziert.
import fs from "node:fs";

const ARTICLES = [
  { file: "ap_d2-allamerica-0ad6e7d6e3b0bf5023d6153c96d8f875.html", division: "NCAA Division II", url: "https://apnews.com/article/d2-allamerica-0ad6e7d6e3b0bf5023d6153c96d8f875" },
  { file: "ap_divisioniii-allamerica-1cf272bb511c074c02c1597d95c27239.html", division: "NCAA Division III", url: "https://apnews.com/article/divisioniii-allamerica-1cf272bb511c074c02c1597d95c27239" },
  { file: "ap_naia-football-allamerica-3388d1849dab57d2bac94a0a0b509e65.html", division: "NAIA", url: "https://apnews.com/article/naia-football-allamerica-3388d1849dab57d2bac94a0a0b509e65" },
];

// Der D2- und NAIA-Artikel schreibt Positionen aus, der D3-Artikel kuerzt ab.
// "lineman" bzw. "l" wird spaeter anhand des Abschnitts zu OL oder DL aufgeloest.
const POS_MAP = {
  quarterback: "QB", qb: "QB",
  "running back": "RB", rb: "RB",
  "wide receiver": "WR", wr: "WR",
  "tight end": "TE", te: "TE",
  lineman: "OL", l: "OL", center: "OL", guard: "OL", tackle: "OL", ol: "OL",
  "defensive lineman": "DL", dl: "DL",
  linebacker: "LB", lb: "LB",
  "defensive back": "DB", db: "DB",
  kicker: "K", "place-kicker": "K", k: "K",
  punter: "P", p: "P",
  "all-purpose": "APB", "all-purpose player": "APB", "returner/all-purpose": "APB", ap: "APB",
  "return specialist": "RS", rs: "RS",
  "long snapper": "LS", ls: "LS",
  "utility player": "ATH", ath: "ATH",
};
// Laengste Labels zuerst, damit "defensive lineman" nicht als "l" greift
const POS_RE = new RegExp(
  "^(" + Object.keys(POS_MAP).sort((a, b) => b.length - a.length).map((s) => s.replace(/[/.]/g, "\\$&")).join("|") + ")\\s*—\\s*(.+)$",
  "i",
);
const CLASS_RE = /^(redshirt\s+)?(freshman|sophomore|junior|senior|graduate|grad student|fifth-year senior)$/i;

function clean(s) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#8217;|&rsquo;/g, "’")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const out = [];

for (const art of ARTICLES) {
  // script/style/noscript zuerst entfernen: AP haengt hinter die letzte
  // Roster-Zeile ein Werbe-Script, das sonst in die Hometown rutscht.
  const html = fs
    .readFileSync(art.file, "utf8")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  const sectionNames = [...html.matchAll(/<h2[^>]*>([^<]*)<\/h2>/g)]
    .map((m) => clean(m[1]))
    .filter((t) => /^(First|Second|Third)-team /i.test(t));

  // AP schiebt Promo-Module mit unsauber geschachtelten <p> in die Liste. Ein
  // Match auf Tag-PAARE verschluckt dadurch Roster-Zeilen (z. B. Jack Strand).
  // Deshalb an den OEFFNENDEN Tags schneiden: Inhalt = bis zum naechsten h2/p.
  const opens = [...html.matchAll(/<(h2|p)\b[^>]*>/g)];
  const tokens = opens.map((m, i) => {
    const from = m.index + m[0].length;
    const to = i + 1 < opens.length ? opens[i + 1].index : html.length;
    return { tag: m[1], text: clean(html.slice(from, to)) };
  });

  // Koerper beginnt beim h2 direkt vor der ersten Roster-Zeile
  const firstRoster = tokens.findIndex((t) => t.tag === "p" && POS_RE.test(t.text));
  if (firstRoster < 1) { console.log(`${art.division}: keine Roster-Zeilen gefunden`); continue; }
  let start = firstRoster - 1;
  while (start > 0 && tokens[start].tag !== "h2") start--;

  let sectionIdx = -1;
  let count = 0;
  let lastWasHeading = false;

  for (let i = start; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.tag === "h2") {
      // Direkt aufeinanderfolgende h2 (benannt + leeres Duplikat) sind EINE Grenze
      if (!lastWasHeading) sectionIdx++;
      lastWasHeading = true;
      continue;
    }
    const m = t.text.match(POS_RE);
    if (!m) continue;
    lastWasHeading = false;

    const posRaw = m[1].toLowerCase();
    const repeat = /^\(asterisk\)/.test(m[2]);
    const rest = m[2].replace(/^\(asterisk\)/, "").replace(/\.\s*$/, "").trim();
    const parts = rest.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) continue;

    const name = parts[0];
    const clsIdx = parts.findIndex((p, idx) => idx > 0 && CLASS_RE.test(p));
    let college = null, classYear = null, height = null, weight = null, hometown = null;

    if (clsIdx === -1) {
      college = parts[1] ?? null;
    } else {
      classYear = parts[clsIdx];
      // "Name, class, School" (invertiert) vs. "Name, School, class, ..."
      college = clsIdx === 1 ? parts[2] ?? null : parts.slice(1, clsIdx).join(", ");
      const tail = parts.slice(clsIdx + 1);
      const hIdx = tail.findIndex((p) => /^\d+-\d{1,2}$/.test(p));
      if (hIdx !== -1) {
        height = tail[hIdx].replace("-", "'") + '"';
        if (/^\d{2,3}$/.test(tail[hIdx + 1] ?? "")) weight = tail[hIdx + 1] + " lbs";
        hometown = tail.slice(hIdx + (weight ? 2 : 1)).join(", ") || null;
      } else if (clsIdx !== 1) {
        hometown = tail.join(", ") || null;
      }
    }

    // Im D2-Artikel steht im Koerper ein h2 mehr als es benannte Abschnitte gibt;
    // die Restzeilen gehoeren zum letzten Abschnitt (Second-team defense).
    const section = sectionNames[Math.min(sectionIdx, sectionNames.length - 1)] ?? null;
    const side = section ? section.toLowerCase() : "";
    let position = POS_MAP[posRaw];
    if (posRaw === "lineman" || posRaw === "l") position = /defense/.test(side) ? "DL" : "OL";

    out.push({
      name, position, college, division: art.division,
      class_year: classYear, height, weight, hometown,
      ap_team: section ? section.replace(/^(\w+)-team.*/, "$1") : null,
      ap_section: section, ap_repeat: repeat, ap_url: art.url,
    });
    count++;
  }
  console.log(`${art.division}: ${count} Spieler, Abschnitte: ${JSON.stringify(sectionNames)}`);
}

fs.writeFileSync("ap-allamerica-2025.json", JSON.stringify(out, null, 2));
const byTeam = {}, byDiv = {}, noCollege = [];
for (const p of out) {
  byTeam[p.ap_team ?? "?"] = (byTeam[p.ap_team ?? "?"] ?? 0) + 1;
  byDiv[p.division] = (byDiv[p.division] ?? 0) + 1;
  if (!p.college || !p.class_year) noCollege.push(p.name);
}
console.log("Gesamt:", out.length, "| nach Division:", byDiv, "| nach Team:", byTeam);
if (noCollege.length) console.log("Unvollstaendig:", noCollege.join(", "));
