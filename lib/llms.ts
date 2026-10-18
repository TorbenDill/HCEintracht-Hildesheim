import {
  getBoardMeta,
  getGermanNextGen,
  getGermanProspects,
  getMockDraft,
  getPlayers,
  getPlayerSlug,
  byOverallRank,
  type Player,
} from "@/lib/player-service";
import { getSeasonSummary, seasonLine, seasonThrough } from "@/lib/season";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

// llms.txt / llms-full.txt für KI-Suchmaschinen und Assistenten (GEO).
// Beide Dateien entstehen bei jedem Build aus denselben Daten wie die Seite –
// so kann der Stand nie veralten (die frühere statische Datei versprach noch
// ein Update "alle 14 Tage").

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

const url = (p: Player) => absoluteUrl(`/player/${getPlayerSlug(p.name)}`);

function ranked(): Player[] {
  return getPlayers()
    .filter((p) => p.ranking_overall != null && !p.naechste_generation)
    .sort(byOverallRank);
}

function header(): string[] {
  const meta = getBoardMeta();
  const year = meta.draftYear;
  return [
    `# ${SITE_NAME}`,
    "",
    `> Deutschsprachiges Big Board zum NFL Draft ${year}: Consensus-Ranking aus ` +
      `${meta.consensus.boards} Big Boards und ${meta.consensus.mocks} Mock Drafts ` +
      `(${meta.consensus.source}), ergänzt um eigene Scouting-Reports, ` +
      `Saisonstatistiken 2026 (cfbstats.com, Stand ${seasonThrough()}), ` +
      `Mock Draft Runde 1 und einen Mock-Draft-Simulator. Stand des Boards: ${germanDate(meta.updated)}. ` +
      `${meta.updateCycle}.`,
    "",
    "Sprache: Deutsch. Scouting-Einschätzungen: Philipp Forstner (Forstner Scouting). " +
      "Betreiber: Marketingberatung Dill, Torben Dill, Hildesheim (siehe Impressum).",
    "Zitierhinweis: Ränge und Statistiken immer mit Stand-Datum nennen – das Board " +
      "verändert sich während der College-Saison laufend.",
    "",
  ];
}

export function buildLlmsTxt(): string {
  const meta = getBoardMeta();
  const year = meta.draftYear;
  const board = ranked();
  const germans = getGermanProspects();
  const lines = [
    ...header(),
    "## Hauptseiten",
    "",
    `- [Big Board ${year}](${absoluteUrl("/")}): Gesamtranking, Riser & Faller, Saison-Leader, aktuelle Meldungen.`,
    `- [Mock Draft ${year}](${absoluteUrl("/mock-draft")}): alle 32 Erstrunden-Picks mit Begründung und Consensus-Anteil.`,
    `- [Draft-Simulator](${absoluteUrl("/simulator")}): eigene erste Runde gegen die CPU oder im GM-Modus.`,
    `- [Positionsrankings](${absoluteUrl("/positionen")}): beste Prospects je Position (QB, WR, EDGE, CB …).`,
    `- [Deutsche Prospects](${absoluteUrl("/deutsche-prospects")}): ${germans.length} deutsche Draft-Kandidaten ${year} im US-College-Football (Division I), dazu ${getGermanNextGen().length} Talente der „Nächsten Generation“.`,
    `- [Europa-Talente](${absoluteUrl("/europa-talente")}): europäische Prospects außerhalb Deutschlands.`,
    `- [NFL-Teams](${absoluteUrl("/teams")}): Draft-Position, Bilanz und Bedarf aller 32 Teams.`,
    `- [Colleges](${absoluteUrl("/colleges")}): Prospects nach Hochschule.`,
    `- [Draft-Lexikon](${absoluteUrl("/lexikon")}): Scouting-Begriffe auf Deutsch erklärt.`,
    `- [Methodik](${absoluteUrl("/ueber-uns")}): Quellen, Consensus-Verfahren, Aktualisierung.`,
    `- [Vollständige Daten](${absoluteUrl("/llms-full.txt")}): alle Profile mit Kurzprofil, Saisonzahlen und Mock Draft als Text.`,
    "",
    `## Top 32 (Stand ${germanDate(meta.updated)})`,
    "",
    ...board
      .slice(0, 32)
      .map(
        (p) =>
          `${p.ranking_overall}. [${p.name}](${url(p)}) – ${p.position}, ${p.college}` +
          (p.projection ? ` (Projektion: ${p.projection})` : "")
      ),
    "",
    "## Deutsche Prospects",
    "",
    ...germans.map(
      (p) =>
        `- [${p.name}](${url(p)}) – ${p.position}, ${p.college}` +
        (p.herkunft ? `, aus ${p.herkunft}` : "")
    ),
    "",
    "## Quellen",
    "",
    ...meta.sources.map((s) => `- [${s.name}](${s.url})`),
    "",
  ];
  return lines.join("\n");
}

function profileBlock(p: Player): string[] {
  const season = seasonLine(getSeasonSummary(p));
  const facts = [p.height, p.weight, p.class_year, p.projection && `Projektion ${p.projection}`]
    .filter(Boolean)
    .join(" · ");
  const head =
    p.ranking_overall != null && !p.naechste_generation
      ? `### ${p.ranking_overall}. ${p.name} – ${p.position}, ${p.college}`
      : `### ${p.name} – ${p.position}, ${p.college}`;
  return [
    head,
    "",
    `Profil: ${url(p)}`,
    facts ? `Steckbrief: ${facts}${p.ranking_pos ? ` · Positions-Rang ${p.position} #${p.ranking_pos}` : ""}` : null,
    p.deutsch && p.herkunft ? `Herkunft: ${p.herkunft}` : null,
    season,
    p.update_de ? `Aktuell (${germanDate(p.update_stand ?? "")}): ${p.update_de}` : null,
    p.kurzprofil ? `Einordnung: ${p.kurzprofil}` : null,
    p.best_case_nfl ? `Best Case: ${p.best_case_nfl}` : null,
    p.worst_case_nfl ? `Worst Case: ${p.worst_case_nfl}` : null,
    "",
  ].filter((l): l is string => typeof l === "string");
}

export function buildLlmsFullTxt(): string {
  const meta = getBoardMeta();
  const year = meta.draftYear;
  const board = ranked();
  const unranked = getPlayers().filter(
    (p) => p.ranking_overall == null && !p.naechste_generation
  );
  const nextGen = getGermanNextGen();
  const mock = getMockDraft();
  const lines = [
    ...header(),
    "## Methodik",
    "",
    `Das Ranking verdichtet ${meta.consensus.boards} öffentliche Big Boards und ` +
      `${meta.consensus.mocks} Mock Drafts (${meta.consensus.source}, Stand ` +
      `${germanDate(meta.consensus.stand)}) zu einer Rangfolge; einzelne Experten-Boards ` +
      "(u. a. CBS Sports, ESPN) dienen zur Einordnung von Spielern außerhalb des Consensus. " +
      "Jedes Profil ist mit mindestens zwei unabhängigen Quellen belegt. Saisonzahlen " +
      `stammen von cfbstats.com (Stand ${seasonThrough()}). Scouting-Texte und NFL-Vergleiche ` +
      "sind redaktionelle Einschätzungen.",
    "",
    `## Mock Draft ${year} – Runde 1`,
    "",
    ...mock.map(
      (m) =>
        `${m.pick}. ${m.team}${m.viaTeam ? ` (via ${m.viaTeam})` : ""}: ${m.player} ` +
        `(${m.position}, ${m.college})` +
        (m.consensus_pct != null ? ` – in ${m.consensus_pct} % der Mocks an diesem Pick` : "") +
        `. ${m.reason_de}`
    ),
    "",
    `## Big Board ${year} – alle Profile`,
    "",
    ...board.flatMap(profileBlock),
    ...(unranked.length
      ? ["## Weitere Profile (ohne Consensus-Rang)", "", ...unranked.flatMap(profileBlock)]
      : []),
    ...(nextGen.length
      ? [
          `## Nächste Generation (frühestens Draft ${year + 1})`,
          "",
          ...nextGen.flatMap(profileBlock),
        ]
      : []),
  ];
  return lines.join("\n");
}
