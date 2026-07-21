import Link from "next/link";
import { getBoardMeta } from "@/lib/player-service";
import MockSimulator from "@/components/MockSimulator";
import AdSense from "@/components/AdSense";

export const metadata = {
  title: "Mock Draft Simulator 2027",
  description:
    "NFL Mock Draft Simulator 2027: Drafte für ein Team gegen die CPU oder mache alle 32 Erstrunden-Picks selbst – und lade dein Ergebnis als Social-Media-Bild (4:5 & 9:16) herunter.",
  alternates: { canonical: "/simulator" },
  openGraph: {
    type: "website",
    title: "NFL Mock Draft Simulator 2027",
    description:
      "Drafte selbst: ein Team gegen die CPU oder alle 32 Picks im GM-Modus. Ergebnis als Social-Media-PNG herunterladen.",
    url: "/simulator",
  },
};

export default function SimulatorPage() {
  const meta = getBoardMeta();

  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Simulator {meta.draftYear}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Mock Draft <span className="text-primary">Simulator</span>
          </h1>
          <p className="text-sm text-muted">
            Draft-Reihenfolge {meta.draftYear} · Wähle einen Modus und stelle
            deine erste Runde zusammen.
          </p>
        </div>

        <MockSimulator />

        {/* Anzeige */}
        <AdSense slot="6888694163" layout="in-article" className="mt-10" />
      </div>
    </main>
  );
}
