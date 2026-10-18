import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPlayerBySlug,
  getPlayers,
  getPlayerSlug,
  getBoardMeta,
  getPositionPeers,
  getRankNeighbors,
  type Player,
} from "@/lib/player-service";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { getPlayerPhoto } from "@/lib/player-images";
import { getCollegeLink } from "@/lib/colleges";
import { cn } from "@/lib/utils";
import { getSeasonSummary, seasonLine } from "@/lib/season";
import Reveal from "@/components/Reveal";
import PlayerAvatar from "@/components/PlayerAvatar";
import StarButton from "@/components/StarButton";
import Breadcrumbs from "@/components/Breadcrumbs";

export async function generateStaticParams() {
  const players = getPlayers();
  return players.map((p) => ({ slug: getPlayerSlug(p.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  const meta = getBoardMeta();

  if (!player) {
    return { title: "Spieler nicht gefunden" };
  }

  const rankPart =
    player.ranking_overall != null ? `#${player.ranking_overall} · ` : "";
  // Die "Nächste Generation" ist erst einen Zyklus später draft-berechtigt.
  const draftJahr = player.naechste_generation
    ? meta.draftYear + 1
    : meta.draftYear;
  const title = `${player.name} – ${player.position}, ${player.college}`;
  // Datengetrieben statt Textbaustein: Rank, Saisonzahlen und die
  // Kernaussage des Profils – das, was in den Suchergebnissen den Klick
  // entscheidet (und was KI-Antworten zitieren können).
  const season = getSeasonSummary(player);
  const lead =
    `NFL Draft ${draftJahr}: ${player.name} (${rankPart}${player.position}, ` +
    `${player.college}).`;
  const description = clip(
    [lead, seasonLine(season), player.kurzprofil].filter(Boolean).join(" "),
    158
  );
  const path = `/player/${getPlayerSlug(player.name)}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      title,
      description,
      url: absoluteUrl(path),
      images: [
        {
          url: absoluteUrl(`/og/player/${getPlayerSlug(player.name)}`),
          width: 1200,
          height: 630,
          alt: player.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(`/og/player/${getPlayerSlug(player.name)}`)],
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  const meta = getBoardMeta();

  if (!player) {
    notFound();
  }

  const photo = getPlayerPhoto(player.name);
  const season = getSeasonSummary(player);
  const collegeLink = getCollegeLink(player.college);
  const positionPeers = getPositionPeers(player, 5);
  const peerSlugs = new Set(positionPeers.map((p) => getPlayerSlug(p.name)));
  const rankNeighbors = getRankNeighbors(player, 4).filter(
    (p) => !peerSlugs.has(getPlayerSlug(p.name))
  );

  const breadcrumbItems = player.deutsch
    ? [
        { name: "Draft Board", href: "/" },
        { name: "Deutsche Prospects", href: "/deutsche-prospects" },
        { name: player.name },
      ]
    : [
        { name: "Draft Board", href: "/" },
        {
          name: player.position,
          href: `/position/${player.position.toLowerCase()}`,
        },
        { name: player.name },
      ];

  const profileUrl = absoluteUrl(`/player/${getPlayerSlug(player.name)}`);
  const citations = (player.sources ?? []).map((s) => ({
    "@type": "CreativeWork",
    name: s,
    url: sourceUrl(s, player.source_urls),
  }));
  const inches = parseHeight(player.height);
  const pounds = parseInt(player.weight, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: profileUrl,
    inLanguage: "de-DE",
    dateModified: player.update_stand ?? meta.updated,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    author: { "@type": "Person", name: "Philipp Forstner", url: absoluteUrl("/ueber-uns") },
    mainEntity: {
      "@type": "Person",
      name: player.name,
      url: profileUrl,
      jobTitle: `${player.position} – NFL Draft ${
        player.naechste_generation ? meta.draftYear + 1 : meta.draftYear
      } Prospect`,
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: player.college,
      },
      ...(inches ? { height: { "@type": "QuantitativeValue", value: inches, unitCode: "INH" } } : {}),
      ...(pounds ? { weight: { "@type": "QuantitativeValue", value: pounds, unitCode: "LBR" } } : {}),
      ...(player.deutsch ? { nationality: { "@type": "Country", name: "Deutschland" } } : {}),
      ...(player.deutsch && player.herkunft ? { homeLocation: { "@type": "Place", name: player.herkunft } } : {}),
      ...(season?.url ? { sameAs: [season.url] } : {}),
      ...(photo ? { image: photo.url } : {}),
      description: player.kurzprofil ?? player.scouting_report_de.slice(0, 300),
    },
    ...(citations.length ? { citation: citations } : {}),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs className="mb-6" items={breadcrumbItems} />
        {/* ── HEADER SECTION ── */}
        <section className="mb-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Player Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-surface">
            <PlayerAvatar name={player.name} size="lg" />
            {/* Rank Overlay */}
            {player.ranking_overall && (
              <div className="absolute left-3 top-3 rounded bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-2xl font-black text-primary text-glow-primary">
                  #{player.ranking_overall}
                </span>
              </div>
            )}
            {/* Position Badge */}
            <div className="absolute bottom-3 right-3 rounded bg-primary px-3 py-1 text-sm font-black uppercase text-background">
              {player.position}
            </div>
            {photo && (
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-0 left-0 max-w-full truncate rounded-tr bg-background/85 px-2 py-0.5 text-[8px] text-muted backdrop-blur-sm hover:text-primary"
              >
                Foto: {photo.artist} · {photo.license} · Wikimedia
              </a>
            )}
          </div>

          {/* Player Info + Stats */}
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {collegeLink ? (
                <Link
                  href={`/college/${collegeLink}`}
                  className="hover:underline"
                >
                  {player.college}
                </Link>
              ) : (
                player.college
              )}
            </p>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h1 className="font-display text-5xl font-semibold uppercase tracking-tight text-foreground lg:text-6xl">
                {player.name}
              </h1>
              <StarButton slug={getPlayerSlug(player.name)} withLabel />
            </div>

            {(player.qualitaet || player.deutsch) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {player.deutsch && (
                  <Link
                    href="/deutsche-prospects"
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-glow px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-background"
                  >
                    <span aria-hidden="true">🇩🇪</span> Deutscher Prospect
                  </Link>
                )}
                {player.qualitaet && (
                  <QualityBadge
                    tier={player.qualitaet}
                    count={player.quellen_anzahl}
                  />
                )}
              </div>
            )}

            {/* Steckbrief */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatBox label="Größe" value={player.height || "–"} />
              <StatBox label="Gewicht" value={player.weight || "–"} />
              {/* Die "Nächste Generation" wird bewusst nicht im
                  Positionsranking des 2027er-Boards geführt. */}
              {!player.naechste_generation && (
                <StatBox
                  label="Pos. Rank"
                  value={`#${player.ranking_pos}`}
                  accent
                />
              )}
              {player.class_year && (
                <StatBox label="College-Jahr" value={player.class_year} />
              )}
              {player.deutsch && player.herkunft && (
                <StatBox label="Herkunft" value={player.herkunft} accent />
              )}
              {player.projection && (
                <StatBox label="Projektion" value={player.projection} accent />
              )}
              <StatBox
                label="Draft"
                value={
                  player.naechste_generation
                    ? `${meta.draftYear + 1}+`
                    : `${meta.draftYear}`
                }
              />
            </div>

            {/* Piktogramme */}
            {player.piktogramme.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                  Fähigkeiten
                </h3>
                <div className="flex flex-wrap gap-2">
                  {player.piktogramme.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-glow px-3 py-1.5"
                    >
                      <span className="text-xs font-bold text-primary">
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Comparison */}
            {(player.best_case_nfl || player.worst_case_nfl) && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                  NFL Comparison
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {player.best_case_nfl && (
                    <div className="rounded border border-accent/30 bg-accent-glow p-4">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-accent">
                        Best Case
                      </p>
                      <p className="text-sm font-black uppercase text-foreground">
                        {player.best_case_nfl}
                      </p>
                    </div>
                  )}
                  {player.worst_case_nfl && (
                    <div className="rounded border border-red-700/30 bg-red-700/8 p-4">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-red-700">
                        Worst Case
                      </p>
                      <p className="text-sm font-black uppercase text-foreground">
                        {player.worst_case_nfl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── AUF EINEN BLICK: Kernaussage in 1–3 Sätzen ── */}
        {player.kurzprofil && (
          <Reveal className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Auf einen Blick
            </h2>
            <p className="rounded-2xl border border-border bg-surface p-6 text-base leading-relaxed text-foreground/90">
              {player.kurzprofil}
            </p>
          </Reveal>
        )}

        {/* ── SAISON 2026: aktuelle Lage + Statistik ── */}
        {(player.update_de || season) && (
          <Reveal className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Saison 2026
            </h2>
            {player.update_de && (
              <div className="mb-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Aktuelle Lage
                  {player.update_stand && (
                    <span className="ml-2 font-normal normal-case tracking-normal text-muted">
                      Stand {formatDate(player.update_stand)}
                    </span>
                  )}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {player.update_de}
                </p>
                {player.update_sources &&
                  Object.keys(player.update_sources).length > 0 && (
                    <p className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
                      Quelle:
                      {Object.entries(player.update_sources).map(([d, url]) => (
                        <a
                          key={d}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-dotted hover:text-primary"
                        >
                          {d}
                        </a>
                      ))}
                    </p>
                  )}
              </div>
            )}
            {season && (
              <div className="rounded-2xl border border-border bg-surface p-5">
                {season.hasStats ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                    {season.games != null && (
                      <StatBox label="Spiele" value={String(season.games)} />
                    )}
                    {season.tiles.map((t) => (
                      <StatBox key={t.label} label={t.label} value={t.value} accent />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground/80">
                    {["OT", "IOL"].includes(player.position)
                      ? "Offensive Linemen tauchen in der Box-Score-Statistik nicht auf – ihre Leistung lässt sich nur am Film und an Grading-Daten ablesen."
                      : "Für diese Saison liegt noch kein Statistikeintrag vor."}
                  </p>
                )}
                <p className="mt-3 text-[11px] text-muted">
                  Stand {season.through} ·{" "}
                  <a
                    href={season.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted hover:text-primary"
                  >
                    cfbstats.com
                  </a>
                </p>
              </div>
            )}
          </Reveal>
        )}

        {/* ── FORSTNER'S TAKE ── */}
        {player.forstner_statement && (
          <Reveal className="mb-10">
            <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary-glow to-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-background">
                  Experte
                </span>
                <span className="text-sm font-bold text-foreground">
                  Philipp Forstner
                </span>
              </div>
              <blockquote className="border-l-2 border-primary pl-4 text-lg italic text-foreground/90">
                &ldquo;{player.forstner_statement}&rdquo;
              </blockquote>
            </div>
          </Reveal>
        )}

        {/* ── SCOUTING REPORT ── */}
        <Reveal className="mb-10">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Scouting Report
          </h2>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {player.scouting_report_de}
            </p>
          </div>
        </Reveal>

        {/* ── WEITERE PROSPECTS (interne Verlinkung) ── */}
        {(positionPeers.length > 0 || rankNeighbors.length > 0) && (
          <Reveal className="mb-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Weitere Prospects
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {positionPeers.length > 0 && (
                <div>
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                    Weitere {player.position} im Board
                  </h3>
                  <div className="flex flex-col gap-2">
                    {positionPeers.map((p) => (
                      <RelatedCard key={getPlayerSlug(p.name)} player={p} />
                    ))}
                  </div>
                </div>
              )}
              {rankNeighbors.length > 0 && (
                <div>
                  <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                    Im Ranking benachbart
                  </h3>
                  <div className="flex flex-col gap-2">
                    {rankNeighbors.map((p) => (
                      <RelatedCard key={getPlayerSlug(p.name)} player={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* ── QUELLEN & QUALITÄT ── */}
        <section className="mb-10">
          <div className="rounded border border-border bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                Quellen &amp; Qualität
              </h2>
              {player.qualitaet && (
                <QualityBadge
                  tier={player.qualitaet}
                  count={player.quellen_anzahl}
                />
              )}
            </div>

            {player.sources && player.sources.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-muted/70">
                  Belege zu {player.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {player.sources.map((s) => (
                    <a
                      key={s}
                      href={sourceUrl(s, player.source_urls)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={
                        player.source_urls?.[s]
                          ? "Direkter Link zum Artikel"
                          : undefined
                      }
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <details className="group">
              <summary className="cursor-pointer list-none text-[10px] uppercase tracking-widest text-muted/70 transition-colors hover:text-primary">
                <span className="group-open:hidden">
                  + Verwendete Big-Boards &amp; Methodik
                </span>
                <span className="hidden group-open:inline">
                  − Verwendete Big-Boards &amp; Methodik
                </span>
              </summary>
              <ul className="mt-3 flex flex-col gap-1">
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
            </details>

            <p className="mt-4 text-[10px] text-muted">
              Spielerdarstellung: {meta.imageSource.name} · Stand: {meta.updated}{" "}
              · {meta.updateCycle}
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}

/** Kompakte Karte für die interne Verlinkung zu verwandten Spielern. */
function RelatedCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/player/${getPlayerSlug(player.name)}`}
      className="group flex items-center gap-3 rounded border border-border bg-surface px-3 py-2 transition-all hover:border-primary/40 hover:bg-surface-light"
    >
      <span className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
        <PlayerAvatar name={player.name} size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">
          {player.name}
        </span>
        <span className="block truncate text-[10px] uppercase tracking-wider text-muted">
          {player.position} · {player.college}
        </span>
      </span>
      {player.ranking_overall != null && (
        <span className="flex-shrink-0 font-mono text-xs font-bold text-primary">
          #{player.ranking_overall}
        </span>
      )}
    </Link>
  );
}

/**
 * Macht aus einer Domain-Quelle ("espn.com") einen anklickbaren Link. Gibt es
 * fuer diese Domain eine praezise Artikel-URL in source_urls, wird die
 * bevorzugt; sonst faellt es auf die Domain-Startseite zurueck.
 */
function sourceUrl(src: string, sourceUrls?: Record<string, string>): string {
  const exact = sourceUrls?.[src];
  if (exact) return exact;
  const clean = src.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return `https://${clean}`;
}

/** Text auf max. Zeichen kürzen, an einer Wortgrenze, mit Auslassung. */
function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:–-]$/, "") + "…";
}

/** 6'4" -> 76 (Zoll) für schema.org. */
function parseHeight(h: string): number | null {
  const m = h.match(/(\d+)'\s*(\d+)?/);
  return m ? Number(m[1]) * 12 + Number(m[2] ?? 0) : null;
}

/** ISO-Datum (2026-10-18) als deutsches Datum (18.10.2026). */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}.${m}.${y}` : iso;
}

/**
 * Qualitätsstufe eines Profils, abgeleitet aus der Quellenzahl (siehe
 * scripts/build_2027.py). "geprueft" = 3+ unabhängige Quellen, "belegt" = 2.
 * Nur belegte Profile erreichen das Board – ein Vertrauenssignal für Leser.
 */
function QualityBadge({
  tier,
  count,
}: {
  tier?: "geprueft" | "belegt" | null;
  count?: number;
}) {
  if (!tier) return null;
  const verified = tier === "geprueft";
  const title = verified
    ? `Geprüft: mit ${count ?? 3}+ unabhängigen Quellen belegt.`
    : `Belegt: erfüllt den Mindeststandard von ${count ?? 2} unabhängigen Quellen.`;
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
        verified
          ? "border-accent/40 bg-accent-glow text-accent"
          : "border-border bg-background text-muted"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {verified ? "Geprüft" : "Belegt"}
      {count ? (
        <span className="font-mono font-medium opacity-70">
          · {count} Quellen
        </span>
      ) : null}
    </span>
  );
}

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded border p-3",
        accent
          ? "border-primary/40 bg-primary-glow"
          : "border-border bg-surface"
      )}
    >
      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-lg font-black",
          accent ? "text-primary text-glow-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
