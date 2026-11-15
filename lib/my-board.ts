// Datenmodell, Speicherung und Teilen-Link fuer "Mein Big Board".
// Alles bleibt im Browser: localStorage fuer den eigenen Stand, der
// Teilen-Link traegt das Board im URL-Fragment (#board=...), das nie an den
// Server geht. Jeder importierte Wert gilt als fremd und wird streng validiert.

import { getMinPlayer } from "@/lib/players-min";

export type BoardItem =
  | { type: "player"; slug: string }
  | { type: "tier"; id: string; label: string };

/** Eigene Scouting-Notiz je Spieler. Alle Felder optional. */
export type PlayerNote = {
  round?: string; // eigene Draft-Projektion: "1".."7" oder "UDFA"
  plus?: string; // Staerken
  minus?: string; // Schwaechen
  text?: string; // freie Notiz
};
export const ROUNDS = ["1", "2", "3", "4", "5", "6", "7", "UDFA"];
export const NOTE_FIELDS = ["plus", "minus", "text"] as const;

export function hasNote(n: PlayerNote | undefined): boolean {
  return Boolean(n && (n.round || n.plus || n.minus || n.text));
}

export type MyBoard = {
  v: 1;
  name: string;
  items: BoardItem[];
  notes: Record<string, PlayerNote>;
  updated: string; // ISO-Zeitpunkt der letzten Aenderung
};

export const STORAGE_KEY = "nfl-myboard-v1";
export const MAX_ITEMS = 300;
export const MAX_NAME = 60;
export const MAX_TIER_LABEL = 40;
export const MAX_NOTE = 280;
export const SHARE_PARAM = "board";

// Steuerzeichen sowie unsichtbare Richtungs-/Breitenzeichen (Bidi-Spoofing).
// Aus Zeichencodes gebaut, damit keine unsichtbaren Zeichen im Quelltext stehen.
function charClass(ranges: [number, number][]): string {
  return ranges.map(([a, b]) => `${String.fromCharCode(a)}-${String.fromCharCode(b)}`).join("");
}
const INVISIBLE: [number, number][] = [
  [0x7f, 0x7f],
  [0x200b, 0x200f],
  [0x202a, 0x202e],
  [0x2066, 0x2069],
];
const CTRL_ALL = new RegExp(`[${charClass([[0x00, 0x1f], ...INVISIBLE])}]`, "g");
// Wie oben, aber Zeilenumbruch (0x0a) bleibt erlaubt.
const CTRL_NO_NL = new RegExp(`[${charClass([[0x00, 0x09], [0x0b, 0x1f], ...INVISIBLE])}]`, "g");

/** Steuerzeichen raus, Leerraum normalisieren, Laenge kappen. */
export function cleanText(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(CTRL_ALL, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanNoteText(v: unknown): string {
  if (typeof v !== "string") return "";
  return v.replace(CTRL_NO_NL, "").slice(0, MAX_NOTE).trim();
}

/** Notiz validieren; akzeptiert auch das alte Format (reiner String). */
export function sanitizeNote(raw: unknown): PlayerNote | null {
  const src: Record<string, unknown> =
    typeof raw === "string"
      ? { text: raw }
      : raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)
        : {};
  const n: PlayerNote = {};
  if (typeof src.round === "string" && ROUNDS.includes(src.round)) n.round = src.round;
  for (const f of NOTE_FIELDS) {
    const t = cleanNoteText(src[f]);
    if (t) n[f] = t;
  }
  return hasNote(n) ? n : null;
}

let counter = 0;
export function newTierId(): string {
  counter += 1;
  return `t${Date.now().toString(36)}${counter.toString(36)}`;
}

/**
 * Beliebigen (fremden) Wert in ein gueltiges Board ueberfuehren: unbekannte
 * Slugs fallen raus, Duplikate werden entfernt, Texte gekappt. Gibt null
 * zurueck, wenn danach nichts Brauchbares uebrig bleibt.
 */
export function sanitizeBoard(raw: unknown): MyBoard | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (!Array.isArray(r.items)) return null;

  const seen = new Set<string>();
  const items: BoardItem[] = [];
  for (const it of r.items.slice(0, MAX_ITEMS)) {
    if (!it || typeof it !== "object") continue;
    const o = it as Record<string, unknown>;
    if (o.type === "player" && typeof o.slug === "string") {
      const p = getMinPlayer(o.slug);
      if (!p || p.ranking_overall == null || seen.has(o.slug)) continue;
      seen.add(o.slug);
      items.push({ type: "player", slug: o.slug });
    } else if (o.type === "tier") {
      items.push({
        type: "tier",
        id: typeof o.id === "string" && /^[a-z0-9]{1,24}$/i.test(o.id) ? o.id : newTierId(),
        label: cleanText(o.label, MAX_TIER_LABEL) || "Tier",
      });
    }
  }

  const notes: Record<string, PlayerNote> = {};
  if (r.notes && typeof r.notes === "object") {
    for (const [slug, note] of Object.entries(r.notes as Record<string, unknown>)) {
      if (!seen.has(slug)) continue;
      const n = sanitizeNote(note);
      if (n) notes[slug] = n;
    }
  }

  if (!items.some((i) => i.type === "player")) return null;
  return {
    v: 1,
    name: cleanText(r.name, MAX_NAME) || "Mein Big Board",
    items,
    notes,
    updated:
      typeof r.updated === "string" && !Number.isNaN(Date.parse(r.updated))
        ? r.updated
        : new Date().toISOString(),
  };
}

export function loadBoard(): MyBoard | null {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? sanitizeBoard(JSON.parse(s)) : null;
  } catch {
    return null;
  }
}

export function saveBoard(b: MyBoard): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
    return true;
  } catch {
    return false; // voller Speicher / privater Modus
  }
}

// ---- Teilen-Link ---------------------------------------------------------
// Kompaktformat: Spieler als Slug, Tier-Trenner als "~Label". Notizen gehen
// bewusst NICHT mit in den Link (privat). Base64url ueber UTF-8.

function toB64Url(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(s: string): string {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function encodeShare(b: MyBoard): string {
  const list = b.items.map((i) => (i.type === "player" ? i.slug : `~${i.label}`));
  return toB64Url(JSON.stringify({ n: b.name, l: list }));
}

export function decodeShare(token: string): MyBoard | null {
  // Laengenlimit vor dem Dekodieren (gegen absichtlich riesige Links).
  if (!token || token.length > 12000 || !/^[A-Za-z0-9_-]+$/.test(token)) return null;
  try {
    const data = JSON.parse(fromB64Url(token)) as { n?: unknown; l?: unknown };
    if (!Array.isArray(data.l)) return null;
    const items = data.l
      .slice(0, MAX_ITEMS)
      .map((e) =>
        typeof e === "string" && e.startsWith("~")
          ? { type: "tier", label: e.slice(1) }
          : { type: "player", slug: e }
      );
    return sanitizeBoard({ name: data.n, items, notes: {} });
  } catch {
    return null;
  }
}

export function boardPlayers(b: MyBoard): string[] {
  return b.items.flatMap((i) => (i.type === "player" ? [i.slug] : []));
}
