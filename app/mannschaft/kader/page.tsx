import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/SectionHeading";
import kaderData from "@/data/kader.json";

export const metadata: Metadata = {
  title: "Kader",
  description: "Der Kader des HC Eintracht Hildesheim – Alle Spieler der ersten Mannschaft.",
};

interface Player {
  name: string;
  nummer: number;
  position: string;
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="card overflow-hidden group">
      <div className="h-56 bg-gradient-to-br from-dark to-dark-light flex items-center justify-center relative">
        <span className="text-7xl font-black text-primary/20">
          {player.nummer}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs font-bold text-primary mb-1">
          #{player.nummer}
        </div>
        <h3 className="font-bold text-base">{player.name}</h3>
        <p className="text-sm text-muted">{player.position}</p>
      </div>
    </div>
  );
}

export default function KaderPage() {
  return (
    <>
      <PageHeader
        title="Kader"
        subtitle="Die Mannschaft des HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading title="Torhüter" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kaderData.torhueter.map((p) => (
              <PlayerCard key={p.nummer} player={p} />
            ))}
          </div>

          <div className="mt-12">
            <SectionHeading title="Feldspieler" />
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {kaderData.feldspieler.map((p) => (
                <PlayerCard key={p.nummer} player={p} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
