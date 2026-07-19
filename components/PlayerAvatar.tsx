"use client";

import { useState } from "react";
import { getPlayerImage } from "@/lib/player-service";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/**
 * Spielerportrait mit Initialen-Fallback.
 * Füllt den (relativ positionierten) Eltern-Container. Schlägt das externe
 * Bild fehl, wird ein sauberer Initialen-Avatar gezeigt, statt ein kaputtes
 * Bild-Icon.
 */
export default function PlayerAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);

  const textSize =
    size === "lg" ? "text-5xl" : size === "sm" ? "text-[11px]" : "text-base";

  if (failed) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-light via-surface to-background font-black tracking-tight text-primary/80",
          textSize
        )}
        aria-label={name}
      >
        {initials(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={getPlayerImage(name)}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
