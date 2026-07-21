import Link from "next/link";
import { getColleges } from "@/lib/colleges";
import { getBoardMeta } from "@/lib/player-service";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "NFL Draft 2027: Prospects nach College",
  description:
    "Welche College-Programme stellen die meisten NFL-Draft-Prospects 2027? Ohio State, Texas, Georgia und mehr, jeweils mit den Prospects aus unserem Big Board.",
  alternates: { canonical: "/colleges" },
};

export default function CollegesPage() {
  const colleges = getColleges();
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
            Colleges
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Prospects nach <span className="text-primary">College</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Welche College-Programme liefern die meisten Talente für den NFL
            Draft {meta.draftYear}? Diese Übersicht bündelt alle Prospects aus
            unserem Big Board nach Universität. Aufgeführt sind Programme mit
            mindestens zwei Prospects.
          </p>
        </div>

        <Reveal className="grid gap-3 sm:grid-cols-2">
          {colleges.map((c) => (
            <Link
              key={c.slug}
              href={`/college/${c.slug}`}
              className="card-lift group flex items-center justify-between rounded-xl border border-border bg-surface p-5 hover:border-primary/50"
            >
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-foreground group-hover:text-primary">
                  {c.name}
                </h2>
                <p className="truncate text-xs text-muted">
                  Top: {c.players[0].name} ({c.players[0].position})
                </p>
              </div>
              <span className="ml-3 flex-shrink-0 rounded-full bg-primary-glow px-3 py-1 font-mono text-sm font-bold text-primary">
                {c.players.length}
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </main>
  );
}
