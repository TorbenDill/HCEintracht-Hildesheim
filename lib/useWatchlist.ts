"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "nfl-watchlist-v1";
const EVENT = "watchlist-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/**
 * Merkliste (Watchlist) im localStorage. Änderungen werden über ein
 * Custom-Event synchronisiert, damit mehrere Sternchen/Seiten gleichzeitig
 * aktuell bleiben. `ready` verhindert Hydration-Flackern.
 */
export function useWatchlist() {
  const [list, setList] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setList(read());
    setReady(true);
    const on = () => setList(read());
    window.addEventListener(EVENT, on);
    window.addEventListener("storage", on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener("storage", on);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    const next = cur.includes(slug)
      ? cur.filter((s) => s !== slug)
      : [...cur, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const remove = useCallback((slug: string) => {
    localStorage.setItem(
      KEY,
      JSON.stringify(read().filter((s) => s !== slug))
    );
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return {
    list,
    ready,
    has: (slug: string) => list.includes(slug),
    toggle,
    remove,
  };
}
