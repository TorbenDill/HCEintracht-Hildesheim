"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AD_CLIENT = "ca-pub-3725697242603398";

/**
 * AdSense-Anzeigenblock. Der `.ad-slot`-Wrapper wird per CSS komplett
 * ausgeblendet (inkl. Außenabstand), sobald Google die Anzeige mit
 * data-ad-status="unfilled" markiert – so entsteht kein leerer Weißraum,
 * wenn AdSense geladen wurde, aber keine Werbung ausliefert (fehlende
 * Freigabe oder kein Fill). Hinweis: Wird das Skript blockiert (Ad-Blocker)
 * oder gar nicht initialisiert, setzt Google kein Status-Attribut; der leere,
 * 0 Pixel hohe `ins` bleibt dann mitsamt Außenabstand stehen. Das
 * Außenabstand-Maß wird über `className` (z. B. "my-10") gesteuert.
 */
export default function AdSense({
  slot,
  layout,
  className,
}: {
  slot: string;
  layout?: "in-article";
  className?: string;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle nicht geladen (z. B. blockiert) – ignorieren
    }
  }, []);

  return (
    <div className={cn("ad-slot", className)}>
      {layout === "in-article" ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={AD_CLIENT}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
