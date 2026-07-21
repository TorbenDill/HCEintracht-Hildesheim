import Link from "next/link";
import { getTeams, teamSlug } from "@/lib/teams";
import { getBoardMeta } from "@/lib/player-service";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "NFL Draft 2027: Team-Needs & Bedarf aller 32 Teams",
  description:
    "Was braucht jedes NFL-Team im Draft 2027? Bedarf, projizierter Erstrundenpick und passende Prospects für alle 32 Franchises.",
  alternates: { canonical: "/teams" },
};

export default function TeamsPage() {
  const teams = getTeams();
  const meta = getBoardMeta();

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Teams
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Team-<span className="text-primary">Needs</span> 2027
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Was braucht jedes NFL-Team im Draft {meta.draftYear}? Zu jeder
            Franchise zeigen wir den projizierten Erstrundenpick, den größten
            Bedarf und die passenden verfügbaren Prospects aus unserem Big
            Board. Reihenfolge nach projizierter Draft-Position.
          </p>
        </div>

        <Reveal className="grid gap-3 sm:grid-cols-2">
          {teams.map((t) => (
            <Link
              key={t.teamAbbr}
              href={`/team/${teamSlug(t.teamAbbr)}`}
              className="card-lift group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:border-primary/50"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary-glow font-display text-sm font-bold text-primary">
                {t.teamAbbr}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                  {t.team}
                </p>
                <p className="truncate text-[11px] text-muted">
                  Bedarf: {t.needs.join(", ")}
                </p>
              </div>
              <span className="flex-shrink-0 font-mono text-xs text-muted">
                Pick {t.pick}
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </main>
  );
}
