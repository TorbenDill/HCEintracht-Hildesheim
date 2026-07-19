"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "nfl-consent-v1";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3725697242603398";

function loadAdSense() {
  if (typeof document === "undefined") return;
  if (document.getElementById("adsbygoogle-js")) return;
  const s = document.createElement("script");
  s.id = "adsbygoogle-js";
  s.async = true;
  s.src = ADSENSE_SRC;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

/**
 * Cookie-Consent-Banner. Google AdSense wird erst geladen, NACHDEM der Nutzer
 * eingewilligt hat (Art. 6 Abs. 1 lit. a DSGVO). Ohne Einwilligung werden
 * keine Werbe-/Tracking-Skripte geladen.
 */
export default function CookieConsent() {
  // "pending" = noch nicht aus localStorage gelesen (verhindert SSR-Flackern)
  const [choice, setChoice] = useState<"pending" | "accepted" | "rejected" | null>(
    "pending"
  );

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as
      | "accepted"
      | "rejected"
      | null;
    setChoice(stored);
    if (stored === "accepted") loadAdSense();
  }, []);

  function decide(v: "accepted" | "rejected") {
    localStorage.setItem(KEY, v);
    setChoice(v);
    if (v === "accepted") loadAdSense();
  }

  // Nur zeigen, wenn noch keine Entscheidung getroffen wurde.
  if (choice !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-primary/30 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted">
          Wir verwenden Cookies. Notwendige Cookies sind für den Betrieb der
          Seite erforderlich. Zusätzlich setzen wir mit deiner Einwilligung{" "}
          <strong className="text-foreground">Google AdSense</strong> ein, um
          Werbung anzuzeigen. Details in der{" "}
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
            className="rounded border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-primary hover:text-primary"
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
