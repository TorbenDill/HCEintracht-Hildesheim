import visuals from "@/data/visuals.json";

export type Visual = {
  slot: string;
  url: string;
  urlSmall: string;
  alt: string;
  avgColor: string;
  photographer: string;
  photographerUrl: string;
  pexelsUrl: string;
};

const data = visuals as Record<string, Visual>;

/** Liefert das Build-Time-Foto für einen Slot – oder null (graceful fallback). */
export function getVisual(slot: "hero" | "info" | "simulator"): Visual | null {
  const v = data[slot];
  return v && v.url ? v : null;
}
