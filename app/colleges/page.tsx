import Link from "next/link";
import { getColleges } from "@/lib/colleges";
import { getBoardMeta } from "@/lib/player-service";
import Reveal from "@/components/Reveal";
import { pageMetadata } from "@/lib/seo";
import CollectionJsonLd from "@/components/CollectionJsonLd";

export const metadata = pageMetadata({
  title: "NFL Draft 2027: Prospects nach College",
  description:
    "Welche College-Programme stellen die meisten NFL-Draft-Prospects 2027? Ohio State, Texas, Georgia und mehr – jeweils mit allen Spielern aus unserem Big Board.",
  path: "/colleges",
  kicker: "Prospects nach College",
});

export default function CollegesPage() {
  const colleges = getColleges();
  const meta = getBoardMeta();

  return (
    <main className="min-h-screen bg-background">
      <CollectionJsonLd
        name="NFL-Draft-Prospects nach College"
        path="/colleges"
        description="College-Programme mit NFL-Draft-2027-Prospects in unserem Big Board."
        items={colleges.map((c) => ({ name: c.name, path: `/college/${c.slug}` }))}
      />

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
