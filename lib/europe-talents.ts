import data from "@/data/europe-talents.json";

/**
 * Eigene, vom NFL-Draft-Board vollständig getrennte Kategorie: D2-/D3-/NAIA-
 * Talente, die für europäische Ligen (v. a. die ELF) spannend wären. Läuft
 * NICHT durch scripts/build_2027.py, hat keinen Draft-Rang und keine
 * NFL-Draft-Eligibility-Logik – bewusst kein Big Board.
 */
export type EuropeTalent = {
  name: string;
  position: string;
  college: string;
  division: string;
  class_year: string;
  height: string | null;
  weight: string | null;
  highlight: string;
  report_de: string;
  sources: string[];
  source_urls?: Record<string, string>;
};

// unknown-Zwischenschritt: unterschiedlich geformte source_urls-Objekte je
// Eintrag lassen TS eine zu spezifische Literal-Union ableiten (siehe
// player-service.ts fuer denselben Fall).
const talents = data.players as unknown as EuropeTalent[];

export function getEuropeTalents(): EuropeTalent[] {
  return talents;
}

export function getEuropeTalentsMeta(): { updated: string; intro: string } {
  return { updated: data.updated, intro: data.intro };
}

export function getEuropeTalentSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[.'’]/g, "");
}
