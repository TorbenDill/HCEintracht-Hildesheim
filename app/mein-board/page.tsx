import type { Metadata } from "next";
import Link from "next/link";
import { getBoardMeta } from "@/lib/player-service";
import BoardEditor from "@/components/BoardEditor";

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

export function generateMetadata(): Metadata {
  const meta = getBoardMeta();
  const title = `Eigenes Big Board ${meta.draftYear} erstellen`;
  const description =
    `Bau dein eigenes NFL-Draft-${meta.draftYear}-Big-Board: Prospects per Drag & Drop sortieren, ` +
    `Tiers setzen, Notizen schreiben, mit dem Consensus vergleichen und als Link oder Bild teilen. Kostenlos, ohne Anmeldung.`;
  return {
    title,
    description,
    alternates: { canonical: "/mein-board" },
    openGraph: { title, description, url: "/mein-board" },
    twitter: { title, description },
  };
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
            du davon abweichst. Alles bleibt in deinem Browser gespeichert – ohne Konto, ohne Tracking.
            Mehr zum Consensus erfährst du <Link href="/ueber-uns" className="font-bold text-primary hover:underline">in unserer Methodik</Link>.
          </p>
        </header>
        <BoardEditor />
      </div>
    </main>
  );
}
