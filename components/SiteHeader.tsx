"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import playersMin from "@/data/players-min.json";
import boardMeta from "@/data/board-meta.json";
import { useWatchlist } from "@/lib/useWatchlist";
import PlayerAvatar from "@/components/PlayerAvatar";
import { cn } from "@/lib/utils";

type MinPlayer = {
  name: string;
  position: string;
  college: string;
  projection?: string | null;
  ranking_overall: number | null;
};
const PLAYERS = Object.entries(playersMin as Record<string, MinPlayer>).map(([slug, p]) => ({
  slug,
  ...p,
}));

const NAV = [
  { href: "/", label: "Big Board" },
  { href: "/mock-draft", label: "Mock Draft" },
  { href: "/simulator", label: "Simulator" },
  { href: "/positionen", label: "Positionen" },
  { href: "/teams", label: "Teams" },
  { href: "/deutsche-prospects", label: "Deutsche" },
  { href: "/europa-talente", label: "Für Europa" },
  { href: "/lexikon", label: "Lexikon" },
];

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  const base = href.replace(/s$/, "");
  return pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${base}/`);
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { list, ready } = useWatchlist();

  // Menü bei Seitenwechsel schließen (State-Anpassung beim Rendern statt
  // in einem Effekt, vgl. react.dev "Adjusting state when a prop changes").
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setQuery("");
  }
  // Escape schließt Menü und Suche.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setQuery(""));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return PLAYERS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.college.toLowerCase().includes(q) ||
        p.position.toLowerCase() === q
    )
      .sort((a, b) => (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999))
      .slice(0, 8);
  }, [query]);

  const search = (id: string) => (
    <div className="relative w-full">
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Spieler, College oder Position …"
        aria-label="Spieler, College oder Position suchen"
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls={`${id}-results`}
        aria-autocomplete="list"
        autoComplete="off"
        className="w-full rounded-full border border-border bg-background px-4 py-2 pl-9 text-sm text-foreground placeholder-muted/60 transition-colors focus:border-primary focus:outline-none"
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span className="sr-only" role="status" aria-live="polite">
        {query.trim().length >= 2 ? `${results.length} Treffer` : ""}
      </span>
      {results.length > 0 && (
        <ul
          id={`${id}-results`}
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
        >
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/player/${p.slug}`}
                className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0 hover:bg-surface-light"
              >
                <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border">
                  <PlayerAvatar name={p.name} size="sm" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">{p.name}</span>
                  <span className="block truncate text-[11px] text-muted">
                    {p.position} · {p.college}
                  </span>
                </span>
                {p.ranking_overall != null && (
                  <span className="font-mono text-xs font-bold text-primary">#{p.ranking_overall}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const watchCount = ready ? list.length : 0;

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-background"
      >
        Zum Inhalt springen
      </a>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0 flex-shrink-0" aria-label="Zur Startseite – NFL Draft Board 2027">
          <span className="block font-display text-base font-semibold uppercase leading-tight tracking-wide text-foreground sm:text-lg">
            NFL Draft <span className="text-primary">Board {boardMeta.draftYear}</span>
          </span>
          <span className="block text-[9px] uppercase tracking-[0.25em] text-muted">
            Forstner Scouting · Stand {germanDate(boardMeta.updated)}
          </span>
        </Link>

        <nav aria-label="Hauptnavigation" className="ml-1 hidden items-center gap-0.5 xl:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors",
                isActive(pathname, n.href)
                  ? "bg-primary text-background"
                  : "text-muted hover:bg-surface hover:text-primary"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
        <div className="hidden w-56 md:block xl:w-44 2xl:w-64">{search("suche-desktop")}</div>

        <Link
          href="/merkliste"
          className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-primary hover:text-primary"
          aria-label={`Merkliste${watchCount ? ` (${watchCount} Spieler)` : ""}`}
        >
          <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 17.3l-6.2 3.7 1.6-7L2 9.3l7.1-.6L12 2l2.9 6.7 7.1.6-5.4 4.7 1.6 7z" />
          </svg>
          {watchCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-background">
              {watchCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
        >
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background xl:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="mb-4 md:hidden">{search("suche-mobil")}</div>
            <nav aria-label="Hauptnavigation mobil" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm font-bold transition-colors",
                    isActive(pathname, n.href)
                      ? "border-primary bg-primary-glow text-primary"
                      : "border-border bg-surface text-foreground hover:border-primary/50"
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
