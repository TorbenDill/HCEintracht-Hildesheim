import { getPlayers, type Player } from "@/lib/player-service";

const MIN_FOR_PAGE = 2; // eigene Seite erst ab 2 Prospects (Qualität > Dünn-Content)

export function collegeSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type College = { name: string; slug: string; players: Player[] };

function buildMap(): Map<string, Player[]> {
  const m = new Map<string, Player[]>();
  for (const p of getPlayers()) {
    const c = (p.college || "").trim();
    if (!c) continue;
    if (!m.has(c)) m.set(c, []);
    m.get(c)!.push(p);
  }
  for (const arr of m.values()) {
    arr.sort(
      (a, b) => (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999)
    );
  }
  return m;
}

/** Colleges mit eigener Seite (>= MIN_FOR_PAGE Prospects), stärkste zuerst. */
export function getColleges(): College[] {
  return [...buildMap().entries()]
    .filter(([, arr]) => arr.length >= MIN_FOR_PAGE)
    .map(([name, players]) => ({ name, slug: collegeSlug(name), players }))
    .sort(
      (a, b) =>
        b.players.length - a.players.length || a.name.localeCompare(b.name)
    );
}

export function getCollegeBySlug(slug: string): College | null {
  return getColleges().find((c) => c.slug === slug) ?? null;
}

/** Slug der College-Seite, falls es eine gibt (für Cross-Links). */
export function getCollegeLink(name: string): string | null {
  const c = (name || "").trim();
  const found = getColleges().find((x) => x.name === c);
  return found ? found.slug : null;
}
