import playersMin from "@/data/players-min.json";

// Schlanke Spielerliste für Client-Komponenten (Simulator, Merkliste, Suche):
// nur Name, Position, College, Projektion und Rang – ohne Scouting-Reports.
// Erzeugt von scripts/build_2027.py, gekeyt über den Spieler-Slug.
export type MinPlayer = {
  slug: string;
  name: string;
  position: string;
  college: string;
  projection?: string | null;
  ranking_overall: number | null;
};

const ALL: MinPlayer[] = Object.entries(
  playersMin as Record<string, Omit<MinPlayer, "slug">>
).map(([slug, p]) => ({ slug, ...p }));

const BY_SLUG = new Map(ALL.map((p) => [p.slug, p]));

/** Alle Spieler (inkl. "Nächste Generation" ohne Rang). */
export function getMinPlayers(): MinPlayer[] {
  return ALL;
}

/** Nur draft-berechtigte, gerankte Spieler – sortiert nach Overall-Rang. */
export function getRankedMinPlayers(): MinPlayer[] {
  return ALL.filter((p) => p.ranking_overall != null).sort(
    (a, b) => (a.ranking_overall as number) - (b.ranking_overall as number)
  );
}

export function getMinPlayer(slug: string): MinPlayer | undefined {
  return BY_SLUG.get(slug);
}
