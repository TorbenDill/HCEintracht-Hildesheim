import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeams,
  getTeamByAbbr,
  getMockPicks,
  getFitsForNeeds,
  getPickNeighbors,
  getStandingsMeta,
  teamName,
  teamSlug,
  type DraftTeam,
} from "@/lib/teams";
import { getBoardMeta, getPlayerSlug } from "@/lib/player-service";
import { absoluteUrl } from "@/lib/site";
import PlayerAvatar from "@/components/PlayerAvatar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { safeJsonLd } from "@/lib/security";

export function generateStaticParams() {
  return getTeams().map((t) => ({ abbr: teamSlug(t.teamAbbr) }));
}

/** Ein Satz zur Pick-Situation – berücksichtigt Trades (0, 1 oder mehrere Picks). */
function pickSentence(team: DraftTeam): string {
  if (team.picks.length === 0) {
    const t = team.traded_away[0];
    return `Die ${team.team} (${team.record}) haben 2027 keinen eigenen Erstrundenpick – ihr Pick ${t.pick} gehört nach einem Trade den ${teamName(t.to)}.`;
  }
  if (team.picks.length === 1) {
    return `Die ${team.team} (${team.record}) picken nach aktuellem Tabellenstand an Position ${team.picks[0]}.`;
  }
  const words = ["", "einen", "zwei", "drei", "vier"];
  return `Die ${team.team} (${team.record}) halten gleich ${words[team.picks.length] ?? team.picks.length} Erstrundenpicks: ${team.picks.join(", ")}.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ abbr: string }>;
}): Promise<Metadata> {
  const { abbr } = await params;
  const team = getTeamByAbbr(abbr);
  const meta = getBoardMeta();
  if (!team) return { title: "Team nicht gefunden" };
  const title = `${team.team}: NFL Draft ${meta.draftYear} Bedarf & Prospects`;
  return {
    title,
    description: `${pickSentence(team)} Bedarf: ${team.needs.join(", ")}. Mock-Draft-Pick, Begründung und passende Prospects aus unserem Big Board.`,
    alternates: { canonical: `/team/${teamSlug(team.teamAbbr)}` },
    // Aggregierte Team-Seite; bis zur inhaltlichen Aufwertung bewusst nicht
    // indexiert, um dünnes Material aus dem Google-Index herauszuhalten.
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title,
      url: absoluteUrl(`/team/${teamSlug(team.teamAbbr)}`),
    },
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ abbr: string }>;
}) {
  const { abbr } = await params;
  const team = getTeamByAbbr(abbr);
  const meta = getBoardMeta();
  if (!team) notFound();

  const mocks = getMockPicks(team);
  const fits = getFitsForNeeds(team.needs);
  const pickNeighbors = getPickNeighbors(team, 6);
  const standings = getStandingsMeta();

  const mockAnswer = mocks.length
    ? ` In unserem Mock Draft wählen sie ${mocks
        .map((m) => `an Pick ${m.pick} ${m.player} (${m.position}, ${m.college})`)
        .join(" und ")}.`
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Was brauchen die ${team.team} im NFL Draft ${meta.draftYear}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${pickSentence(team)} Der größte Bedarf liegt auf den Positionen ${team.needs.join(", ")}.${mockAnswer}`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { name: "Draft Board", href: "/" },
            { name: "Teams", href: "/teams" },
            { name: team.team },
          ]}
        />
        <div className="mb-8">
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-muted">
            {team.teamAbbr} · Bilanz {team.record} · Stand nach Woche {standings.week}
          </p>
          <h1 className="mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {team.team}
            <br className="hidden sm:block" />{" "}
            <span className="text-primary">Draft-Bedarf {meta.draftYear}</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
            {pickSentence(team)} Der größte Bedarf liegt auf {team.needs.join(", ")}.
            {mocks.length > 1
              ? " Nachfolgend unsere Mock-Draft-Picks mit Begründung und die passenden verfügbaren Prospects aus dem Big Board."
              : mocks.length === 1
                ? " Nachfolgend unser Mock-Draft-Pick mit Begründung und die passenden verfügbaren Prospects aus dem Big Board."
                : " Nachfolgend die passenden Prospects aus dem Big Board – für einen späteren Pick oder einen Trade zurück in Runde 1."}
          </p>
        </div>

        {/* Mock-Draft-Picks (0, 1 oder mehrere) */}
        {mocks.length > 0 && (
          <Reveal className="mb-10">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted">
              {mocks.length > 1 ? "Unsere Mock-Draft-Picks" : "Unser Mock-Draft-Pick"}
            </h2>
            <div className="flex flex-col gap-3">
              {mocks.map((mock) => (
                <Link
                  key={mock.pick}
                  href={`/player/${getPlayerSlug(mock.player)}`}
                  className="group block rounded-2xl border border-primary/30 bg-primary-glow p-5 transition-all hover:border-primary/60"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-3xl font-black text-primary">{mock.pick}</span>
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-surface-light">
                      <PlayerAvatar name={mock.player} size="sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-black uppercase text-foreground group-hover:text-primary">
                        {mock.player}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {mock.position} · {mock.college}
                        {mock.viaTeam ? ` · Pick via ${mock.viaTeam}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/85">{mock.reason_de}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* Passende Prospects je Bedarf */}
        <Reveal>
          <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">
            Passende Prospects nach Bedarf
          </h2>
          <div className="flex flex-col gap-6">
            {fits.map(({ need, players }) => (
              <div key={need}>
                <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <span className="rounded bg-surface-light px-2 py-0.5 font-mono text-xs text-primary">
                    {need}
                  </span>
                </h3>
                {players.length === 0 ? (
                  <p className="text-xs text-muted">Aktuell kein passender Prospect im Board.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {players.map((p) => (
                      <Link
                        key={p.name}
                        href={`/player/${getPlayerSlug(p.name)}`}
                        className="group flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 hover:border-primary/40"
                      >
                        <span className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                          <PlayerAvatar name={p.name} size="sm" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-bold text-foreground group-hover:text-primary">
                            {p.name}
                          </span>
                          <span className="block truncate text-[10px] text-muted">
                            {p.college}
                            {p.ranking_overall != null ? ` · #${p.ranking_overall}` : ""}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {pickNeighbors.length > 0 && (
          <Reveal className="my-10">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Weitere Teams in der Draft-Reihenfolge
            </h2>
            <div className="flex flex-wrap gap-2">
              {pickNeighbors.map((t) => (
                <Link
                  key={t.teamAbbr}
                  href={`/team/${teamSlug(t.teamAbbr)}`}
                  className="group flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs transition-all hover:border-primary/50"
                >
                  <span className="rounded-full bg-primary-glow px-1.5 font-mono text-[10px] font-bold text-primary">
                    {t.pick != null ? `#${t.pick}` : "–"}
                  </span>
                  <span className="font-bold text-foreground group-hover:text-primary">{t.team}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/teams"
            className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
          >
            Alle Teams
          </Link>
          <Link
            href="/mock-draft"
            className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
          >
            Kompletter Mock Draft
          </Link>
        </div>
      </div>
    </main>
  );
}
