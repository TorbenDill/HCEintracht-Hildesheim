import Link from "next/link";
import { getPlayersByPosition } from "@/lib/player-service";
import { getAllPositionKeys, getPositionInfo } from "@/lib/positions";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "NFL Draft 2027 Positionsrankings: Beste Spieler je Position",
  description:
    "Die besten Prospects des NFL Draft 2027 nach Position: Quarterbacks, Wide Receiver, Edge Rusher, Cornerbacks und mehr, jeweils mit deutschem Scouting-Ranking.",
  alternates: { canonical: "/positionen" },
};

export default function PositionenPage() {
  const keys = getAllPositionKeys();

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
            Positionen
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Positions<span className="text-primary">rankings</span> 2027
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Die besten Prospects des NFL Draft 2027, aufgeschlüsselt nach
            Position. Jede Seite ordnet die Spieler mit deutschem Scouting-Profil
            ein und erklärt, worauf NFL-Teams an dieser Stelle achten.
          </p>
        </div>

        <Reveal className="grid gap-3 sm:grid-cols-2">
          {keys.map((pos) => {
            const info = getPositionInfo(pos)!;
            const count = getPlayersByPosition(pos).length;
            return (
              <Link
                key={pos}
                href={`/position/${pos.toLowerCase()}`}
                className="card-lift group rounded-xl border border-border bg-surface p-5 hover:border-primary/50"
              >
                <div className="mb-1 flex items-center gap-3">
                  <span className="font-display text-2xl font-semibold uppercase text-primary">
                    {pos}
                  </span>
                  <span className="text-base font-bold text-foreground group-hover:text-primary">
                    {info.label}
                  </span>
                  <span className="ml-auto text-[11px] font-mono text-muted">
                    {count} Spieler
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-muted">
                  {info.intro}
                </p>
              </Link>
            );
          })}
        </Reveal>
      </div>
    </main>
  );
}
