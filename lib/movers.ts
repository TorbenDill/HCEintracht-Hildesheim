import data from "@/data/data.json";
import history from "@/data/rank-history.json";
import type { Player } from "@/lib/player-service";
import { getPlayerSlug } from "@/lib/player-service";

const players = data as Player[];
const previous = (history as { previous: Record<string, number> }).previous || {};

export type Mover = {
  player: Player;
  delta: number; // positiv = nach oben (Riser), negativ = nach unten (Faller)
  isNew: boolean;
};

/** Bewegung eines Spielers seit dem letzten Update (oder null). */
export function getMover(name: string): { delta: number; isNew: boolean } | null {
  const p = players.find((x) => x.name === name);
  if (!p || p.ranking_overall == null) return null;
  const prev = previous[getPlayerSlug(name)];
  if (prev == null) {
    // Nur als "neu" markieren, wenn es überhaupt schon Historie gibt.
    return Object.keys(previous).length > 0 ? { delta: 0, isNew: true } : null;
  }
  return { delta: prev - p.ranking_overall, isNew: false };
}

function movers(): Mover[] {
  if (Object.keys(previous).length === 0) return [];
  const list: Mover[] = [];
  for (const p of players) {
    if (p.ranking_overall == null) continue;
    const prev = previous[getPlayerSlug(p.name)];
    if (prev == null) {
      list.push({ player: p, delta: 0, isNew: true });
    } else if (prev !== p.ranking_overall) {
      list.push({ player: p, delta: prev - p.ranking_overall, isNew: false });
    }
  }
  return list;
}

export function getRisers(limit = 5): Mover[] {
  return movers()
    .filter((m) => !m.isNew && m.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit);
}

export function getFallers(limit = 5): Mover[] {
  return movers()
    .filter((m) => !m.isNew && m.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, limit);
}

export function getNewcomers(limit = 5): Mover[] {
  return movers()
    .filter((m) => m.isNew)
    .sort(
      (a, b) => (a.player.ranking_overall ?? 999) - (b.player.ranking_overall ?? 999)
    )
    .slice(0, limit);
}

export function hasMovement(): boolean {
  return movers().length > 0;
}
