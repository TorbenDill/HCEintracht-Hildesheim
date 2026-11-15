"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "nfl-watchlist-v1";
const EVENT = "watchlist-change";
const EMPTY: string[] = [];

// Snapshot-Cache: useSyncExternalStore verlangt bei unveraendertem Speicher
// dieselbe Referenz, sonst rendert React endlos neu.
let cacheRaw: string | null = null;
let cacheList: string[] = EMPTY;

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cacheRaw) return cacheList;
  cacheRaw = raw;
  try {
    const v = JSON.parse(raw || "[]");
    cacheList = Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : EMPTY;
  } catch {
    cacheList = EMPTY;
  }
  return cacheList;
}

function write(list: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* voller Speicher / privater Modus */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

// Server/Hydration: leer und "nicht bereit", damit kein Flackern entsteht.
const getServerList = () => EMPTY;
const getReady = () => true;
const getServerReady = () => false;
const noopSubscribe = () => () => {};

/**
 * Merkliste (Watchlist) im localStorage. Aenderungen werden ueber ein
 * Custom-Event synchronisiert, damit mehrere Sternchen/Seiten gleichzeitig
 * aktuell bleiben. `ready` verhindert Hydration-Flackern.
 */
export function useWatchlist() {
  const list = useSyncExternalStore(subscribe, read, getServerList);
  const ready = useSyncExternalStore(noopSubscribe, getReady, getServerReady);

  const toggle = useCallback((slug: string) => {
    const cur = read();
    write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]);
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((s) => s !== slug));
  }, []);

  return {
    list,
    ready,
    has: (slug: string) => list.includes(slug),
    toggle,
    remove,
  };
}
