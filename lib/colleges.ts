import { getPlayers, byOverallRank, type Player } from "@/lib/player-service";

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

// Einmalig gruppieren + sortieren (statt bei jedem Aufruf neu aufzubauen).
const colleges: College[] = (() => {
  const m = new Map<string, Player[]>();
  for (const p of getPlayers()) {
    const c = (p.college || "").trim();
    if (!c) continue;
    (m.get(c) ?? m.set(c, []).get(c)!).push(p);
  }
  return [...m.entries()]
    .filter(([, arr]) => arr.length >= MIN_FOR_PAGE)
    .map(([name, list]) => ({
      name,
      slug: collegeSlug(name),
      players: [...list].sort(byOverallRank),
    }))
    .sort(
      (a, b) =>
        b.players.length - a.players.length || a.name.localeCompare(b.name)
    );
})();

const bySlug = new Map(colleges.map((c) => [c.slug, c]));
const byName = new Map(colleges.map((c) => [c.name, c]));

/** Colleges mit eigener Seite (>= MIN_FOR_PAGE Prospects), stärkste zuerst. */
export function getColleges(): College[] {
  return colleges;
}

export function getCollegeBySlug(slug: string): College | null {
  return bySlug.get(slug) ?? null;
}

/** Slug der College-Seite, falls es eine gibt (für Cross-Links). */
export function getCollegeLink(name: string): string | null {
  return byName.get((name || "").trim())?.slug ?? null;
}
