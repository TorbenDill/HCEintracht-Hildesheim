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

export function getPlayers(): Player[] {
  return players;
}

export function getBoardMeta(): BoardMeta {
  return boardMeta as BoardMeta;
}

export function getMockDraft(): MockPick[] {
  return mockdraft as MockPick[];
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find(
    (p) => p.name.toLowerCase().replace(/\s+/g, "-").replace(/[.']/g, "") === slug
  );
}

export function getPlayerSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[.']/g, "");
}

export function getPlayerImage(playerName: string): string {
  const slug = playerName.trim().split(/\s+/).join("-");
  return `https://www.nfldraftbuzz.com/PlayerImages/${slug}.png`;
}

export function getPlayersByPosition(position: string): Player[] {
  return players
    .filter((p) => p.position.toLowerCase() === position.toLowerCase())
    .sort((a, b) => a.ranking_pos - b.ranking_pos);
}

export function getTop100(): Player[] {
  return players
    .filter((p) => p.ranking_overall !== null)
    .sort((a, b) => (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999))
    .slice(0, 100);
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
