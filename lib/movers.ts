import history from "@/data/rank-history.json";
import { getPlayers, getPlayerSlug, type Player } from "@/lib/player-service";

const previous = (history as { previous: Record<string, number> }).previous || {};
const hasHistory = Object.keys(previous).length > 0;

export type Mover = {
  player: Player;
  delta: number; // positiv = nach oben (Riser), negativ = nach unten (Faller)
  isNew: boolean;
};

// Alles einmalig beim Modul-Load berechnen: eine Liste der Bewegungen und
// eine Name -> Bewegung-Map für O(1)-Lookups im Board.
const allMovers: Mover[] = [];
const moverByName = new Map<string, { delta: number; isNew: boolean }>();

if (hasHistory) {
  for (const p of getPlayers()) {
    if (p.ranking_overall == null) continue;
    const prev = previous[getPlayerSlug(p.name)];
    let entry: Mover | null = null;
    if (prev == null) {
      entry = { player: p, delta: 0, isNew: true };
    } else if (prev !== p.ranking_overall) {
      entry = { player: p, delta: prev - p.ranking_overall, isNew: false };
    }
    if (entry) {
      allMovers.push(entry);
      moverByName.set(p.name, { delta: entry.delta, isNew: entry.isNew });
    }
  }
}

/** Bewegung eines Spielers seit dem letzten Update (oder null). */
export function getMover(name: string): { delta: number; isNew: boolean } | null {
  return moverByName.get(name) ?? null;
}

export function getRisers(limit = 5): Mover[] {
  return allMovers
    .filter((m) => !m.isNew && m.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit);
}

export function getFallers(limit = 5): Mover[] {
  return allMovers
    .filter((m) => !m.isNew && m.delta < 0)
    .sort((a, b) => a.delta - b.delta)
    .slice(0, limit);
}

export function getNewcomers(limit = 5): Mover[] {
  return allMovers
    .filter((m) => m.isNew)
    .sort(
      (a, b) => (a.player.ranking_overall ?? 999) - (b.player.ranking_overall ?? 999)
    )
    .slice(0, limit);
}

export function hasMovement(): boolean {
  return allMovers.length > 0;
}
