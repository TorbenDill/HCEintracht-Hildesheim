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
 * ausgeblendet (inkl. Außenabstand), sobald Google die Anzeige als
 * "unfilled" markiert – so entsteht nie leerer Weißraum, wenn keine
 * Werbung ausgeliefert wird (fehlende Freigabe, kein Consent, kein Fill).
 * Das Außenabstand-Maß wird über `className` (z. B. "my-10") gesteuert.
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
