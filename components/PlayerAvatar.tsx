"use client";

import { useState } from "react";
import Image from "next/image";
import { getPlayerPhoto } from "@/lib/player-images";
import { getPlayerSlug } from "@/lib/slug";
import visuals from "@/data/player-visuals.json";
import { cn } from "@/lib/utils";

type Visual = { number: string | null; primary: string | null; secondary: string };
const VISUALS = visuals as Record<string, Visual>;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/** Hex-Farbe um einen Faktor abdunkeln (für den Trikot-Verlauf). */
function shade(hex: string, factor: number): string {
  const n = hex.replace("#", "");
  const c = [0, 2, 4].map((i) =>
    Math.max(0, Math.min(255, Math.round(parseInt(n.slice(i, i + 2), 16) * factor)))
  );
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const NUMBER_SIZE = { sm: "text-sm", md: "text-3xl", lg: "text-[9rem]" } as const;
// Anzeigebreite je Avatar-Groesse (fuer srcset/sizes der Bildoptimierung).
const IMAGE_SIZES = {
  sm: "48px",
  md: "(max-width: 640px) 45vw, 240px",
  lg: "(max-width: 1024px) 90vw, 360px",
} as const;

/**
 * Spieler-Avatar: zeigt ein frei lizenziertes Foto (Wikimedia), sofern
 * vorhanden. Sonst eine Trikot-Karte in den Teamfarben mit der echten
 * Rückennummer aus dem offiziellen Roster (data/player-visuals.json) –
 * ohne Logos, ohne externe Requests. Bei Ladefehler des Fotos wird sauber auf
 * die Karte zurückgefallen. Füllt den (relativen) Container.
 */
export default function PlayerAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const photo = getPlayerPhoto(name);
  const [failed, setFailed] = useState(false);

  if (photo && !failed) {
    return (
      // Ueber die Next-Bildoptimierung: passende Groesse, AVIF/WebP, eigene
      // Domain (keine Drittanbieter-Cookies von Wikimedia), langes Caching.
      <Image
        src={photo.url}
        alt={name}
        fill
        sizes={IMAGE_SIZES[size]}
        // Grosses Profilfoto ist das LCP-Element der Spielerseite.
        preload={size === "lg"}
        onError={() => setFailed(true)}
        className="object-cover object-top"
      />
    );
  }

  const v = VISUALS[getPlayerSlug(name)];
  const primary = v?.primary ?? "#3f3f46";
  const secondary = v?.secondary ?? "#ffffff";
  const label = v?.number ? `${name}, Trikotnummer ${v.number}` : name;

  return (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(150deg, ${primary} 0%, ${shade(primary, 0.55)} 100%)` }}
    >
      {/* Ärmelstreifen als dezentes Trikot-Motiv (nicht bei Mini-Avataren) */}
      {size !== "sm" && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[18%] h-[5%] opacity-70"
            style={{ backgroundColor: secondary }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-[10%] h-[2.5%] opacity-50"
            style={{ backgroundColor: secondary }}
          />
        </>
      )}
      <span
        aria-hidden="true"
        className={cn(
          "relative font-display font-bold leading-none tracking-tight",
          NUMBER_SIZE[size]
        )}
        style={{
          color: secondary,
          textShadow: size === "sm" ? undefined : "0 2px 0 rgba(0,0,0,0.25)",
        }}
      >
        {v?.number ?? initials(name)}
      </span>
      {size === "lg" && (
        <span
          aria-hidden="true"
          className="absolute left-4 top-4 font-mono text-xs font-bold uppercase tracking-[0.3em] opacity-80"
          style={{ color: secondary }}
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
