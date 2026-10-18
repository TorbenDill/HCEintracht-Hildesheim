import { getBoardMeta } from "@/lib/player-service";
import MockSimulator from "@/components/MockSimulator";

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

      </div>
    </main>
  );
}
