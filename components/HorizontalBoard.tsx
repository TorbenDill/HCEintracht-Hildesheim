"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PlayerAvatar from "@/components/PlayerAvatar";
import { POSITION_ORDER } from "@/components/VerticalBoard";
import type { BoardRow } from "@/lib/board-rows";
import { cn } from "@/lib/utils";

/** Positions-Matrix: je Position die zehn besten Prospects nebeneinander. */
export default function HorizontalBoard({ rows }: { rows: BoardRow[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const positions = useMemo(() => {
    const present = new Set(rows.map((r) => r.position));
    return [
      ...POSITION_ORDER.filter((p) => present.has(p)),
      ...[...present].filter((p) => !POSITION_ORDER.includes(p)),
    ];
  }, [rows]);
  const visiblePositions = filter === "ALL" ? positions : positions.filter((p) => p === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Positionen filtern">
        {["ALL", ...positions].map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => setFilter(pos)}
            aria-pressed={filter === pos}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
              filter === pos
                ? "bg-primary text-background glow-primary"
                : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
          >
            {pos === "ALL" ? "Alle Positionen" : pos}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {visiblePositions.map((position) => {
            const posRows = rows.filter((r) => r.position === position).slice(0, 10);
            return (
              <section key={position} className="w-[230px] flex-shrink-0" aria-label={`Top ${position}`}>
                <div className="mb-3 flex items-center gap-2 border-b border-primary/30 pb-2">
                  <span className="text-lg font-black uppercase text-primary text-glow-primary">{position}</span>
                  <Link href={`/position/${position.toLowerCase()}`} className="ml-auto text-[10px] font-medium text-muted hover:text-primary">
                    Ranking →
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {posRows.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/player/${r.slug}`}
                      className="group rounded-xl border border-border bg-surface p-3 transition-all hover:border-primary/40 hover:bg-surface-light"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded text-[10px] font-black",
                            r.posRank <= 3 ? "bg-primary text-background" : "bg-surface-light text-muted"
                          )}
                        >
                          {r.posRank}
                        </span>
                        <span className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                          <PlayerAvatar name={r.name} size="sm" />
                        </span>
                        <span className="ml-auto font-mono text-[10px] text-muted">#{r.rank}</span>
                      </div>
                      <p className="truncate text-xs font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                        {r.name}
                        {r.deutsch && <span className="ml-1" aria-label="Deutscher Prospect">🇩🇪</span>}
                      </p>
                      <p className="truncate text-[10px] text-muted">{r.college}</p>
                      {r.season && (
                        <p className="mt-1.5 truncate font-mono text-[10px] text-foreground/75">{r.season}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
