"use client";

import Link from "next/link";
import { useWatchlist } from "@/lib/useWatchlist";
import { getPlayerBySlug, getPlayerSlug } from "@/lib/player-service";
import { getMover } from "@/lib/movers";
import PlayerAvatar from "@/components/PlayerAvatar";
import StarButton from "@/components/StarButton";
import { cn } from "@/lib/utils";

export default function Merkliste() {
  const { list, ready } = useWatchlist();

  if (!ready) {
    return <p className="py-10 text-center text-sm text-muted">Lädt…</p>;
  }

  const players = list
    .map((slug) => getPlayerBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .sort((a, b) => (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999));

  if (players.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="mb-2 text-base font-bold text-foreground">
          Deine Merkliste ist noch leer.
        </p>
        <p className="mb-5 text-sm text-muted">
          Tippe auf einem Spielerprofil auf den Stern, um Prospects zu folgen.
          Deine Auswahl bleibt in diesem Browser gespeichert.
        </p>
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-background transition-all glow-primary hover:brightness-110"
        >
          Zum Big Board
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {players.map((p) => {
        const mover = getMover(p.name);
        return (
          <div
            key={p.name}
            className="group grid grid-cols-[44px_1fr_auto_auto] items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 sm:px-4"
          >
            <Link
              href={`/player/${getPlayerSlug(p.name)}`}
              className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-surface-light"
            >
              <PlayerAvatar name={p.name} size="sm" />
            </Link>
            <Link href={`/player/${getPlayerSlug(p.name)}`} className="min-w-0">
              <span className="block truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                {p.name}
              </span>
              <span className="block truncate text-[11px] text-muted">
                {p.position} · {p.college}
                {p.ranking_overall != null ? ` · #${p.ranking_overall}` : ""}
              </span>
            </Link>
            {mover && !mover.isNew && mover.delta !== 0 ? (
              <span
                className={cn(
                  "font-mono text-xs font-bold",
                  mover.delta > 0 ? "text-accent" : "text-red-700"
                )}
              >
                {mover.delta > 0 ? "▲" : "▼"}
                {Math.abs(mover.delta)}
              </span>
            ) : (
              <span />
            )}
            <StarButton slug={getPlayerSlug(p.name)} size="sm" />
          </div>
        );
      })}
    </div>
  );
}
