"use client";

import { useWatchlist } from "@/lib/useWatchlist";
import { cn } from "@/lib/utils";

/**
 * Stern zum Hinzufügen/Entfernen eines Spielers zur Merkliste. Einzelnes,
 * einfaches SVG-Glyph (konsistent mit dem bestehenden Inline-SVG im Header);
 * das Projekt nutzt keine Icon-Bibliothek.
 */
export default function StarButton({
  slug,
  size = "md",
  withLabel = false,
  className,
}: {
  slug: string;
  size?: "sm" | "md";
  withLabel?: boolean;
  className?: string;
}) {
  const { has, toggle, ready } = useWatchlist();
  const active = ready && has(slug);
  const dim = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={active}
      aria-label={active ? "Von Merkliste entfernen" : "Zur Merkliste hinzufügen"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all",
        active
          ? "border-primary/40 bg-primary-glow text-primary"
          : "border-border bg-surface text-muted hover:border-primary hover:text-primary",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={dim}
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      >
        <path d="M12 2.5l2.9 5.88 6.49.94-4.7 4.58 1.11 6.46L12 17.9l-5.8 3.05 1.1-6.46-4.69-4.58 6.49-.94L12 2.5z" />
      </svg>
      {withLabel && <span>{active ? "Gemerkt" : "Merken"}</span>}
    </button>
  );
}
