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

const players: Player[] = data as Player[];

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
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
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
