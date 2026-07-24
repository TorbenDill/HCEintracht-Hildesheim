"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY as KEY } from "@/lib/site";

type AdsQueue = unknown[] & { pauseAdRequests?: number };

function setAdRequestsPaused(paused: boolean) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { adsbygoogle?: AdsQueue };
  w.adsbygoogle = w.adsbygoogle || ([] as AdsQueue);
  // Offizielle AdSense-API: Werbeanfragen pausieren, bis Einwilligung vorliegt.
  w.adsbygoogle.pauseAdRequests = paused ? 1 : 0;
}

/**
 * Cookie-Consent-Banner. Das AdSense-Basisskript ist global eingebunden
 * (nötig für die Site-Verifizierung durch Google), aber Werbeanfragen sind
 * per pauseAdRequests blockiert, bis der Nutzer einwilligt
 * (Art. 6 Abs. 1 lit. a DSGVO).
 */
export default function CookieConsent() {
  const [choice, setChoice] = useState<"pending" | "accepted" | "rejected" | null>(
    "pending"
  );

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as
      | "accepted"
      | "rejected"
      | null;
    // Standard: pausiert – nur bei gespeicherter Einwilligung freigeben.
    setAdRequestsPaused(stored !== "accepted");
    setChoice(stored);
  }, []);

  function decide(v: "accepted" | "rejected") {
    localStorage.setItem(KEY, v);
    setAdRequestsPaused(v !== "accepted");
    setChoice(v);
  }

  // Nur zeigen, wenn noch keine Entscheidung getroffen wurde.
  if (choice !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-primary/30 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          Wir verwenden Cookies. Notwendige Cookies sind für den Betrieb der
          Seite erforderlich. Zusätzlich zeigen wir mit deiner Einwilligung
          Werbung über <strong className="text-foreground">Google AdSense</strong>{" "}
          an – ohne Einwilligung werden keine Werbeanfragen gestellt. Details in
          der{" "}
          <Link
            href="/datenschutz"
            className="text-primary underline-offset-2 hover:underline"
          >
            Datenschutzerklärung
          </Link>
          . Die Einwilligung ist freiwillig und jederzeit widerrufbar.
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button
            onClick={() => decide("rejected")}
            className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-primary hover:text-primary"
          >
            Nur notwendige
          </button>
          <button
            onClick={() => decide("accepted")}
            className="rounded bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-background glow-primary hover:brightness-110"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
