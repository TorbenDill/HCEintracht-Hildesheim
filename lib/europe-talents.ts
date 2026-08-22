import data from "@/data/europe-talents.json";
import radarData from "@/data/europe-radar.json";

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

/**
 * Zweite Ebene derselben Kategorie: das breite Scouting-Radar. Enthaelt die
 * All-America-Auswahlen der Saison 2025 aus Division II, III und NAIA, jeweils
 * mit mindestens zwei unabhaengigen Quellen. Anders als bei den Detailprofilen
 * gibt es hier bewusst KEINEN Fliesstext-Report, sondern nur belegte Fakten -
 * plus die Links zu Europlayers, Hudl und Instagram, sofern ein Profil
 * nachweislich existiert und dem Spieler zugeordnet werden konnte.
 */
export type EuropeRadarPlayer = {
  name: string;
  position: string;
  college: string;
  division: string;
  class_year: string | null;
  height: string | null;
  weight: string | null;
  hometown: string | null;
  honors: string[];
  sources: Record<string, string>;
  europlayers_url?: string | null;
  hudl_url?: string | null;
  instagram?: string | null;
  /** Gesetzt, wenn ein NFL-Vertrag belegt ist – dann kein Europa-Kandidat. */
  nfl_note?: string | null;
  /** Gesetzt, wenn der Spieler in Europa bereits unter Vertrag steht. */
  europe_note?: string | null;
  /** Gesetzt bei belegtem Wechsel an eine FBS-/FCS-Hochschule. */
  transfer_note?: string | null;
  /** Aus der Class abgeleitet: College fertig oder noch gebunden. */
  availability?: "verfuegbar" | "gebunden" | "unbekannt";
  /** Erläutert, wie lange ein gebundener Spieler noch College spielt. */
  eligibility_note?: string | null;
  /** Spieler hat oben auf der Seite zusätzlich ein ausführliches Detailprofil. */
  has_detail?: boolean;
};

const radar = radarData.players as unknown as EuropeRadarPlayer[];

export function getEuropeRadar(): EuropeRadarPlayer[] {
  return radar;
}

export function getEuropeRadarMeta(): {
  updated: string;
  note: string;
  counts: { total: number; europlayers: number; hudl: number; instagram: number };
} {
  return {
    updated: radarData.updated,
    note: radarData.note,
    counts: {
      total: radar.length,
      europlayers: radar.filter((p) => p.europlayers_url).length,
      hudl: radar.filter((p) => p.hudl_url).length,
      instagram: radar.filter((p) => p.instagram).length,
    },
  };
}
