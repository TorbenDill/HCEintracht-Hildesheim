import images from "@/data/player-images.json";
import { getPlayerSlug } from "@/lib/player-service";

export type PlayerPhoto = {
  url: string;
  license: string;
  artist: string;
  sourceUrl: string;
};

const data = images as Record<string, PlayerPhoto>;

/** Frei lizenziertes Foto zum Spieler (oder null -> Initialen-Avatar). */
export function getPlayerPhoto(name: string): PlayerPhoto | null {
  const p = data[getPlayerSlug(name)];
  return p && p.url ? p : null;
}
