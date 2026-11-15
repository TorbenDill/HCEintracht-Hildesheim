import { getBoardMeta } from "@/lib/player-service";
import MockSimulator from "@/components/MockSimulator";
import { pageMetadata } from "@/lib/seo";
import ToolFaq from "@/components/ToolFaq";

export const metadata = pageMetadata({
  title: "Mock Draft Simulator 2027",
  description:
    "NFL Mock Draft Simulator 2027: Drafte für dein Team gegen die CPU, übernimm alle 32 Erstrunden-Picks im GM-Modus oder spiel mit Freunden – Ergebnis als Bild.",
  path: "/simulator",
  kicker: "Simulator",
});

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

        <ToolFaq
          name="Mock Draft Simulator 2027"
          path="/simulator"
          heading="Fragen zum Simulator"
          description="Kostenloser NFL Mock Draft Simulator auf Deutsch: Team-, GM- und Party-Modus mit aktueller Draft-Reihenfolge und Download als Social-Media-Bild."
          items={[
            {
              q: "Wie funktioniert der NFL Mock Draft Simulator?",
              a: `Du wählst einen Modus, die erste Runde läuft dann in der aktuellen Draft-Reihenfolge ${meta.draftYear}. Bei deinen Picks wählst du aus allen verfügbaren Prospects unseres Big Boards, die übrigen Picks übernimmt die CPU.`,
            },
            {
              q: "Welche Modi gibt es?",
              a: "Im Team-Modus draftest du für eine Franchise gegen die CPU. Im GM-Modus triffst du alle 32 Erstrunden-Picks selbst. Im Party-Modus übernehmen zwei bis sechs Personen je ein Team, die CPU draftet den Rest.",
            },
            {
              q: "Nach welchen Regeln draftet die CPU?",
              a: "Die CPU nimmt grundsätzlich den bestplatzierten verfügbaren Spieler unseres Consensus-Boards. Steht ein Spieler auf einer Bedarfsposition des Teams nur wenige Plätze dahinter, greift sie dort zu – wie echte Teams, die für Bedarf leicht nach oben greifen.",
            },
            {
              q: "Gibt es eine Pick-Uhr?",
              a: "Ja. Im GM-Modus und im Party-Modus läuft eine einstellbare Uhr von 30 Sekunden bis zu den originalen zehn Minuten, oder du schaltest sie ab. Läuft sie ab, wird automatisch der beste verfügbare Spieler gezogen.",
            },
            {
              q: "Kann ich mein Ergebnis teilen?",
              a: "Nach dem Draft lädst du dein Ergebnis als Bild im Format 4:5 für den Feed oder 9:16 für Stories herunter. Gespeichert oder an uns gesendet wird dabei nichts.",
            },
          ]}
        />

      </div>
    </main>
  );
}
