import info from "@/data/positions-info.json";

export type PositionInfo = {
  label: string;
  singular: string;
  lexikon?: string;
  intro: string;
  longtext: string;
  faq: { q: string; a: string }[];
};

const data = info as Record<string, PositionInfo>;

// Anzeige-Reihenfolge (Offense zuerst, dann Defense)
export const POSITION_SEQUENCE = [
  "QB",
  "RB",
  "WR",
  "TE",
  "OT",
  "IOL",
  "EDGE",
  "DT",
  "LB",
  "CB",
  "S",
];

export function getPositionInfo(pos: string): PositionInfo | null {
  return data[pos.toUpperCase()] ?? null;
}

export function getAllPositionKeys(): string[] {
  return POSITION_SEQUENCE.filter((p) => data[p]);
}
