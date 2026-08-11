import Link from "next/link";
import type { Metadata } from "next";

// 404-Boundary: Ohne diese Datei erbt die Not-Found-Antwort die
// index/follow-Robots-Regel des Root-Layouts, wodurch neben Nexts
// automatischem <meta robots="noindex"> ein widersprüchliches
// <meta robots="index, follow"> ausgeliefert wird. Hier explizit auf
// noindex setzen, damit die 404-Seite ein einziges, eindeutiges Signal sendet.
export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
          Fehler 404
        </p>
        <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-foreground lg:text-4xl">
          Seite nicht gefunden
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Diese Seite existiert nicht (mehr). Vielleicht wurde ein Spieler oder
          Team-Kürzel falsch geschrieben oder der Inhalt wurde verschoben.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-90"
          >
            Zum Draft Board
          </Link>
          <Link
            href="/mock-draft"
            className="rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
          >
            Mock Draft
          </Link>
        </div>
      </div>
    </main>
  );
}
