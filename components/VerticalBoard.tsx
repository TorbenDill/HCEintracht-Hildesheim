"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PlayerAvatar from "@/components/PlayerAvatar";
import type { BoardRow } from "@/lib/board-rows";
import { cn } from "@/lib/utils";

export const POSITION_ORDER = ["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DT", "LB", "CB", "S"];

export default function VerticalBoard({ rows }: { rows: BoardRow[] }) {
  const [filter, setFilter] = useState<string>("TOP");
  const positions = useMemo(() => {
    const present = new Set(rows.map((r) => r.position));
    return [
      ...POSITION_ORDER.filter((p) => present.has(p)),
      ...[...present].filter((p) => !POSITION_ORDER.includes(p)),
    ];
  }, [rows]);

  const visible =
    filter === "TOP"
      ? rows.filter((r) => r.rank <= 100)
      : filter === "ALL"
        ? rows
        : rows.filter((r) => r.position === filter);
  const byPosition = filter !== "TOP" && filter !== "ALL";

  const chip = (key: string, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setFilter(key)}
      aria-pressed={filter === key}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
        filter === key
          ? "bg-primary text-background glow-primary"
          : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Board filtern">
        {chip("TOP", "Top 100")}
        {chip("ALL", `Alle ${rows.length}`)}
        {positions.map((p) => chip(p, p))}
      </div>

      <div className="mb-2 grid grid-cols-[40px_36px_1fr_44px] items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted sm:grid-cols-[56px_44px_1fr_56px_120px] sm:gap-3 sm:px-4 lg:grid-cols-[56px_44px_1fr_56px_130px_190px]">
        <span>{byPosition ? "Pos." : "Rang"}</span>
        <span />
        <span>Spieler</span>
        <span>Pos</span>
        <span className="hidden sm:block">College</span>
        <span className="hidden text-right lg:block">Saison 2026</span>
      </div>

      <ol className="flex flex-col gap-1">
        {visible.map((r) => {
          const rank = byPosition ? r.posRank : r.rank;
          return (
            <li key={r.slug}>
              <Link
                href={`/player/${r.slug}`}
                className="group grid grid-cols-[40px_36px_1fr_44px] items-center gap-2 rounded-xl border border-transparent bg-surface px-3 py-3 transition-all hover:border-primary/30 hover:bg-surface-light sm:grid-cols-[56px_44px_1fr_56px_120px] sm:gap-3 sm:px-4 lg:grid-cols-[56px_44px_1fr_56px_130px_190px]"
              >
                <span
                  className={cn(
                    "font-mono text-lg font-black sm:text-2xl",
                    rank <= 5 ? "text-primary text-glow-primary" : rank <= 15 ? "text-accent" : "text-muted"
                  )}
                >
                  {rank}
                </span>

                <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-surface-light sm:h-10 sm:w-10">
                  <PlayerAvatar name={r.name} size="sm" />
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    <span className="truncate">{r.name}</span>
                    {r.deutsch && (
                      <span title="Deutscher Prospect" aria-label="Deutscher Prospect" className="flex-shrink-0 text-xs">
                        🇩🇪
                      </span>
                    )}
                    {r.hasNews && (
                      <span
                        title="Aktuelle Lage: Verletzung oder Sperre – siehe Profil"
                        className="flex-shrink-0 rounded bg-amber-500/15 px-1 py-0.5 text-[8px] font-bold normal-case text-amber-700 dark:text-amber-400"
                      >
                        News
                      </span>
                    )}
                    <MoverBadge mover={r.mover} />
                  </span>
                  <span className="block truncate text-[11px] text-muted sm:hidden">
                    {r.college}
                    {r.season ? ` · ${r.season}` : ""}
                  </span>
                  {r.tags.length > 0 && (
                    <span className="mt-0.5 hidden gap-1 sm:flex">
                      {r.tags.map((t) => (
                        <span key={t} className="rounded bg-primary-glow px-1.5 py-0.5 text-[9px] font-medium text-primary">
                          {t}
                        </span>
                      ))}
                    </span>
                  )}
                </span>

                <span className="rounded bg-surface-light px-1.5 py-1 text-center text-[10px] font-bold uppercase text-primary sm:px-2 sm:text-xs">
                  {r.position}
                </span>

                <span className="hidden truncate text-xs text-muted sm:block">{r.college}</span>

                <span className="hidden text-right font-mono text-[11px] text-foreground/80 lg:block">
                  {r.season ?? <span className="text-muted/50">–</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MoverBadge({ mover }: { mover: BoardRow["mover"] }) {
  if (!mover) return null;
  if (mover.isNew) {
    return (
      <span className="flex-shrink-0 rounded bg-primary/15 px-1 py-0.5 text-[8px] font-bold text-primary">NEU</span>
    );
  }
  const up = mover.delta > 0;
  return (
    <span
      className={cn("flex-shrink-0 font-mono text-[9px] font-bold", up ? "text-accent" : "text-red-700")}
      title={`${up ? "Aufgestiegen" : "Abgestiegen"} um ${Math.abs(mover.delta)} Plätze seit dem letzten Update`}
    >
      {up ? "▲" : "▼"}
      {Math.abs(mover.delta)}
    </span>
  );
}
