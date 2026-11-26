"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { leseEinwilligung, speichereEinwilligung, starteAnalytics, track, widerrufeEinwilligung } from "@/lib/analytics";

/**
 * Einwilligungsabfrage (§ 25 TDDDG, Art. 6 Abs. 1 lit. a DSGVO) plus Messung.
 *
 * Regeln, die den rechtlichen Kern ausmachen:
 *  1. „Ablehnen“ und „Zustimmen“ sind gleich gestaltet und gleich erreichbar.
 *  2. Vor einer aktiven Zustimmung wird nichts geladen (kein Google-Skript, kein Ping).
 *  3. Widerruf ist so einfach wie die Erteilung (Fußzeile + /datenschutz).
 *  4. Die Entscheidung liegt nur im localStorage des Besuchers.
 */
export default function Einwilligung() {
  const [offen, setOffen] = useState(false);

  useEffect(() => {
    const e = leseEinwilligung();
    // Abfrage erst nach der Hydrierung zeigen (Seite ist statisch vorgerendert).
    const zeigen = !e ? window.setTimeout(() => setOffen(true), 0) : undefined;
    if (e?.statistik) starteAnalytics();

    const aufEntscheidung = (ev: Event) => {
      const d = (ev as CustomEvent).detail as { statistik: boolean } | null;
      if (d === null) {
        setOffen(true);
        return;
      }
      setOffen(false);
      if (d.statistik) starteAnalytics();
    };
    const aufOeffnen = () => setOffen(true);
    window.addEventListener("nds-einwilligung", aufEntscheidung);
    window.addEventListener("nds-einwilligung-oeffnen", aufOeffnen);

    // Klickmessung mit einem einzigen Zuhörer am Dokument.
    const aufKlick = (ev: MouseEvent) => {
      const ziel = ev.target as Element | null;
      if (!ziel || !ziel.closest) return;
      const markiert = ziel.closest("[data-ga-event]") as HTMLElement | null;
      if (markiert) {
        track(markiert.dataset.gaEvent!, markiert.dataset.gaLabel ? { label: markiert.dataset.gaLabel } : {});
        return;
      }
      const a = ziel.closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      let host = "";
      try {
        host = new URL(a.href).hostname;
      } catch {
        return;
      }
      if (!host || host === location.hostname) return;
      const podcast = /footballquark|spotify|podcasts\.apple|podigee|youtube|youtu\.be/i.test(host);
      track(podcast ? "podcast_klick" : "ausgehender_klick", { ziel: host });
    };
    document.addEventListener("click", aufKlick, { passive: true, capture: true });

    return () => {
      if (zeigen) window.clearTimeout(zeigen);
      window.removeEventListener("nds-einwilligung", aufEntscheidung);
      window.removeEventListener("nds-einwilligung-oeffnen", aufOeffnen);
      document.removeEventListener("click", aufKlick, { capture: true });
    };
  }, []);

  if (!offen) return null;

  const knopf =
    "rounded-full border border-foreground/80 bg-surface px-5 py-2 text-sm font-bold text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="einwilligung-titel"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:inset-x-6 sm:bottom-6"
    >
      <h2 id="einwilligung-titel" className="mb-2 text-sm font-black uppercase tracking-wide text-foreground">
        Reichweitenmessung
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-foreground/85">
        Dürfen wir mit Google Analytics messen, welche Rankings, Profile und Tools genutzt werden? Dafür wird eine Kennung
        in deinem Browser gespeichert, Daten gehen an Google. Ohne Zustimmung wird nichts geladen. Merkliste und Board
        funktionieren in beiden Fällen.{" "}
        <Link href="/datenschutz#analytics" className="text-primary underline">
          Details
        </Link>
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={knopf} onClick={() => speichereEinwilligung(false)}>
          Ablehnen
        </button>
        <button type="button" className={knopf} onClick={() => speichereEinwilligung(true)}>
          Zustimmen
        </button>
      </div>
    </section>
  );
}

/** Fußzeilen-Link: öffnet die Abfrage erneut. */
export function EinwilligungOeffnen({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("nds-einwilligung-oeffnen"))}
    >
      Cookie-Einstellungen
    </button>
  );
}

/** Schalter auf /datenschutz: Entscheidung löschen und neu fragen. */
export function EinwilligungWiderrufen() {
  return (
    <button
      type="button"
      onClick={widerrufeEinwilligung}
      className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold text-foreground hover:border-primary hover:text-primary"
    >
      Einwilligung widerrufen und neu entscheiden
    </button>
  );
}
