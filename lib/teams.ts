import teamsData from "@/data/draft-teams.json";
import mock from "@/data/mockdraft.json";
import { getPlayersByPosition, type Player } from "@/lib/player-service";

export type DraftTeam = {
  pick: number;
  team: string;
  teamAbbr: string;
  needs: string[];
};

type MockPick = {
  pick: number;
  team: string;
  teamAbbr: string;
  player: string;
  position: string;
  college: string;
  reason_de: string;
};

const teams = teamsData as DraftTeam[];
const mockPicks = mock as MockPick[];

// Team-Bedarf (Kürzel) -> Board-Positionen
const NEED_MAP: Record<string, string[]> = {
  QB: ["QB"],
  RB: ["RB"],
  WR: ["WR"],
  TE: ["TE"],
  OT: ["OT"],
  G: ["IOL"],
  C: ["IOL"],
  IOL: ["IOL"],
  OL: ["OT", "IOL"],
  EDGE: ["EDGE"],
  DT: ["DT"],
  DL: ["DT", "EDGE"],
  LB: ["LB"],
  CB: ["CB"],
  S: ["S"],
};

export function teamSlug(abbr: string): string {
  return abbr.toLowerCase();
}

export function getTeams(): DraftTeam[] {
  return [...teams].sort((a, b) => a.pick - b.pick);
}

export function getTeamByAbbr(abbr: string): DraftTeam | null {
  return teams.find((t) => t.teamAbbr.toLowerCase() === abbr.toLowerCase()) ?? null;
}

export function getMockPick(team: DraftTeam): MockPick | null {
  return mockPicks.find((m) => m.teamAbbr === team.teamAbbr) ?? null;
}

/** Pro Bedarf die besten verfügbaren Board-Prospects (dedupliziert). */
export function getFitsForNeeds(
  needs: string[]
): { need: string; players: Player[] }[] {
  const used = new Set<string>();
  return needs.map((need) => {
    const positions = NEED_MAP[need] ?? [need];
    const pool = positions
      .flatMap((pos) => getPlayersByPosition(pos))
      .sort(
        (a, b) => (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999)
      );
    const players: Player[] = [];
    for (const p of pool) {
      if (used.has(p.name)) continue;
      players.push(p);
      used.add(p.name);
      if (players.length >= 3) break;
    }
    return { need, players };
  });
}
