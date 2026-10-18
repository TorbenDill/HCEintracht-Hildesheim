import season from "@/data/season-2026.json";
import { getPlayerSlug, type Player } from "@/lib/player-service";

// Saisonstatistik 2026 aus cfbstats.com (Pipeline:
// scripts/season-stats/fetch-season-stats.mjs). Nur in Server-Komponenten
// verwenden – die JSON-Datei soll nicht im Client-Bundle landen.

type Stats = Record<string, Record<string, number | string>>;
type Entry = {
  team: string;
  pos: string;
  yr: string;
  ht: string;
  wt: string;
  hometown: string;
  url: string;
  stats: Stats | null;
  games: number | null;
};
const data = season as unknown as {
  meta: { through: string | null; source: string; season: number };
  board: Record<string, Entry>;
  extra: Record<string, Entry>;
};

export type StatTile = { label: string; value: string };
export type SeasonSummary = {
  /** Stand als deutsches Datum, z. B. "17.10.2026" */
  through: string;
  games: number | null;
  tiles: StatTile[];
  /** Kompakte Zeile für Karten/Listen, z. B. "52 Rec · 984 Yds · 12 TD" */
  line: string;
  url: string;
  hasStats: boolean;
};

const n = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
const fmt = (v: number, digits = 0) =>
  v.toLocaleString("de-DE", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function germanDate(us: string | null): string {
  const m = us?.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? `${m[2].padStart(2, "0")}.${m[1].padStart(2, "0")}.${m[3]}` : "";
}

export function seasonThrough(): string {
  return germanDate(data.meta.through);
}

export function getSeasonSummary(player: Player): SeasonSummary | null {
  const slug = getPlayerSlug(player.name);
  const e = data.board[slug] ?? data.extra[slug];
  if (!e) return null;
  const s = e.stats ?? {};
  const pass = s["passing"];
  const rush = s["rushing"];
  const rec = s["receiving"];
  const tkl = s["tackles"];
  const tfl = s["tackles for loss"];
  const sack = s["sacks"];
  const ints = s["interceptions"];
  const misc = s["misc. defense"];

  const tiles: StatTile[] = [];
  const line: string[] = [];
  const pos = player.position;

  if (pos === "QB" && pass) {
    tiles.push({ label: "Pass-Yards", value: fmt(n(pass["pass-yard"])) });
    tiles.push({ label: "Pass-TD", value: fmt(n(pass["pass-td"])) });
    tiles.push({ label: "INT", value: fmt(n(pass["pass-int"])) });
    tiles.push({ label: "Quote", value: `${fmt(n(pass["pass-pct"]), 1)} %` });
    if (rush && n(rush["rush-yard"]) >= 50)
      tiles.push({ label: "Rush-Yards", value: fmt(n(rush["rush-yard"])) });
    if (rush && n(rush["rush-td"]) > 0)
      tiles.push({ label: "Rush-TD", value: fmt(n(rush["rush-td"])) });
    line.push(`${fmt(n(pass["pass-yard"]))} Yds`, `${n(pass["pass-td"])} TD`, `${n(pass["pass-int"])} INT`);
  } else if (pos === "RB" && rush) {
    tiles.push({ label: "Rush-Yards", value: fmt(n(rush["rush-yard"])) });
    tiles.push({ label: "Rush-TD", value: fmt(n(rush["rush-td"])) });
    tiles.push({ label: "Yds/Lauf", value: fmt(n(rush["rush-avg"]), 1) });
    if (rec && n(rec["rec"]) > 0) tiles.push({ label: "Catches", value: fmt(n(rec["rec"])) });
    line.push(`${fmt(n(rush["rush-yard"]))} Yds`, `${n(rush["rush-td"])} TD`);
  } else if ((pos === "WR" || pos === "TE" || pos === "RB") && rec) {
    tiles.push({ label: "Catches", value: fmt(n(rec["rec"])) });
    tiles.push({ label: "Yards", value: fmt(n(rec["rec-yard"])) });
    tiles.push({ label: "TD", value: fmt(n(rec["rec-td"])) });
    tiles.push({ label: "Yds/Catch", value: fmt(n(rec["rec-avg"]), 1) });
    line.push(`${n(rec["rec"])} Rec`, `${fmt(n(rec["rec-yard"]))} Yds`, `${n(rec["rec-td"])} TD`);
  } else if (tkl || tfl || sack || ints || misc) {
    const isDB = pos === "CB" || pos === "S";
    if (tkl) tiles.push({ label: "Tackles", value: fmt(n(tkl["tackle-total"])) });
    if (!isDB || n(tfl?.["tfl"]) > 0) tiles.push({ label: "TFL", value: fmt(n(tfl?.["tfl"]), n(tfl?.["tfl"]) % 1 ? 1 : 0) });
    if (!isDB || n(sack?.["sack"]) > 0)
      tiles.push({ label: "Sacks", value: fmt(n(sack?.["sack"]), n(sack?.["sack"]) % 1 ? 1 : 0) });
    if (isDB || n(ints?.["int-ret"]) > 0) tiles.push({ label: "INT", value: fmt(n(ints?.["int-ret"])) });
    if (n(misc?.["pass-broken-up"]) > 0) tiles.push({ label: "PBU", value: fmt(n(misc?.["pass-broken-up"])) });
    if (n(misc?.["fumble-forced"]) > 0) tiles.push({ label: "Forced Fumbles", value: fmt(n(misc?.["fumble-forced"])) });
    if (!isDB && n(misc?.["qb-hurry"]) > 0) tiles.push({ label: "QB-Hurries", value: fmt(n(misc?.["qb-hurry"])) });
    if (isDB) {
      line.push(`${n(tkl?.["tackle-total"])} Tkl`);
      if (n(ints?.["int-ret"]) > 0) line.push(`${n(ints?.["int-ret"])} INT`);
      if (n(misc?.["pass-broken-up"]) > 0) line.push(`${n(misc?.["pass-broken-up"])} PBU`);
    } else {
      if (n(sack?.["sack"]) > 0) line.push(`${fmt(n(sack?.["sack"]), n(sack?.["sack"]) % 1 ? 1 : 0)} Sacks`);
      if (n(tfl?.["tfl"]) > 0) line.push(`${fmt(n(tfl?.["tfl"]), n(tfl?.["tfl"]) % 1 ? 1 : 0)} TFL`);
      if (!line.length) line.push(`${n(tkl?.["tackle-total"])} Tkl`);
    }
  }

  return {
    through: germanDate(data.meta.through),
    games: e.games,
    tiles,
    line: line.join(" · "),
    url: e.url,
    hasStats: tiles.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Saison-Radar: führende Board-Prospects je Kategorie (Startseite).
// ---------------------------------------------------------------------------

export type Leader = { player: Player; value: string; extra: string };
export type LeaderBoard = { key: string; title: string; leaders: Leader[] };

type Cat = {
  key: string;
  title: string;
  positions: string[];
  pick: (s: Stats) => number;
  extra: (s: Stats) => string;
};

const CATS: Cat[] = [
  {
    key: "sacks",
    title: "Sacks",
    positions: ["EDGE", "DT", "LB"],
    pick: (s) => n(s["sacks"]?.["sack"]),
    extra: (s) => `${fmt(n(s["tackles for loss"]?.["tfl"]), n(s["tackles for loss"]?.["tfl"]) % 1 ? 1 : 0)} TFL`,
  },
  {
    key: "tfl",
    title: "Tackles for Loss",
    positions: ["EDGE", "DT", "LB", "S", "CB"],
    pick: (s) => n(s["tackles for loss"]?.["tfl"]),
    extra: (s) => `${n(s["tackles"]?.["tackle-total"])} Tackles`,
  },
  {
    key: "passtd",
    title: "Pass-Touchdowns",
    positions: ["QB"],
    pick: (s) => n(s["passing"]?.["pass-td"]),
    extra: (s) => `${n(s["passing"]?.["pass-int"])} INT · ${fmt(n(s["passing"]?.["pass-pct"]), 1)} %`,
  },
  {
    key: "recyds",
    title: "Receiving-Yards",
    positions: ["WR", "TE", "RB"],
    pick: (s) => n(s["receiving"]?.["rec-yard"]),
    extra: (s) => `${n(s["receiving"]?.["rec"])} Catches · ${n(s["receiving"]?.["rec-td"])} TD`,
  },
  {
    key: "rushyds",
    title: "Rushing-Yards",
    positions: ["RB"],
    pick: (s) => n(s["rushing"]?.["rush-yard"]),
    extra: (s) => `${n(s["rushing"]?.["rush-td"])} TD · ${fmt(n(s["rushing"]?.["rush-avg"]), 1)} Yds/Lauf`,
  },
  {
    key: "int",
    title: "Interceptions",
    positions: ["CB", "S", "LB"],
    pick: (s) => n(s["interceptions"]?.["int-ret"]),
    extra: (s) => `${n(s["misc. defense"]?.["pass-broken-up"])} PBU`,
  },
];

export function getSeasonLeaders(players: Player[], limit = 4): LeaderBoard[] {
  return CATS.map((c) => {
    const rows = players
      .filter((p) => c.positions.includes(p.position) && !p.naechste_generation)
      .map((p) => {
        const slug = getPlayerSlug(p.name);
        const s = (data.board[slug] ?? data.extra[slug])?.stats;
        return s ? { player: p, raw: c.pick(s), s } : null;
      })
      .filter((x): x is { player: Player; raw: number; s: Stats } => !!x && x.raw > 0)
      .sort((a, b) => b.raw - a.raw || (a.player.ranking_overall ?? 999) - (b.player.ranking_overall ?? 999))
      .slice(0, limit);
    return {
      key: c.key,
      title: c.title,
      leaders: rows.map((r) => ({
        player: r.player,
        value: fmt(r.raw, r.raw % 1 ? 1 : 0),
        extra: c.extra(r.s),
      })),
    };
  }).filter((b) => b.leaders.length > 0);
}
