import data from "@/data/data.json";
import boardMeta from "@/data/board-meta.json";
import mockdraft from "@/data/mockdraft.json";

export type Player = {
  name: string;
  position: string;
  college: string;
  height: string;
  weight: string;
  ranking_pos: number;
  ranking_overall: number | null;
  forstner_statement: string | null;
  piktogramme: string[];
  scouting_report_de: string;
  best_case_nfl: string | null;
  worst_case_nfl: string | null;
  // Steckbrief (2027)
  class_year?: string | null;
  projection?: string | null;
  sources?: string[];
  // Optional: Domain -> exakte Artikel-URL, fuer praezise Belege statt nur
  // der Domain-Startseite. Nicht jede Quelle muss hier stehen; ohne Eintrag
  // faellt die Anzeige auf die Domain zurueck.
  source_urls?: Record<string, string>;
  // Qualitaetsstufe (aus der Quellenzahl abgeleitet): "geprueft" (3+ Quellen),
  // "belegt" (Mindeststandard 2 Quellen). Eintraege darunter erreichen das
  // Board nicht (Quellen-Gate im Build).
  quellen_anzahl?: number;
  qualitaet?: "geprueft" | "belegt" | null;
  // Eigene Kategorie: deutsche D1-Prospects (nicht im Consensus-Board gerankt).
  deutsch?: boolean;
  herkunft?: string;
  // Deutsches Talent, das fuer 2027 noch nicht draft-berechtigt ist
  // (Jahrgang 2028+). Laeuft auf /deutsche-prospects in einem eigenen Block
  // und bleibt aus Big Board und Positionsrankings heraus.
  naechste_generation?: boolean;
};

export type BoardMeta = {
  draftYear: number;
  updated: string;
  updateCycle: string;
  sources: { name: string; url: string }[];
  imageSource: { name: string; url: string };
};

export type MockPick = {
  pick: number;
  team: string;
  teamAbbr: string;
  player: string;
  position: string;
  college: string;
  reason_de: string;
};

// unknown-Zwischenschritt: data.json enthaelt je Spieler unterschiedlich
// geformte source_urls-Objekte, wodurch TS aus dem JSON eine zu spezifische
// Literal-Union ableitet, die nicht mehr direkt zu Player[] passt.
const players: Player[] = data as unknown as Player[];

/** Sortier-Comparator: nach Overall-Rank aufsteigend, ungerankt ans Ende. */
export function byOverallRank(a: Player, b: Player): number {
  return (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999);
}

export function getPlayers(): Player[] {
  return players;
}

export function getBoardMeta(): BoardMeta {
  return boardMeta as BoardMeta;
}

export function getMockDraft(): MockPick[] {
  return mockdraft as MockPick[];
}

// Kanonischer Slug. WICHTIG: scripts/build_2027.py (slugify) und
// scripts/fetch-player-images.mjs müssen dieselbe Regel verwenden, da
// rank-history.json und player-images.json über diesen Slug gekeyt sind.
export function getPlayerSlug(name: string): string {
  // Umlaute/ß zuerst transliterieren: Ein Slug mit "ö" liefert unter Next
  // einen 404 (die prerenderte Route matcht die prozentkodierte URL nicht)
  // und landet so auch kaputt in der Sitemap. Für die bisherigen Namen
  // (alle ASCII) ändert dieser Schritt nichts.
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[.'’]/g, "");
}

const bySlug = new Map<string, Player>(
  players.map((p) => [getPlayerSlug(p.name), p])
);

export function getPlayerBySlug(slug: string): Player | undefined {
  return bySlug.get(slug);
}

// Positions-Buckets einmalig vorsortieren (statt Filter+Sort pro Aufruf).
const byPosition = new Map<string, Player[]>();
for (const p of players) {
  // Deutsche Prospects laufen in den Positionsrankings mit – sinnvoll
  // eingeordnet über ihren (aus dem Overall-Rank abgeleiteten) Positions-Rank,
  // ungerankte am unteren Ende der Position.
  // Ausnahme: Die "Nächste Generation" (noch nicht für 2027 draft-berechtigt)
  // bleibt draußen, sonst läse sie sich als Teil des 2027er-Rankings.
  if (p.naechste_generation) continue;
  const key = p.position.toUpperCase();
  (byPosition.get(key) ?? byPosition.set(key, []).get(key)!).push(p);
}
for (const arr of byPosition.values()) {
  arr.sort((a, b) => a.ranking_pos - b.ranking_pos);
}

export function getPlayersByPosition(position: string): Player[] {
  return byPosition.get(position.toUpperCase()) ?? [];
}

const top100 = players
  .filter((p) => p.ranking_overall !== null)
  .sort(byOverallRank)
  .slice(0, 100);

export function getTop100(): Player[] {
  return top100;
}

export function getAllPositions(): string[] {
  const positions = new Set(players.map((p) => p.position));
  return Array.from(positions);
}

export function searchPlayers(query: string): Player[] {
  const q = query.toLowerCase();
  return players.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
  );
}

export function getFeaturedProspect(): Player {
  return players.find((p) => p.ranking_overall === 1) ?? players[0];
}

/**
 * Deutsche D1-Prospects als eigene Kategorie. Sortiert nach Draft-Aussicht
 * (klare NFL-Prospects zuerst), dann alphabetisch.
 */
export function getGermanProspects(): Player[] {
  const rank = (p: Player) =>
    (p.projection ?? "").startsWith("Day 1") ? 0 : 1;
  return players
    .filter((p) => p.deutsch && !p.naechste_generation)
    .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/**
 * Deutsche D1-Spieler, die für den Draft 2027 noch nicht berechtigt sind
 * (Jahrgang 2028 und später). Eigener Block auf /deutsche-prospects, bewusst
 * getrennt vom 2027er-Tier – alphabetisch, da eine Draft-Reihung hier noch
 * keine Aussagekraft hätte.
 */
export function getGermanNextGen(): Player[] {
  return players
    .filter((p) => p.deutsch && p.naechste_generation)
    .sort((a, b) => a.name.localeCompare(b.name));
}

const overallSorted = players
  .filter((p) => p.ranking_overall !== null)
  .sort(byOverallRank);

const sameName = (a: Player, b: Player) =>
  a.name === b.name && a.position === b.position;

/** Spieler mit direkt benachbartem Overall-Rank (fürs interne Verlinken). */
export function getRankNeighbors(player: Player, limit = 4): Player[] {
  const idx = overallSorted.findIndex((p) => sameName(p, player));
  if (idx === -1) return [];
  const out: Player[] = [];
  let lo = idx - 1;
  let hi = idx + 1;
  while (out.length < limit && (lo >= 0 || hi < overallSorted.length)) {
    if (lo >= 0) out.push(overallSorted[lo--]);
    if (out.length < limit && hi < overallSorted.length)
      out.push(overallSorted[hi++]);
  }
  return out.sort(byOverallRank);
}

/** Andere Spieler derselben Position, am nächsten am Positions-Rank. */
export function getPositionPeers(player: Player, limit = 5): Player[] {
  const peers = getPlayersByPosition(player.position).filter(
    (p) => !sameName(p, player)
  );
  peers.sort(
    (a, b) =>
      Math.abs(a.ranking_pos - player.ranking_pos) -
      Math.abs(b.ranking_pos - player.ranking_pos)
  );
  return peers.slice(0, limit).sort((a, b) => a.ranking_pos - b.ranking_pos);
}

export type QualitySummary = {
  total: number;
  geprueft: number; // 3+ Quellen
  belegt: number; // genau 2 Quellen
};

/**
 * Aggregierte Datenqualität über alle Profile. Da das Build-Quellen-Gate nur
 * belegte Spieler (>= 2 Quellen) durchlässt, ist dies ein ehrliches
 * Vertrauens-Signal fürs Board.
 */
export function getQualitySummary(): QualitySummary {
  let geprueft = 0;
  let belegt = 0;
  for (const p of players) {
    if (p.qualitaet === "geprueft") geprueft++;
    else if (p.qualitaet === "belegt") belegt++;
  }
  return { total: players.length, geprueft, belegt };
}
