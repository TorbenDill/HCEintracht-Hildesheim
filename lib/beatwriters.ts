import notesData from "@/data/beatwriter-notes.json";
import writersData from "@/data/beatwriters.json";

// Anmerkungen von Team-Beatwritern zu College-Prospects. Gepflegt von der
// Redaktionszentrale (core/nfl_beatwriter.py, woechentlich). Texte sind
// sinngemaesse deutsche Zusammenfassungen mit Link zum Originalartikel,
// keine woertlichen Zitate. "gering" bewertete Erwaehnungen werden
// gespeichert, aber nicht angezeigt.

export type BeatWert = "hoch" | "mittel" | "gering";

export type BeatNote = {
  writer: string;
  team: string;
  url: string;
  titel: string;
  datum: string;
  text: string;
  wert: BeatWert;
  begruendung: string;
};

export type BeatWriter = {
  team: string;
  writer: string;
  outlet: string;
  role?: string;
  author_url?: string;
  paywall?: string;
  glaubwuerdigkeit?: "hoch" | "mittel" | "niedrig";
};

const NOTES = (notesData as { stand: string | null; notes: Record<string, BeatNote[]> }).notes;
const WRITERS = (writersData as { stand: string | null; writers: Record<string, BeatWriter> }).writers;

export const BEAT_STAND: string | null = (notesData as { stand: string | null }).stand;

export function getBeatNotes(slug: string): (BeatNote & { by: BeatWriter })[] {
  if (!Object.hasOwn(NOTES, slug)) return [];
  return NOTES[slug]
    .filter((n) => n.wert !== "gering" && Object.hasOwn(WRITERS, n.writer))
    .sort((a, b) => (a.wert === b.wert ? b.datum.localeCompare(a.datum) : a.wert === "hoch" ? -1 : 1))
    .map((n) => ({ ...n, by: WRITERS[n.writer] }));
}

export function getBeatWriters(): (BeatWriter & { id: string })[] {
  return Object.entries(WRITERS)
    .map(([id, w]) => ({ id, ...w }))
    .sort((a, b) => a.team.localeCompare(b.team));
}
