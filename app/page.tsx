"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getBoardMeta,
  getFeaturedProspect,
  getPlayerSlug,
  getTop100,
  searchPlayers,
} from "@/lib/player-service";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import VerticalBoard from "@/components/VerticalBoard";
import HorizontalBoard from "@/components/HorizontalBoard";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";

type BoardView = "vertical" | "horizontal";

export default function Home() {
  const [board, setBoard] = useState<BoardView>("vertical");
  const [query, setQuery] = useState("");
  const featured = getFeaturedProspect();
  const meta = getBoardMeta();
  const results = query.length >= 2 ? searchPlayers(query) : [];
  const top10 = getTop100().slice(0, 10);

  const faqs = [
    {
      q: `Wer ist der Top-Favorit auf Pick 1 im NFL Draft ${meta.draftYear}?`,
      a: `Auf den meisten Boards führt WR Jeremiah Smith (Ohio State) als bester Spieler der Klasse, während QB Arch Manning (Texas) als Favorit auf Pick 1 gilt – Teams am Anfang der Draft-Reihenfolge brauchen in der Regel einen Quarterback.`,
    },
    {
      q: `Wann findet der NFL Draft ${meta.draftYear} statt?`,
      a: `Der NFL Draft ${meta.draftYear} findet traditionell Ende April statt. Die genaue Draft-Reihenfolge ergibt sich aus der NFL-Saison 2026; bis dahin basiert unsere Reihenfolge auf Projektionen.`,
    },
    {
      q: "Wie oft wird dieses Draft Board aktualisiert?",
      a: `Das Big Board, die Positionsrankings und der Mock Draft werden alle 14 Tage mit den aktuellen Consensus-Boards (u. a. NFL Mock Draft Database, ESPN, PFF, The Draft Network, CBS Sports) abgeglichen. Stand: ${meta.updated}.`,
    },
    {
      q: "Was bedeuten Best Case und Worst Case in den Spielerprofilen?",
      a: "Jedes Profil vergleicht den Prospect mit aktiven NFL-Spielern: Der Best Case beschreibt das realistische obere Entwicklungs-Szenario, der Worst Case das Enttäuschungs-Szenario – basierend auf Spielstil, Körperbau und Skillset.",
    },
    {
      q: "Kann ich selbst einen Mock Draft erstellen?",
      a: "Ja – im Mock-Draft-Simulator draftest du entweder für ein Team gegen die CPU oder übernimmst alle 32 Picks im GM-Modus mit Original-Pick-Uhr. Dein Ergebnis kannst du als Social-Media-Bild (4:5 und 9:16) herunterladen.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "de",
        description: `Deutschsprachiges Scouting-Dashboard zum NFL Draft ${meta.draftYear}: Big Board, Positionsrankings, Spielerprofile, Mock Draft und Simulator.`,
      },
      {
        "@type": "ItemList",
        name: `Top 10 Prospects – NFL Draft ${meta.draftYear}`,
        itemListElement: top10.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${p.name} (${p.position}, ${p.college})`,
          url: absoluteUrl(`/player/${getPlayerSlug(p.name)}`),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── HEADER BAR ── */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h1 className="text-base font-black uppercase tracking-widest text-foreground sm:text-lg">
              NFL Draft
              <span className="text-primary"> Board {meta.draftYear}</span>
            </h1>
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted sm:text-[10px] sm:tracking-[0.4em]">
              Powered by Forstner Scouting · Stand {meta.updated}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/mock-draft"
              className="rounded border border-border px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted transition-all hover:border-primary hover:text-primary sm:px-4"
            >
              Mock Draft
            </Link>
            <Link
              href="/simulator"
              className="rounded border border-primary/40 bg-primary-glow px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-background sm:px-4"
            >
              Simulator
            </Link>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
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
                      <PlayerAvatar name={p.name} size="sm" />
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

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* ── HERO ── */}
        <section className="mb-10 overflow-hidden rounded-xl border border-border bg-surface/60 px-6 py-10 sm:px-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.5em] text-primary">
            Consensus Big Board
          </p>
          <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-foreground sm:text-6xl">
            NFL Draft <span className="text-primary text-glow-primary">2027</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
            Big Board, Positionsrankings und Mock Draft für die Klasse 2027 –
            mit deutschem Scouting-Profil zu jedem Prospect. {meta.updateCycle}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/simulator"
              className="rounded bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-background transition-all glow-primary hover:brightness-110"
            >
              Simulator starten →
            </Link>
            <Link
              href="/mock-draft"
              className="rounded border border-primary/40 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary-glow"
            >
              Mock Draft ansehen
            </Link>
            <span className="rounded border border-border bg-surface px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted">
              Stand {meta.updated}
            </span>
          </div>
        </section>

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
              <PlayerAvatar name={featured.name} size="lg" />
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
        <section className="mb-8 flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => setBoard("vertical")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 sm:py-3 sm:text-sm",
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
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 sm:py-3 sm:text-sm",
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

        {/* ── SEO/GEO: INFO & FAQ ── */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">
              NFL Draft {meta.draftYear} – das Wichtigste
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Der NFL Draft {meta.draftYear} gilt als außergewöhnlich starker
              Jahrgang: Mit WR Jeremiah Smith (Ohio State) und QB Arch Manning
              (Texas) kämpfen zwei potenzielle Generational-Talente um Pick 1,
              dahinter drängen Quarterbacks wie Dante Moore (Oregon) und Julian
              Sayin (Ohio State) sowie Edge-Rusher Colin Simmons (Texas) in die
              Top 5. Unser deutschsprachiges Big Board bündelt die großen
              Consensus-Rankings, ergänzt jedes Profil um einen individuellen
              Scouting-Report mit Best- und Worst-Case-NFL-Vergleich und wird
              alle 14 Tage aktualisiert – von den Sommer-Boards bis zur
              Draft-Nacht.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-primary">
              Häufige Fragen
            </h2>
            <div className="flex flex-col gap-2">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded border border-border bg-background/50 px-4 py-3"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold text-foreground marker:hidden group-open:text-primary">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── ANZEIGE ── */}
        <section className="mt-10">
          <AdSense slot="5635468031" />
        </section>

        {/* ── QUELLEN / FOOTER ── */}
        <footer className="mt-12 rounded border border-border bg-surface p-5">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
            Quellen &amp; Aktualisierung
          </h2>
          <ul className="mb-3 flex flex-col gap-1">
            {meta.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted/60">
            Spielerdarstellung: {meta.imageSource.name} · Stand: {meta.updated}{" "}
            · {meta.updateCycle}
          </p>
        </footer>
      </div>
    </main>
  );
}
