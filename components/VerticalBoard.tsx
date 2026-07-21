"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getTop100,
  getAllPositions,
  getPlayersByPosition,
  getPlayerSlug,
  type Player,
} from "@/lib/player-service";
import PlayerAvatar from "@/components/PlayerAvatar";
import { getMover } from "@/lib/movers";
import { cn } from "@/lib/utils";

const POSITION_ORDER = [
  "QB", "RB", "WR", "TE", "OT", "G", "C", "IOL", "EDGE", "DT", "LB", "CB", "S", "K", "P", "LS",
];

export default function VerticalBoard() {
  const [selectedPosition, setSelectedPosition] = useState<string>("ALL");
  const allPositions = getAllPositions();
  const positions = [
    ...POSITION_ORDER.filter((p) => allPositions.includes(p)),
    ...allPositions.filter((p) => !POSITION_ORDER.includes(p)),
  ];

  const players: Player[] =
    selectedPosition === "ALL"
      ? getTop100()
      : getPlayersByPosition(selectedPosition);

  return (
    <div>
      {/* Position Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPosition("ALL")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
            selectedPosition === "ALL"
              ? "bg-primary text-background glow-primary"
              : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
          )}
        >
          Top 100
        </button>
        {positions.map((pos) => (
          <button
            key={pos}
            onClick={() => setSelectedPosition(pos)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
              selectedPosition === pos
                ? "bg-primary text-background glow-primary"
                : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="mb-2 grid grid-cols-[44px_36px_1fr_44px] items-center gap-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted sm:grid-cols-[60px_44px_1fr_60px_110px] sm:gap-3 sm:px-4 md:grid-cols-[60px_44px_1fr_60px_110px_90px]">
        <span>Rank</span>
        <span></span>
        <span>Spieler</span>
        <span>Pos</span>
        <span className="hidden sm:block">College</span>
        <span className="hidden text-right md:block">Forstner</span>
      </div>

      {/* Player Rows */}
      <div className="flex flex-col gap-1">
        {players.map((player) => {
          const rank =
            selectedPosition === "ALL"
              ? player.ranking_overall
              : player.ranking_pos;
          return (
            <Link
              key={`${player.name}-${player.position}`}
              href={`/player/${getPlayerSlug(player.name)}`}
              className="group grid grid-cols-[44px_36px_1fr_44px] items-center gap-2 rounded-xl border border-transparent bg-surface px-3 py-3 transition-all hover:border-primary/30 hover:bg-surface-light sm:grid-cols-[60px_44px_1fr_60px_110px] sm:gap-3 sm:px-4 md:grid-cols-[60px_44px_1fr_60px_110px_90px]"
            >
              {/* Rank */}
              <span
                className={cn(
                  "font-mono text-lg font-black sm:text-2xl",
                  rank && rank <= 5
                    ? "text-primary text-glow-primary"
                    : rank && rank <= 15
                      ? "text-accent text-glow-accent"
                      : "text-muted"
                )}
              >
                #{rank ?? "-"}
              </span>

              {/* Player Image */}
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border bg-surface-light sm:h-10 sm:w-10">
                <PlayerAvatar name={player.name} size="sm" />
              </div>

              {/* Name & Piktogramme */}
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                  <span className="truncate">{player.name}</span>
                  <MoverBadge name={player.name} />
                </p>
                <p className="truncate text-[10px] text-muted sm:hidden">
                  {player.college}
                </p>
                {player.piktogramme.length > 0 && (
                  <div className="mt-0.5 hidden gap-1 sm:flex">
                    {player.piktogramme.slice(0, 3).map((p) => (
                      <span
                        key={p}
                        className="rounded bg-primary-glow px-1.5 py-0.5 text-[9px] font-medium text-primary"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Position */}
              <span className="rounded bg-surface-light px-1.5 py-1 text-center text-[10px] font-bold uppercase text-primary sm:px-2 sm:text-xs">
                {player.position}
              </span>

              {/* College */}
              <span className="hidden truncate text-xs text-muted sm:block">
                {player.college}
              </span>

              {/* Forstner Rating */}
              <div className="hidden justify-end md:flex">
                {player.forstner_statement ? (
                  <span className="rounded bg-accent-glow px-2 py-1 text-[10px] font-bold text-accent">
                    SCOUTED
                  </span>
                ) : (
                  <span className="text-[10px] text-muted/50">-</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {players.length === 0 && (
        <div className="py-20 text-center text-muted">
          Keine Spieler für diese Position gefunden.
        </div>
      )}
    </div>
  );
}

function MoverBadge({ name }: { name: string }) {
  const m = getMover(name);
  if (!m) return null;
  if (m.isNew) {
    return (
      <span className="flex-shrink-0 rounded bg-primary/15 px-1 py-0.5 text-[8px] font-bold text-primary">
        NEU
      </span>
    );
  }
  if (m.delta === 0) return null;
  const up = m.delta > 0;
  return (
    <span
      className={cn(
        "flex-shrink-0 font-mono text-[9px] font-bold",
        up ? "text-accent" : "text-red-700"
      )}
    >
      {up ? "\u25B2" : "\u25BC"}
      {Math.abs(m.delta)}
    </span>
  );
}

