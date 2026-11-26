import type { Metadata } from "next";
import Link from "next/link";
import { getBoardMeta } from "@/lib/player-service";
import BoardEditor from "@/components/BoardEditor";
import { pageMetadata } from "@/lib/seo";
import ToolFaq from "@/components/ToolFaq";

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

export function generateMetadata(): Metadata {
  const meta = getBoardMeta();
  return pageMetadata({
    title: `Eigenes Big Board ${meta.draftYear} erstellen`,
    description:
      `Bau dein eigenes NFL-Draft-${meta.draftYear}-Big-Board: Prospects per Drag & Drop sortieren, Tiers und ` +
      `Notizen setzen, als PNG oder PDF speichern. Kostenlos, ohne Anmeldung.`,
    path: "/mein-board",
    kicker: "Board-Editor",
  });
}

export default function MeinBoardPage() {
  const meta = getBoardMeta();
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="no-print mb-6 max-w-3xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">Board-Editor</p>
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Dein eigenes <span className="text-primary">Big Board</span>
          </h1>
          <p className="text-sm leading-relaxed text-muted">
            Sortiere die {meta.draftYear}er-Prospects so, wie du sie siehst. Grundlage ist unser
            Consensus-Board (Stand {germanDate(meta.updated)}); neben jedem Spieler siehst du, wie weit
            du davon abweichst. Alles bleibt in deinem Browser gespeichert – ohne Konto, dein Board und deine Notizen werden nie übertragen.
            Mehr zum Consensus erfährst du <Link href="/ueber-uns" className="font-bold text-primary hover:underline">in unserer Methodik</Link>.
          </p>
        </header>
        <BoardEditor />

        <ToolFaq
          name={`Big-Board-Editor ${meta.draftYear}`}
          path="/mein-board"
          heading="Fragen zum Board-Editor"
          description="Kostenloser Editor für dein eigenes NFL-Draft-Big-Board: sortieren, Tiers, Notizen, Vergleich mit dem Consensus, Download als PNG und PDF."
          items={[
            {
              q: "Wie erstelle ich mein eigenes NFL Draft Big Board?",
              a: "Starte mit einer Vorlage – Consensus Top 32, 50, 100, alle Prospects oder deine Merkliste – und sortiere die Spieler per Drag & Drop, mit den Pfeilen oder indem du direkt einen neuen Rang eintippst. Über „Spieler hinzufügen“ ergänzt du weitere Prospects.",
            },
            {
              q: "Was bedeuten die Pfeile neben den Spielern?",
              a: "▲ und ▼ zeigen, wie viele Plätze du einen Spieler höher oder tiefer einstufst als unser Consensus-Board. Ein Gleichheitszeichen heißt: gleiche Einschätzung.",
            },
            {
              q: "Kann ich Tiers und eigene Notizen anlegen?",
              a: "Ja. Tier-Trenner gliedern dein Board in Gruppen gleichwertiger Spieler. Zu jedem Spieler notierst du deine Runde, Stärken, Schwächen und eine freie Notiz.",
            },
            {
              q: "Wie lade ich mein Board herunter?",
              a: "Als PNG im Seiten-Design für Social Media (Feed 4:5 oder Story 9:16, jeweils deine Top 32) oder als PDF mit dem kompletten Board, allen Notizen und Kästchen zum Abhaken am Draft-Tag.",
            },
            {
              q: "Wo wird mein Board gespeichert?",
              a: "Nur lokal in deinem Browser, ohne Konto. Board-Inhalte und Notizen werden nie an uns oder Dritte übertragen. Ein Teilen-Link enthält Reihenfolge, Tiers und Namen, aber nie deine Notizen.",
            },
          ]}
        />
      </div>
    </main>
  );
}
