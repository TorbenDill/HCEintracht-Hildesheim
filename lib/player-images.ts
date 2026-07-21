import images from "@/data/player-images.json";

export type PlayerPhoto = {
  url: string;
  license: string;
  artist: string;
  sourceUrl: string;
};

const data = images as Record<string, PlayerPhoto>;

/** Frei lizenziertes Foto zum Spieler (oder null -> Initialen-Avatar). */
export function getPlayerPhoto(name: string): PlayerPhoto | null {
  const key = name.toLowerCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
  const p = data[key];
  return p && p.url ? p : null;
}
