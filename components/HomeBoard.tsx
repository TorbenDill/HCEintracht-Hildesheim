"use client";

import { useState } from "react";
import VerticalBoard from "@/components/VerticalBoard";
import HorizontalBoard from "@/components/HorizontalBoard";
import type { BoardRow } from "@/lib/board-rows";
import { cn } from "@/lib/utils";

type View = "vertical" | "horizontal";

/** Board mit Umschalter Rangliste / Positions-Matrix. */
export default function HomeBoard({ rows }: { rows: BoardRow[] }) {
  const [view, setView] = useState<View>("vertical");
  const btn = (v: View, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setView(v)}
      aria-pressed={view === v}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 sm:py-3 sm:text-sm",
        view === v
          ? "bg-primary text-background glow-primary"
          : "border border-border bg-surface text-muted hover:border-primary hover:text-primary"
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2 sm:gap-4">
        {btn(
          "vertical",
          "Rangliste",
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
        {btn(
          "horizontal",
          "Nach Position",
          <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M9 4v16M15 4v16M4 9h16M4 15h16" />
          </svg>
        )}
      </div>
      {view === "vertical" ? <VerticalBoard rows={rows} /> : <HorizontalBoard rows={rows} />}
    </div>
  );
}
