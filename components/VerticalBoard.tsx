"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getTop100,
  getAllPositions,
  getPlayersByPosition,
  getPlayerImage,
  getPlayerSlug,
  type Player,
} from "@/lib/player-service";
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
            "rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
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
              "rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
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
      <div className="mb-2 grid grid-cols-[60px_60px_1fr_80px_120px_100px] items-center gap-3 px-4 text-[10px] font-bold uppercase tracking-widest text-muted">
        <span>Rank</span>
        <span></span>
        <span>Spieler</span>
        <span>Position</span>
        <span>College</span>
        <span className="text-right">Forstner</span>
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
              className="group grid grid-cols-[60px_60px_1fr_80px_120px_100px] items-center gap-3 rounded border border-transparent bg-surface px-4 py-3 transition-all hover:border-primary/30 hover:bg-surface-light"
            >
              {/* Rank */}
              <span
                className={cn(
                  "font-mono text-2xl font-black",
                  rank && rank <= 5
                    ? "text-primary text-glow-primary"
                    : rank && rank <= 15
                      ? "text-accent text-glow-accent"
                      : "text-muted"
                )}
              >
                #{rank ?? "—"}
              </span>

              {/* Player Image */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-light">
                <Image
                  src={getPlayerImage(player.name)}
                  alt={player.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Name & Piktogramme */}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                  {player.name}
                </p>
                {player.piktogramme.length > 0 && (
                  <div className="mt-0.5 flex gap-1">
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
              <span className="rounded bg-surface-light px-2 py-1 text-center text-xs font-bold uppercase text-primary">
                {player.position}
              </span>

              {/* College */}
              <span className="truncate text-xs text-muted">
                {player.college}
              </span>

              {/* Forstner Rating */}
              <div className="flex justify-end">
                {player.forstner_statement ? (
                  <span className="rounded bg-accent-glow px-2 py-1 text-[10px] font-bold text-accent">
                    SCOUTED
                  </span>
                ) : (
                  <span className="text-[10px] text-muted/50">—</span>
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
