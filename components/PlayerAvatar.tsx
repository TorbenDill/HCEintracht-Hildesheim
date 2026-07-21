"use client";

import { useState } from "react";
import { getPlayerPhoto } from "@/lib/player-images";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Deterministische Farbwahl pro Name – jeder Spieler bekommt immer denselben
// Verlauf, ohne externe Bild-Requests (keine 404s/Fehlermeldungen).
const GRADIENTS = [
  "from-cyan-600/25 via-surface to-background",
  "from-emerald-600/25 via-surface to-background",
  "from-violet-600/25 via-surface to-background",
  "from-amber-600/25 via-surface to-background",
  "from-rose-600/25 via-surface to-background",
  "from-sky-600/25 via-surface to-background",
  "from-lime-600/25 via-surface to-background",
  "from-fuchsia-600/25 via-surface to-background",
];

function hash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Spieler-Avatar: zeigt ein frei lizenziertes Wikimedia-Foto, sofern vorhanden,
 * sonst einen Initialen-Avatar mit festem Farbverlauf. Bei Ladefehler des Fotos
 * wird sauber auf den Avatar zurückgefallen. Füllt den (relativen) Container.
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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.url}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  const textSize =
    size === "lg" ? "text-6xl" : size === "sm" ? "text-[11px]" : "text-base";
  const gradient = GRADIENTS[hash(name) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-gradient-to-br font-black tracking-tight text-foreground/85",
        gradient,
        textSize
      )}
      role="img"
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
