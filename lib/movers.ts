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
  // Bewegung wird RELATIV gemessen: nur gegenüber den Spielern, die in beiden
  // Ständen gerankt sind. Sonst gälte jeder, der durch neu aufgenommene
  // Spieler nach hinten rutscht, als "Absteiger" – obwohl sich seine Position
  // im Feld gar nicht verändert hat (so standen im September alle deutschen
  // Prospects mit "▼ 14" in der Absteiger-Liste).
  const prevRank = (p: Player) => previous[getPlayerSlug(p.name)];
  const ranked = getPlayers().filter((p) => p.ranking_overall != null);
  const common = ranked.filter((p) => prevRank(p) != null);
  const oldOrder = new Map(
    [...common].sort((a, b) => prevRank(a) - prevRank(b)).map((p, i) => [p.name, i] as const)
  );
  const newOrder = new Map(
    [...common]
      .sort((a, b) => (a.ranking_overall ?? 0) - (b.ranking_overall ?? 0))
      .map((p, i) => [p.name, i] as const)
  );

  for (const p of ranked) {
    let entry: Mover | null = null;
    if (prevRank(p) == null) {
      entry = { player: p, delta: 0, isNew: true };
    } else {
      const delta = oldOrder.get(p.name)! - newOrder.get(p.name)!;
      if (delta !== 0) entry = { player: p, delta, isNew: false };
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
