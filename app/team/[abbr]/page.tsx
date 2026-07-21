import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeams,
  getTeamByAbbr,
  getMockPick,
  getFitsForNeeds,
  teamSlug,
} from "@/lib/teams";
import { getBoardMeta, getPlayerSlug } from "@/lib/player-service";
import { absoluteUrl } from "@/lib/site";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return getTeams().map((t) => ({ abbr: teamSlug(t.teamAbbr) }));
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
    description: `Was brauchen die ${team.team} im NFL Draft ${meta.draftYear}? Bedarf (${team.needs.join(", ")}), projizierter Pick ${team.pick} und passende Prospects aus unserem Big Board.`,
    alternates: { canonical: `/team/${teamSlug(team.teamAbbr)}` },
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

  const mock = getMockPick(team);
  const fits = getFitsForNeeds(team.needs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Was brauchen die ${team.team} im NFL Draft ${meta.draftYear}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Der größte Bedarf der ${team.team} liegt auf den Positionen ${team.needs.join(", ")}. In unserem projizierten Mock Draft wählen sie an Pick ${team.pick}${mock ? ` ${mock.player} (${mock.position}, ${mock.college})` : ""}.`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
          <Link
            href="/teams"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Teams
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            {team.teamAbbr}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {team.team}
            <br className="hidden sm:block" />{" "}
            <span className="text-primary">
              Draft-Bedarf {meta.draftYear}
            </span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
            Die {team.team} picken in unserer projizierten Draft-Reihenfolge an
            Position {team.pick}. Der größte Bedarf liegt auf {team.needs.join(", ")}.
            Nachfolgend die passenden verfügbaren Prospects aus dem Big Board.
          </p>
        </div>

        {/* Projizierter Pick */}
        {mock && (
          <Reveal className="mb-8">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted">
              Unser Mock-Draft-Pick
            </h2>
            <Link
              href={`/player/${getPlayerSlug(mock.player)}`}
              className="group flex items-center gap-4 rounded-2xl border border-primary/30 bg-primary-glow p-5 transition-all hover:border-primary/60"
            >
              <span className="font-mono text-3xl font-black text-primary">
                {mock.pick}
              </span>
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-surface-light">
                <PlayerAvatar name={mock.player} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-black uppercase text-foreground group-hover:text-primary">
                  {mock.player}
                </p>
                <p className="truncate text-xs text-muted">
                  {mock.position} · {mock.college}
                </p>
              </div>
            </Link>
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
                  <p className="text-xs text-muted">
                    Aktuell kein passender Prospect im Board.
                  </p>
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
                            {p.ranking_overall != null
                              ? ` · #${p.ranking_overall}`
                              : ""}
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

        <div className="my-10">
          <AdSense slot="6888694163" layout="in-article" />
        </div>

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
