"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getFeaturedProspect,
  getPlayerImage,
  getPlayerSlug,
  searchPlayers,
} from "@/lib/player-service";
import { cn } from "@/lib/utils";
import VerticalBoard from "@/components/VerticalBoard";
import HorizontalBoard from "@/components/HorizontalBoard";

type BoardView = "vertical" | "horizontal";

export default function Home() {
  const [board, setBoard] = useState<BoardView>("vertical");
  const [query, setQuery] = useState("");
  const featured = getFeaturedProspect();
  const results = query.length >= 2 ? searchPlayers(query) : [];

  return (
    <main className="min-h-screen bg-background">
      {/* ── HEADER BAR ── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-black uppercase tracking-widest text-foreground">
              NFL Draft
              <span className="text-primary"> Board</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
              Powered by Forstner Scouting
            </p>
          </div>

          {/* Search */}
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Spieler suchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded border border-border bg-background px-4 py-2 pl-9 text-sm text-foreground placeholder-muted/50 outline-none transition-colors focus:border-primary"
            />
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            {/* Search Results Dropdown */}
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded border border-border bg-surface shadow-2xl">
                {results.slice(0, 10).map((p) => (
                  <Link
                    key={`${p.name}-${p.position}`}
                    href={`/player/${getPlayerSlug(p.name)}`}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-3 border-b border-border px-4 py-2.5 transition-colors hover:bg-surface-light"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-border">
                      <Image
                        src={getPlayerImage(p.name)}
                        alt={p.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-muted">
                        {p.position} · {p.college}
                      </p>
                    </div>
                    {p.ranking_overall && (
                      <span className="font-mono text-xs font-bold text-primary">
                        #{p.ranking_overall}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ── FEATURED PROSPECT ── */}
        <section className="mb-10">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
            Featured Prospect
          </p>
          <Link
            href={`/player/${getPlayerSlug(featured.name)}`}
            className="group relative grid overflow-hidden rounded-lg border border-border bg-surface transition-all hover:border-primary/40 md:grid-cols-[250px_1fr]"
          >
            {/* Image */}
            <div className="relative h-64 md:h-auto">
              <Image
                src={getPlayerImage(featured.name)}
                alt={featured.name}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface md:bg-gradient-to-r" />
            </div>

            {/* Info */}
            <div className="relative p-6 md:p-8">
              <div className="mb-2 flex items-center gap-3">
                <span className="rounded bg-primary px-2.5 py-1 font-mono text-xl font-black text-background">
                  #{featured.ranking_overall}
                </span>
                <span className="rounded bg-surface-light px-2 py-1 text-xs font-bold uppercase text-primary">
                  {featured.position}
                </span>
              </div>
              <h2 className="mb-1 text-3xl font-black uppercase tracking-tight text-foreground group-hover:text-primary">
                {featured.name}
              </h2>
              <p className="mb-4 text-sm uppercase tracking-wider text-muted">
                {featured.college} · {featured.height} · {featured.weight}
              </p>

              {featured.piktogramme.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {featured.piktogramme.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-primary-glow px-3 py-1 text-xs font-bold text-primary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}

              {featured.forstner_statement && (
                <blockquote className="border-l-2 border-primary pl-3 text-sm italic text-foreground/80">
                  &ldquo;{featured.forstner_statement}&rdquo;
                  <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-accent not-italic">
                    — Forstner
                  </span>
                </blockquote>
              )}
            </div>
          </Link>
        </section>

        {/* ── BOARD TOGGLE ── */}
        <section className="mb-8 flex items-center gap-4">
          <button
            onClick={() => setBoard("vertical")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all",
              board === "vertical"
                ? "bg-primary text-background glow-primary"
                : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Vertical Board
          </button>
          <button
            onClick={() => setBoard("horizontal")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all",
              board === "horizontal"
                ? "bg-primary text-background glow-primary"
                : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
            )}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
            </svg>
            Horizontal Board
          </button>
        </section>

        {/* ── BOARD VIEW ── */}
        <section>
          {board === "vertical" ? <VerticalBoard /> : <HorizontalBoard />}
        </section>
      </div>
    </main>
  );
}
