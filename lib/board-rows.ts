import { getPlayers, getPlayerSlug, byOverallRank } from "@/lib/player-service";
import { getMover } from "@/lib/movers";
import { getSeasonSummary } from "@/lib/season";

/**
 * Schlanke Zeile für die Board-Ansichten. Wird auf dem Server gebaut und als
 * Prop an die Client-Komponenten übergeben – so landen weder die Scouting-
 * Reports (data.json) noch die Saisonstatistik im Browser-Bundle.
 */
export type BoardRow = {
  slug: string;
  name: string;
  position: string;
  college: string;
  rank: number;
  posRank: number;
  projection: string | null;
  tags: string[];
  deutsch: boolean;
  season: string | null;
  hasNews: boolean;
  mover: { delta: number; isNew: boolean } | null;
};

export function getBoardRows(): BoardRow[] {
  return getPlayers()
    .filter((p) => p.ranking_overall != null && !p.naechste_generation)
    .sort(byOverallRank)
    .map((p) => {
      const s = getSeasonSummary(p);
      return {
        slug: getPlayerSlug(p.name),
        name: p.name,
        position: p.position,
        college: p.college,
        rank: p.ranking_overall as number,
        posRank: p.ranking_pos,
        projection: p.projection ?? null,
        tags: p.piktogramme.slice(0, 3),
        deutsch: !!p.deutsch,
        season: s?.hasStats ? s.line : null,
        hasNews: !!p.update_de,
        mover: getMover(p.name),
      };
    });
}
