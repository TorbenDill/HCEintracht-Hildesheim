"use client";

import { useMemo, useState } from "react";
import PlayerAvatar from "@/components/PlayerAvatar";
import { cn } from "@/lib/utils";
import type { EuropeRadarPlayer } from "@/lib/europe-talents";

const DIVISIONS = [
  { key: "ALL", label: "Alle" },
  { key: "NCAA Division II", label: "D2" },
  { key: "NCAA Division III", label: "D3" },
  { key: "NAIA", label: "NAIA" },
];

// Gruppen statt Einzelpositionen: die Quellen benennen Linemen uneinheitlich
// (OL/T/G/C bzw. DL/DE/DT), fuer die Kaderplanung zaehlt ohnehin die Gruppe.
const POSITION_GROUPS: Record<string, string[]> = {
  QB: ["QB"],
  RB: ["RB", "FB"],
  WR: ["WR"],
  TE: ["TE"],
  OL: ["OL", "T", "G", "C", "OT", "OG", "OC"],
  DL: ["DL", "DE", "DT", "NT"],
  LB: ["LB", "ILB", "OLB", "MLB"],
  DB: ["DB", "CB", "S", "FS", "SS"],
  ST: ["K", "P", "LS", "RS", "RET", "APB", "AP", "ATH", "ST"],
};

function groupOf(position: string): string {
  const p = position.toUpperCase();
  for (const [g, list] of Object.entries(POSITION_GROUPS)) if (list.includes(p)) return g;
  return "ST";
}

/** Einzelauszeichnungen (Trophy/Award), nicht die All-America-Teams. */
const isAwarded = (p: EuropeRadarPlayer) =>
  p.honors.some((h) => /Trophy|Award|Finalist/.test(h));

export default function EuropeRadar({ players }: { players: EuropeRadarPlayer[] }) {
  const [division, setDivision] = useState("ALL");
  const [posGroup, setPosGroup] = useState("ALL");
  const [awardsOnly, setAwardsOnly] = useState(false);
  const [query, setQuery] = useState("");

  const awardCount = useMemo(() => players.filter(isAwarded).length, [players]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter((p) => {
      if (division !== "ALL" && p.division !== division) return false;
      if (posGroup !== "ALL" && groupOf(p.position) !== posGroup) return false;
      if (awardsOnly && !isAwarded(p)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.college.toLowerCase().includes(q) ||
        (p.hometown ?? "").toLowerCase().includes(q)
      );
    });
  }, [players, division, posGroup, awardsOnly, query]);

  const linkClass =
    "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors";

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3">
        <label className="sr-only" htmlFor="radar-search">
          Spieler, College oder Hometown suchen
        </label>
        <input
          id="radar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Spieler, College oder Hometown suchen …"
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
        />

        <div className="flex flex-wrap gap-2">
          {DIVISIONS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDivision(d.key)}
              aria-pressed={division === d.key}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                division === d.key
                  ? "bg-primary text-background glow-primary"
                  : "border border-border bg-surface text-muted hover:border-primary hover:text-primary",
              )}
            >
              {d.label}
            </button>
          ))}
          <span className="mx-1 self-center text-muted/30" aria-hidden="true">
            |
          </span>
          {["ALL", ...Object.keys(POSITION_GROUPS)].map((g) => (
            <button
              key={g}
              onClick={() => setPosGroup(g)}
              aria-pressed={posGroup === g}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
                posGroup === g
                  ? "bg-accent text-background"
                  : "border border-border bg-surface text-muted hover:border-accent hover:text-accent",
              )}
            >
              {g === "ALL" ? "Alle Pos." : g}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setAwardsOnly((v) => !v)}
            aria-pressed={awardsOnly}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
              awardsOnly
                ? "bg-primary text-background glow-primary"
                : "border border-primary/40 bg-surface text-primary hover:bg-primary-glow",
            )}
          >
            ★ Nur Auszeichnungen ({awardCount})
          </button>
          <p className="text-xs text-muted" aria-live="polite">
            {filtered.length} von {players.length} Spielern
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((p) => (
          <div
            key={`${p.name}-${p.college}-${p.division}`}
            className="rounded-lg border border-border bg-surface p-3 sm:p-4"
          >
            <div className="flex items-start gap-3">
              <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                <PlayerAvatar name={p.name} size="sm" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="text-sm font-bold text-foreground">{p.name}</h3>
                  <span className="rounded bg-surface-light px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                    {p.position}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-muted">
                    {p.college}
                  </span>
                  {p.has_detail && (
                    <span className="rounded-full border border-primary/30 bg-primary-glow px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                      Detailprofil oben
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[11px] text-muted">
                  {[
                    p.division.replace("NCAA ", ""),
                    p.class_year,
                    p.height && p.weight ? `${p.height} · ${p.weight}` : p.height || p.weight,
                    p.hometown,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>

                {p.honors.length > 0 && (
                  <p className="mt-1.5 text-[11px] font-semibold text-accent">
                    {p.honors.join(" · ")}
                  </p>
                )}

                {p.europe_note && (
                  <p className="mt-1.5 rounded border border-accent/40 bg-accent-glow px-2 py-1 text-[11px] font-semibold text-accent">
                    ✓ {p.europe_note}
                  </p>
                )}

                {p.nfl_note && (
                  <p className="mt-1.5 rounded border border-border bg-background px-2 py-1 text-[11px] font-semibold text-foreground/70">
                    ⚠ {p.nfl_note}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {p.europlayers_url && (
                    <a
                      href={p.europlayers_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(linkClass, "border-primary/40 text-primary hover:bg-primary-glow")}
                    >
                      Europlayers
                    </a>
                  )}
                  {p.hudl_url && (
                    <a
                      href={p.hudl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(linkClass, "border-accent/40 text-accent hover:bg-accent-glow")}
                    >
                      Hudl
                    </a>
                  )}
                  {p.instagram && (
                    <a
                      href={`https://www.instagram.com/${p.instagram}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(linkClass, "border-border text-muted hover:border-primary hover:text-primary")}
                    >
                      @{p.instagram}
                    </a>
                  )}
                  <span className="ml-auto flex flex-wrap gap-1.5">
                    {Object.entries(p.sources).map(([host, url]) => (
                      <a
                        key={host}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {host}
                      </a>
                    ))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="rounded-lg border border-border bg-surface p-6 text-center text-sm text-muted">
          Kein Spieler passt zu dieser Auswahl.
        </p>
      )}
    </div>
  );
}
