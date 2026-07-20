import teams from "@/data/draft-teams.json";
import type { Player } from "@/lib/player-service";

export type DraftTeam = {
  pick: number;
  team: string;
  teamAbbr: string;
  needs: string[];
};

export function getDraftTeams(): DraftTeam[] {
  return teams as DraftTeam[];
}

/**
 * CPU-Pick: bester verfügbarer Spieler, der einen Team-Bedarf trifft –
 * solange er nicht zu weit über dem besten verfügbaren Spieler (BPA) liegt.
 * Sonst BPA. Eine kleine Zufalls-Reichweite sorgt für Variation pro Lauf.
 */
export function cpuPick(needs: string[], available: Player[]): Player | null {
  if (available.length === 0) return null;
  const bestOverall = available[0];
  const needPlayer = available.find((p) => needs.includes(p.position));
  if (!needPlayer) return bestOverall;
  const needIdx = available.indexOf(needPlayer);
  const reach = 5 + Math.floor(Math.random() * 4); // 5..8
  return needIdx <= reach ? needPlayer : bestOverall;
}

export const POSITION_COLORS: Record<string, string> = {
  QB: "#38bdf8",
  RB: "#4ade80",
  WR: "#ffb020",
  TE: "#ff7ac6",
  OT: "#a78bfa",
  IOL: "#a78bfa",
  EDGE: "#f87171",
  DT: "#fb923c",
  LB: "#5ad1ff",
  CB: "#7cf5b0",
  S: "#c0f060",
};

export function positionColor(pos: string): string {
  return POSITION_COLORS[pos] ?? "#94a3b8";
}
