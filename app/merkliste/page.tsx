import Link from "next/link";
import { getBoardMeta } from "@/lib/player-service";
import Merkliste from "@/components/Merkliste";

export const metadata = {
  title: "Meine Merkliste",
  description:
    "Deine gemerkten NFL-Draft-2027-Prospects auf einen Blick, inklusive Ranking-Bewegung seit dem letzten Update.",
  // Persönliche, geräteabhängige Seite – nicht indexieren.
  robots: { index: false, follow: true },
};

export default function MerklistePage() {
  const meta = getBoardMeta();

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Merkliste
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Meine <span className="text-primary">Merkliste</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Deine gemerkten Prospects, sortiert nach Consensus-Rang, mit der
            Bewegung seit dem letzten Update ({meta.updated}). Die Liste ist
            lokal in diesem Browser gespeichert.
          </p>
        </div>

        <Merkliste />
      </div>
    </main>
  );
}
