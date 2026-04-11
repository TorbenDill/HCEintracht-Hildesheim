"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPositions,
  getPlayersByPosition,
  getPlayerImage,
  getPlayerSlug,
} from "@/lib/player-service";
import { cn } from "@/lib/utils";

const POSITION_ORDER = [
  "QB", "RB", "WR", "TE", "OT", "G", "C", "IOL", "EDGE", "DT", "LB", "CB", "S", "K", "P", "LS",
];

export default function HorizontalBoard() {
  const [filter, setFilter] = useState<string>("ALL");
  const allPositions = getAllPositions();

  const orderedPositions = POSITION_ORDER.filter((p) =>
    allPositions.includes(p)
  );
  // Add any positions not in our predefined order
  allPositions.forEach((p) => {
    if (!orderedPositions.includes(p)) orderedPositions.push(p);
  });

  const visiblePositions =
    filter === "ALL"
      ? orderedPositions
      : orderedPositions.filter((p) => p === filter);

  return (
    <div>
      {/* Position Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={cn(
            "rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
            filter === "ALL"
              ? "bg-primary text-background glow-primary"
              : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
          )}
        >
          Alle
        </button>
        {orderedPositions.map((pos) => (
          <button
            key={pos}
            onClick={() => setFilter(pos)}
            className={cn(
              "rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all",
              filter === pos
                ? "bg-primary text-background glow-primary"
                : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
          >
            {pos}
          </button>
        ))}
      </div>

      {/* Horizontal Scrollable Matrix */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {visiblePositions.map((position) => {
            const posPlayers = getPlayersByPosition(position).slice(0, 10);
            return (
              <div
                key={position}
                className="w-[220px] flex-shrink-0"
              >
                {/* Position Header */}
                <div className="mb-3 flex items-center gap-2 border-b border-primary/30 pb-2">
                  <span className="text-lg font-black uppercase text-primary text-glow-primary">
                    {position}
                  </span>
                  <span className="text-[10px] font-medium text-muted">
                    {posPlayers.length} Spieler
                  </span>
                </div>

                {/* Player Cards */}
                <div className="flex flex-col gap-2">
                  {posPlayers.map((player) => (
                    <Link
                      key={`${player.name}-${player.position}`}
                      href={`/player/${getPlayerSlug(player.name)}`}
                      className="group rounded border border-border bg-surface p-3 transition-all hover:border-primary/40 hover:bg-surface-light"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        {/* Rank Badge */}
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded text-[10px] font-black",
                            player.ranking_pos <= 3
                              ? "bg-primary text-background"
                              : "bg-surface-light text-muted"
                          )}
                        >
                          {player.ranking_pos}
                        </span>

                        {/* Image */}
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                          <Image
                            src={getPlayerImage(player.name)}
                            alt={player.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* Overall Rank */}
                        {player.ranking_overall && (
                          <span className="ml-auto text-[10px] font-mono text-muted">
                            OVR #{player.ranking_overall}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <p className="truncate text-xs font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                        {player.name}
                      </p>

                      {/* College */}
                      <p className="truncate text-[10px] text-muted">
                        {player.college}
                      </p>

                      {/* Piktogramme */}
                      {player.piktogramme.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {player.piktogramme.slice(0, 2).map((p) => (
                            <span
                              key={p}
                              className="rounded bg-primary-glow px-1 py-0.5 text-[8px] font-medium text-primary"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Forstner Badge */}
                      {player.forstner_statement && (
                        <div className="mt-1.5 border-t border-border pt-1.5">
                          <p className="line-clamp-2 text-[9px] italic text-accent/70">
                            &ldquo;{player.forstner_statement}&rdquo;
                          </p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
