import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Deterministische Farbwahl pro Name – jeder Spieler bekommt immer
// denselben Verlauf, ohne externe Bild-Requests (keine 404s/Fehlermeldungen).
const GRADIENTS = [
  "from-cyan-500/40 via-surface to-background",
  "from-emerald-500/40 via-surface to-background",
  "from-violet-500/40 via-surface to-background",
  "from-amber-500/40 via-surface to-background",
  "from-rose-500/40 via-surface to-background",
  "from-sky-500/40 via-surface to-background",
  "from-lime-500/40 via-surface to-background",
  "from-fuchsia-500/40 via-surface to-background",
];

function hash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Spieler-Avatar mit Initialen und deterministischem Farbverlauf.
 * Füllt den (relativ positionierten) Eltern-Container.
 */
export default function PlayerAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
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
