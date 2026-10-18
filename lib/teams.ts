import teamsData from "@/data/nfl-teams.json";
import {
  getMockDraft,
  getPlayersByPosition,
  byOverallRank,
  type MockPick,
  type Player,
} from "@/lib/player-service";

// Alle 32 NFL-Teams mit Bedarf, Bilanz und ihren Erstrundenpicks. Durch
// Trades kann ein Team mehrere Picks haben (Jets 2027: drei) oder keinen
// (sein Pick gehört dann einem anderen Team). Die Reihenfolge der Picks
// selbst steht in data/draft-teams.json (Simulator).
type TeamRow = {
  team: string;
  teamAbbr: string;
  record: string;
  needs: string[];
  picks: number[];
  traded_away: { pick: number; to: string }[];
};

export type DraftTeam = TeamRow & {
  /** Erster eigener Erstrundenpick oder null, wenn der Pick getauscht wurde. */
  pick: number | null;
  /** Position in der Draft-Reihenfolge (eigener oder abgegebener Pick). */
  order: number;
};

const source = teamsData as { stand: string; recordAfterWeek: number; teams: TeamRow[] };

const teams: DraftTeam[] = source.teams
  .map((t) => {
    const own = [...t.picks].sort((a, b) => a - b);
    const order = own[0] ?? Math.min(...t.traded_away.map((x) => x.pick));
    return { ...t, picks: own, pick: own[0] ?? null, order };
  })
  .sort((a, b) => a.order - b.order);

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

/** Stand der Bilanzen, z. B. { stand: "2026-10-18", week: 5 }. */
export function getStandingsMeta(): { stand: string; week: number } {
  return { stand: source.stand, week: source.recordAfterWeek };
}

export function getTeams(): DraftTeam[] {
  return teams;
}

export function getTeamByAbbr(abbr: string): DraftTeam | null {
  return teams.find((t) => t.teamAbbr.toLowerCase() === abbr.toLowerCase()) ?? null;
}

/** Alle Mock-Picks eines Teams (0, 1 oder mehrere). */
export function getMockPicks(team: DraftTeam): MockPick[] {
  return getMockDraft().filter((m) => m.teamAbbr === team.teamAbbr);
}

/** Teams mit benachbarter Draft-Position (für interne Cross-Links). */
export function getPickNeighbors(team: DraftTeam, limit = 6): DraftTeam[] {
  return teams
    .filter((t) => t.teamAbbr !== team.teamAbbr)
    .sort((a, b) => Math.abs(a.order - team.order) - Math.abs(b.order - team.order))
    .slice(0, limit)
    .sort((a, b) => a.order - b.order);
}

/** Kürzel -> voller Teamname (für "via"-Angaben). */
export function teamName(abbr: string): string {
  return teams.find((t) => t.teamAbbr === abbr)?.team ?? abbr;
}

/** Pro Bedarf die besten verfügbaren Board-Prospects (dedupliziert). */
export function getFitsForNeeds(
  needs: string[]
): { need: string; players: Player[] }[] {
  const used = new Set<string>();
  return needs.map((need) => {
    const positions = NEED_MAP[need] ?? [need];
    const pool = positions.flatMap((pos) => getPlayersByPosition(pos));
    if (positions.length > 1) pool.sort(byOverallRank);
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
