import type { Metadata } from "next";
import Link from "next/link";
import {
  getBoardMeta,
  getMockDraft,
  getPlayers,
  getPlayerSlug,
  getQualitySummary,
  getGermanProspects,
  byOverallRank,
} from "@/lib/player-service";
import { SITE_URL, SITE_NAME, absoluteUrl } from "@/lib/site";
import { getVisual } from "@/lib/visuals";
import { getRisers, getFallers, getNewcomers, hasMovement, type Mover } from "@/lib/movers";
import { getSeasonLeaders, seasonThrough } from "@/lib/season";
import { getBoardRows } from "@/lib/board-rows";
import { getStandingsMeta } from "@/lib/teams";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import PlayerAvatar from "@/components/PlayerAvatar";
import HomeBoard from "@/components/HomeBoard";

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

// Startseite: Keyword-Titel ohne Template-Suffix, Beschreibung mit Stand –
// so sieht man schon im Suchergebnis, dass das Board aktuell ist.
export function generateMetadata(): Metadata {
  const meta = getBoardMeta();
  const title = `NFL Draft ${meta.draftYear}: Big Board & Mock Draft auf Deutsch – Forstner Scouting`;
  const description =
    `Das deutsche Big Board zum NFL Draft ${meta.draftYear} (Stand ${germanDate(meta.updated)}): ` +
    `Consensus-Ranking aus ${meta.consensus.boards} Boards, Saisonstatistiken, Mock Draft Runde 1, ` +
    `deutsche Prospects und Draft-Simulator.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url: SITE_URL },
    twitter: { title, description },
  };
}

export default function Home() {
  const meta = getBoardMeta();
  const heroVisual = getVisual("hero");
  const players = getPlayers();
  const ranked = players.filter((p) => p.ranking_overall != null && !p.naechste_generation).sort(byOverallRank);
  const rows = getBoardRows();
  const leaders = getSeasonLeaders(players, 4);
  const news = ranked.filter((p) => p.update_de).slice(0, 6);
  const mock = getMockDraft();
  const germans = getGermanProspects();
  const quality = getQualitySummary();
  const standings = getStandingsMeta();
  const through = seasonThrough();
  const stand = germanDate(meta.updated);
  const [p1, p2, p3] = ranked;
  const sackLeader = leaders.find((l) => l.key === "sacks")?.leaders[0];
  const qbLeader = leaders.find((l) => l.key === "passtd")?.leaders[0];
  const showMovers = hasMovement();

  const faqs = [
    {
      q: `Wer ist der beste Prospect im NFL Draft ${meta.draftYear}?`,
      a: `Im Consensus der NFL Mock Draft Database (Stand ${stand}) führt ${p1.position} ${p1.name} (${p1.college}) vor ${p2.position} ${p2.name} (${p2.college}) und ${p3.position} ${p3.name} (${p3.college}).${
        mock[0]
          ? ` Im Consensus-Mock geht ${mock[0].player} an Pick 1 zu den ${mock[0].team}${mock[0].consensus_pct ? ` (in ${mock[0].consensus_pct} Prozent der Mocks)` : ""}.`
          : ""
      }`,
    },
    {
      q: "Wie entsteht das Ranking auf dieser Seite?",
      a: `Die Plätze 1 bis 100 folgen exakt dem Consensus Big Board der NFL Mock Draft Database, das ${meta.consensus.boards} Big Boards und ${meta.consensus.mocks} Mock Drafts bündelt. Weitere Spieler ordnen wir über aktuelle Einzel-Boards (CBS Sports, Scouting Grade) ein. Jedes Profil ist mit mindestens drei unabhängigen Quellen belegt.`,
    },
    {
      q: `Wann findet der NFL Draft ${meta.draftYear} statt?`,
      a: `Der NFL Draft ${meta.draftYear} findet traditionell Ende April statt. Die Draft-Reihenfolge ergibt sich aus der laufenden NFL-Saison ${meta.draftYear - 1}; unser Mock Draft nutzt den Tabellenstand nach Woche ${standings.week} inklusive aller getauschten Picks.`,
    },
    {
      q: `Gibt es deutsche Spieler im NFL Draft ${meta.draftYear}?`,
      a: `Ja. Wir führen ${germans.length} deutsche D1-College-Spieler als eigene Kategorie, darunter ${germans
        .slice(0, 3)
        .map((g) => `${g.name} (${g.college})`)
        .join(", ")}. Dazu kommt ein eigener Bereich für deutsche Talente, die erst ab ${meta.draftYear + 1} draft-berechtigt sind.`,
    },
    {
      q: "Woher stammen die Saisonzahlen?",
      a: `Alle Statistiken der Saison 2026 stammen von cfbstats.com und decken sämtliche FBS-Teams ab (Stand ${through}). Offensive Linemen tauchen in der Box-Score-Statistik nicht auf; für sie zählen Film und Grading.`,
    },
    {
      q: "Kann ich selbst einen Mock Draft erstellen?",
      a: "Ja – im Mock-Draft-Simulator draftest du für ein Team gegen die CPU, übernimmst im GM-Modus alle 32 Picks mit Pick-Uhr oder spielst mit Freunden im Party-Modus. Das Ergebnis lässt sich als Social-Media-Bild exportieren.",
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
        publisher: { "@id": `${SITE_URL}/#organization` },
        description: `Deutschsprachiges Scouting-Dashboard zum NFL Draft ${meta.draftYear}: Big Board nach Consensus, Saisonstatistiken, Spielerprofile, Mock Draft und Simulator.`,
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        founder: { "@type": "Person", name: "Philipp Forstner" },
      },
      {
        "@type": "ItemList",
        name: `NFL Draft ${meta.draftYear} Big Board – Top 25`,
        dateModified: meta.updated,
        itemListElement: ranked.slice(0, 25).map((p) => ({
          "@type": "ListItem",
          position: p.ranking_overall,
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/60">
        {heroVisual && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroVisual.url}
              alt={heroVisual.alt}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ backgroundColor: heroVisual.avgColor }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/40" />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary-glow px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Saison 2026 · Stand {stand}
          </p>
          <h1 className="max-w-4xl font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
            NFL Draft {meta.draftYear}{" "}
            <span className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent">Big Board</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            Die {ranked.length} besten Prospects der Draft-Klasse {meta.draftYear} – gereiht nach dem Consensus
            aus {meta.consensus.boards} Big Boards, mit deutschem Scouting-Report, Saisonzahlen bis {through} und einem Mock Draft nach
            aktuellem NFL-Tabellenstand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#board"
              className="rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-background transition-all hover:brightness-110"
            >
              Zum Big Board
            </a>
            <Link
              href="/mock-draft"
              className="rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-bold text-foreground transition-all hover:border-primary/50"
            >
              Mock Draft
            </Link>
            <Link
              href="/simulator"
              className="rounded-full border border-border bg-surface px-7 py-3.5 text-sm font-bold text-foreground transition-all hover:border-primary/50"
            >
              Simulator starten
            </Link>
          </div>
          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              [String(ranked.length), "Prospects im Board"],
              [`${quality.geprueft}/${quality.total}`, "mit 3+ Quellen geprüft"],
              [String(mock.length), "Mock-Picks Runde 1"],
              [String(germans.length), "deutsche Prospects"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3 backdrop-blur-sm">
                <dt className="text-[10px] uppercase tracking-widest text-muted">{l}</dt>
                <dd className="font-display text-2xl font-bold text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          {heroVisual && (
            <p className="absolute bottom-3 right-4 text-[10px] text-muted">
              Foto:{" "}
              <a href={heroVisual.photographerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {heroVisual.photographer}
              </a>{" "}
              / Pexels
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        {/* ── SAISON-RADAR ── */}
        {leaders.length > 0 && (
          <Reveal className="mb-16">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
              <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-3xl">
                Saison-Radar <span className="text-primary">2026</span>
              </h2>
              <p className="text-xs text-muted">
                Führende Prospects des Boards · Stand {through} · Quelle:{" "}
                <a href="https://cfbstats.com/" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-primary">
                  cfbstats.com
                </a>
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((b) => (
                <div key={b.key} className="rounded-2xl border border-border bg-surface p-5">
                  <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-primary">{b.title}</h3>
                  <ol className="flex flex-col gap-2.5">
                    {b.leaders.map((l, i) => (
                      <li key={l.player.name}>
                        <Link href={`/player/${getPlayerSlug(l.player.name)}`} className="group flex items-center gap-3">
                          <span className="w-4 font-mono text-xs font-bold text-muted">{i + 1}</span>
                          <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border">
                            <PlayerAvatar name={l.player.name} size="sm" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">
                              {l.player.name}
                            </span>
                            <span className="block truncate text-[10px] text-muted">
                              {l.player.position} · {l.player.college} · #{l.player.ranking_overall} · {l.extra}
                            </span>
                          </span>
                          <span className="font-display text-xl font-bold text-foreground">{l.value}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* ── AKTUELLE LAGE ── */}
        {news.length > 0 && (
          <Reveal className="mb-16">
            <h2 className="mb-5 font-display text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-3xl">
              Verletzungen &amp; <span className="text-primary">News</span>
            </h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {news.map((p) => (
                <Link
                  key={p.name}
                  href={`/player/${getPlayerSlug(p.name)}`}
                  className="group rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 transition-colors hover:border-amber-500/60"
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border">
                      <PlayerAvatar name={p.name} size="sm" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{p.name}</span>
                      <span className="block truncate text-[10px] text-muted">
                        #{p.ranking_overall} · {p.position} · {p.college}
                      </span>
                    </span>
                  </div>
                  <p className="line-clamp-3 text-xs leading-relaxed text-foreground/80">{p.update_de}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* ── AUFSTEIGER & ABSTEIGER ── */}
        {showMovers && (
          <Reveal className="mb-16">
            <h2 className="mb-1 font-display text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-3xl">
              Aufsteiger &amp; <span className="text-primary">Absteiger</span>
            </h2>
            <p className="mb-5 text-xs text-muted">
              Bewegung seit dem letzten Update, gemessen nur zwischen Spielern, die in beiden Ständen gelistet waren.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <MoverCard title="Aufsteiger" tone="up" movers={getRisers(5)} />
              <MoverCard title="Absteiger" tone="down" movers={getFallers(5)} />
              <MoverCard title="Neu im Board" tone="new" movers={getNewcomers(5)} />
            </div>
          </Reveal>
        )}

        {/* ── BIG BOARD ── */}
        <section id="board" className="scroll-mt-24">
          <h2 className="mb-2 font-display text-3xl font-semibold uppercase tracking-tight text-foreground sm:text-4xl">
            Big Board <span className="text-primary">{meta.draftYear}</span>
          </h2>
          <p className="mb-6 max-w-3xl text-sm text-muted">
            Plätze 1–100 nach dem Consensus der NFL Mock Draft Database (Stand {stand}), danach weitere belegte
            Prospects. Pfeile zeigen die Bewegung seit dem letzten Update, „News“ markiert Verletzungen und Sperren.
          </p>
          <HomeBoard rows={rows} />
        </section>

        {/* ── INFO & FAQ ── */}
        <Reveal className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-7">
            <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">
              Das Wichtigste zum NFL Draft {meta.draftYear}
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
              <p>
                An der Spitze der Klasse steht {p1.name}, der {p1.position} von {p1.college}, vor {p2.name} ({p2.college})
                und {p3.name} ({p3.college}).
                {sackLeader && ` Die stärkste Saison eines Pass-Rushers spielt bislang ${sackLeader.player.name} mit ${sackLeader.value} Sacks.`}
                {qbLeader && ` Unter den Quarterbacks führt ${qbLeader.player.name} mit ${qbLeader.value} Touchdown-Pässen (${qbLeader.extra}).`}
              </p>
              <p>
                Dieses deutschsprachige Big Board übernimmt die Reihenfolge des Consensus, ergänzt jedes Profil um
                einen individuellen Scouting-Report mit Best- und Worst-Case-Vergleich, die aktuellen Saisonzahlen
                und – wo nötig – Hinweise zu Verletzungen oder Sperren.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-7">
            <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">Häufige Fragen</h2>
            <div className="flex flex-col gap-2">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded border border-border bg-background/50 px-4 py-3">
                  <summary className="cursor-pointer list-none text-sm font-bold text-foreground marker:hidden group-open:text-primary">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── QUELLEN ── */}
        <Reveal className="mt-12">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-3 text-sm font-bold text-foreground">Quellen &amp; Aktualisierung</h2>
            <p className="mb-4 rounded-lg border border-accent/25 bg-accent-glow px-3.5 py-2.5 text-xs leading-relaxed text-foreground/80">
              <span className="font-bold text-foreground">Datenqualität:</span> Alle {quality.total} Profile sind mit
              mindestens zwei unabhängigen Quellen belegt, davon {quality.geprueft} mit drei oder mehr. Nicht belegte oder
              nicht mehr draft-berechtigte Spieler kommen nicht ins Board.
            </p>
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
            <p className="text-[10px] text-muted">
              Spielerdarstellung: {meta.imageSource.name} · Stand {stand} · {meta.updateCycle}
            </p>
          </section>
        </Reveal>
      </div>
    </main>
  );
}

function MoverCard({ title, tone, movers }: { title: string; tone: "up" | "down" | "new"; movers: Mover[] }) {
  const color = tone === "up" ? "text-accent" : tone === "down" ? "text-red-700" : "text-primary";
  const arrow = tone === "up" ? "▲" : tone === "down" ? "▼" : "NEU";
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className={cn("mb-3 text-xs font-black uppercase tracking-widest", color)}>{title}</h3>
      {movers.length === 0 ? (
        <p className="text-xs text-muted">Keine Bewegung in dieser Kategorie.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {movers.map((m) => (
            <Link key={m.player.name} href={`/player/${getPlayerSlug(m.player.name)}`} className="group flex items-center gap-3">
              <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                <PlayerAvatar name={m.player.name} size="sm" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{m.player.name}</span>
                <span className="block truncate text-[10px] text-muted">
                  #{m.player.ranking_overall} · {m.player.position} · {m.player.college}
                </span>
              </span>
              <span className={cn("flex-shrink-0 font-mono text-xs font-bold", color)}>
                {tone === "new" ? arrow : `${arrow} ${Math.abs(m.delta)}`}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
