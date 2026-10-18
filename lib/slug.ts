// Kanonischer Spieler-Slug – bewusst in einem eigenen Modul OHNE Daten-
// Importe. Client-Komponenten (z. B. PlayerAvatar) brauchen nur diese
// Funktion; früher zogen sie sie aus lib/player-service und luden damit die
// komplette data.json (≈360 KB inkl. aller Scouting-Reports) in jedes
// Browser-Bundle.
//
// WICHTIG: scripts/build_2027.py (slugify), scripts/fetch-player-images.mjs
// (slug) und scripts/season-stats/fetch-season-stats.mjs (slugify) müssen
// dieselbe Regel verwenden – rank-history.json, player-images.json und
// season-2026.json sind über diesen Slug gekeyt.
export function getPlayerSlug(name: string): string {
  // Umlaute/ß zuerst transliterieren: Ein Slug mit "ö" liefert unter Next
  // einen 404 (die prerenderte Route matcht die prozentkodierte URL nicht).
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[.'’]/g, "");
}
