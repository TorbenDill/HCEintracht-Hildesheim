"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getRankedMinPlayers, getMinPlayer, type MinPlayer } from "@/lib/players-min";
import { useWatchlist } from "@/lib/useWatchlist";
import {
  type BoardItem,
  type MyBoard,
  MAX_NAME,
  MAX_NOTE,
  MAX_TIER_LABEL,
  SHARE_PARAM,
  type PlayerNote,
  ROUNDS,
  boardPlayers,
  cleanText,
  hasNote,
  sanitizeNote,
  decodeShare,
  encodeShare,
  loadBoard,
  newTierId,
  saveBoard,
} from "@/lib/my-board";
import { renderBoardPdf, renderBoardPng, type PngFormat } from "@/lib/board-export";
import PlayerAvatar from "@/components/PlayerAvatar";
import { cn } from "@/lib/utils";

// Positionsreihenfolge bewusst hier statt aus lib/positions (die zieht die
// kompletten Positionstexte ins Client-Bundle).
const POSITIONS = ["QB", "RB", "WR", "TE", "OT", "IOL", "EDGE", "DT", "LB", "CB", "S"];
const RANKED = getRankedMinPlayers();
const HISTORY_LIMIT = 50;

type Snapshot = Pick<MyBoard, "name" | "items" | "notes">;

function fromTemplate(slugs: string[], name = "Mein Big Board"): MyBoard {
  return {
    v: 1,
    name,
    items: slugs.map((slug) => ({ type: "player", slug })),
    notes: {},
    updated: new Date().toISOString(),
  };
}

function itemKey(i: BoardItem): string {
  return i.type === "player" ? `p:${i.slug}` : `t:${i.id}`;
}

function moveArr<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [x] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, x);
  return next;
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

const Icon = {
  grip: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
    </svg>
  ),
  up: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m6 15 6-6 6 6" /></svg>
  ),
  down: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="m6 9 6 6 6-6" /></svg>
  ),
  x: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  note: (filled: boolean) => (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8}>
      <path d="M5 4h10l4 4v12H5z" /><path d="M9 12h6M9 16h4" stroke={filled ? "#fff" : "currentColor"} />
    </svg>
  ),
  plus: (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M12 5v14M5 12h14" /></svg>
  ),
};

const btnBase =
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed disabled:opacity-40";
const btnGhost = cn(btnBase, "border-border bg-surface text-foreground hover:border-primary hover:text-primary");
const btnPrimary = cn(btnBase, "border-primary bg-primary text-background hover:brightness-110");
const iconBtn =
  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-light hover:text-primary disabled:pointer-events-none disabled:opacity-30";

export default function BoardEditor() {
  const watch = useWatchlist();
  const [ready, setReady] = useState(false);
  const [board, setBoard] = useState<MyBoard | null>(null);
  const [shared, setShared] = useState<MyBoard | null>(null);
  const [sharedInvalid, setSharedInvalid] = useState(false);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);
  const [saveOk, setSaveOk] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [poolQuery, setPoolQuery] = useState("");
  const [poolPos, setPoolPos] = useState<string | null>(null);
  const [poolOpen, setPoolOpen] = useState(false);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [announce, setAnnounce] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);

  // ---- Laden: eigener Stand + evtl. geteiltes Board aus dem URL-Fragment ----
  useEffect(() => {
    const own = loadBoard();
    const hash = new URLSearchParams(window.location.hash.slice(1)).get(SHARE_PARAM);
    let sh: MyBoard | null = null;
    let bad = false;
    if (hash) {
      sh = decodeShare(hash);
      bad = !sh;
    }
    // Einmaliges Hydrieren aus Browser-Speicher (nicht auf dem Server lesbar).
    /* eslint-disable react-hooks/set-state-in-effect */
    setBoard(own);
    setShared(sh);
    setSharedInvalid(bad);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // ---- Speichern bei jeder Aenderung ----
  useEffect(() => {
    if (!ready || !board) return;
    // Rueckmeldung, falls localStorage voll/gesperrt ist.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveOk(saveBoard(board));
  }, [board, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  /** Jede inhaltliche Aenderung laeuft hier durch (Undo-Historie). */
  const commit = (fn: (b: MyBoard) => Snapshot | null, message?: string) => {
    if (!board) return;
    const next = fn(board);
    if (!next) return;
    setPast((p) => [...p.slice(-HISTORY_LIMIT + 1), { name: board.name, items: board.items, notes: board.notes }]);
    setFuture([]);
    setBoard({ ...board, ...next, updated: new Date().toISOString() });
    if (message) setAnnounce(message);
  };

  const undo = useCallback(() => {
    if (!board || past.length === 0) return;
    const prev = past[past.length - 1];
    setFuture((f) => [{ name: board.name, items: board.items, notes: board.notes }, ...f].slice(0, HISTORY_LIMIT));
    setPast((p) => p.slice(0, -1));
    setBoard({ ...board, ...prev, updated: new Date().toISOString() });
    setAnnounce("Rückgängig gemacht");
  }, [board, past]);

  const redo = useCallback(() => {
    if (!board || future.length === 0) return;
    const nxt = future[0];
    setPast((p) => [...p, { name: board.name, items: board.items, notes: board.notes }]);
    setFuture((f) => f.slice(1));
    setBoard({ ...board, ...nxt, updated: new Date().toISOString() });
    setAnnounce("Wiederhergestellt");
  }, [board, future]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  // ---- Abgeleitete Werte ----
  const view = shared ?? board;
  const readOnly = Boolean(shared);
  const onBoard = useMemo(() => new Set(view ? boardPlayers(view) : []), [view]);

  /** Eigener Rang, Positionsrang und Consensus-Abweichung je Zeile. */
  const rows = useMemo(() => {
    if (!view) return [];
    let rank = 0;
    const posCount: Record<string, number> = {};
    return view.items.map((item, index) => {
      if (item.type === "tier") return { item, index, key: itemKey(item) } as const;
      const p = getMinPlayer(item.slug) as MinPlayer;
      rank += 1;
      posCount[p.position] = (posCount[p.position] ?? 0) + 1;
      return {
        item,
        index,
        key: itemKey(item),
        p,
        rank,
        posRank: posCount[p.position],
        delta: (p.ranking_overall ?? rank) - rank,
      } as const;
    });
  }, [view]);

  const playerCount = onBoard.size;
  const tierCount = view ? view.items.length - playerCount : 0;

  const pool = useMemo(() => {
    const q = poolQuery.trim().toLowerCase();
    return RANKED.filter(
      (p) =>
        !onBoard.has(p.slug) &&
        (!poolPos || p.position === poolPos) &&
        (!q || p.name.toLowerCase().includes(q) || p.college.toLowerCase().includes(q))
    );
  }, [onBoard, poolQuery, poolPos]);

  // ---- Aktionen ----
  const start = (slugs: string[], label: string) => {
    const b = fromTemplate(slugs);
    if (board) setPast((p) => [...p.slice(-HISTORY_LIMIT + 1), { name: board.name, items: board.items, notes: board.notes }]);
    setFuture([]);
    setBoard(b);
    setConfirmReset(false);
    setFilter(null);
    setToast(`Board gestartet: ${label}`);
  };

  const templates: { label: string; hint: string; slugs: () => string[] }[] = [
    { label: "Consensus Top 32", hint: "Erste Runde", slugs: () => RANKED.slice(0, 32).map((p) => p.slug) },
    { label: "Consensus Top 50", hint: "Erste und zweite Runde", slugs: () => RANKED.slice(0, 50).map((p) => p.slug) },
    { label: "Consensus Top 100", hint: "Tag eins und zwei", slugs: () => RANKED.slice(0, 100).map((p) => p.slug) },
    { label: `Alle ${RANKED.length} Prospects`, hint: "Das komplette Board", slugs: () => RANKED.map((p) => p.slug) },
  ];
  const watchSlugs = RANKED.filter((p) => watch.list.includes(p.slug)).map((p) => p.slug);

  const moveTo = (from: number, to: number) => {
    if (from === to) return;
    commit((b) => ({ ...b, items: moveArr(b.items, from, to) }));
  };

  /** Spieler auf einen bestimmten eigenen Rang setzen (Tier-Zeilen zaehlen nicht). */
  const moveToRank = (from: number, targetRank: number) => {
    commit((b) => {
      const items = b.items.slice();
      const [x] = items.splice(from, 1);
      let seen = 0;
      let at = items.length;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type === "player") {
          seen += 1;
          if (seen === targetRank) {
            at = i;
            break;
          }
        }
      }
      items.splice(at, 0, x);
      return { ...b, items };
    }, `Auf Platz ${targetRank} verschoben`);
  };

  const removeAt = (index: number) => {
    const it = view?.items[index];
    commit((b) => {
      const items = b.items.filter((_, i) => i !== index);
      const notes = { ...b.notes };
      if (it?.type === "player") delete notes[it.slug];
      return { ...b, items, notes };
    }, "Entfernt");
    if (it?.type === "player") {
      const name = getMinPlayer(it.slug)?.name;
      setToast(`${name ?? "Spieler"} entfernt – Strg+Z macht es rückgängig`);
    }
  };

  const addPlayer = (slug: string) => {
    commit((b) => ({ ...b, items: [...b.items, { type: "player", slug }] }));
    setToast(`${getMinPlayer(slug)?.name} auf Platz ${playerCount + 1} ergänzt`);
  };

  const addTier = (at?: number) => {
    const n = tierCount + 1;
    commit((b) => {
      const items = b.items.slice();
      items.splice(at ?? items.length, 0, { type: "tier", id: newTierId(), label: `Tier ${n}` });
      return { ...b, items };
    }, "Tier-Trenner eingefügt");
  };

  const setTierLabel = (index: number, label: string) =>
    commit((b) => {
      const it = b.items[index];
      if (!it || it.type !== "tier") return null;
      const items = b.items.slice();
      items[index] = { ...it, label: cleanText(label, MAX_TIER_LABEL) || it.label };
      return { ...b, items };
    });

  const setNoteField = (slug: string, field: keyof PlayerNote, value: string) =>
    commit((b) => {
      const notes = { ...b.notes };
      const merged = sanitizeNote({ ...(notes[slug] ?? {}), [field]: value });
      if (merged) notes[slug] = merged;
      else delete notes[slug];
      return { ...b, notes };
    });

  const sortByConsensus = () =>
    commit((b) => {
      const players = boardPlayers(b)
        .map((s) => getMinPlayer(s) as MinPlayer)
        .sort((a, c) => (a.ranking_overall ?? 999) - (c.ranking_overall ?? 999));
      return { ...b, items: players.map((p) => ({ type: "player", slug: p.slug })) };
    }, "Nach Consensus sortiert, Tier-Trenner entfernt");

  const shareUrl = () => {
    if (!board) return "";
    return `${window.location.origin}/mein-board#${SHARE_PARAM}=${encodeShare(board)}`;
  };

  const copyShare = async () => {
    const url = shareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setToast("Link kopiert – Notizen bleiben privat");
    } catch {
      window.prompt("Link zum Kopieren:", url);
    }
  };

  const acceptShared = () => {
    if (!shared) return;
    if (board) setPast((p) => [...p, { name: board.name, items: board.items, notes: board.notes }]);
    setBoard({ ...shared, updated: new Date().toISOString() });
    setShared(null);
    history.replaceState(null, "", "/mein-board");
    setToast("Geteiltes Board übernommen – Strg+Z holt dein altes zurück");
  };

  const dismissShared = () => {
    setShared(null);
    setSharedInvalid(false);
    history.replaceState(null, "", "/mein-board");
  };

  const exportText = async () => {
    if (!view) return;
    const lines = [`${view.name} – NFL Draft 2027`, ""];
    for (const r of rows) {
      if (r.item.type === "tier") lines.push("", `— ${r.item.label} —`);
      else if ("p" in r && r.p) lines.push(`${r.rank}. ${r.p.name} (${r.p.position}, ${r.p.college})`);
    }
    lines.push("", "Erstellt auf nfldraft-scouting.de/mein-board");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setToast("Board als Text kopiert");
    } catch {
      setToast("Kopieren nicht möglich – Browser blockiert die Zwischenablage");
    }
  };

  const [busy, setBusy] = useState<string | null>(null);

  const download = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const fileBase = () =>
    (view?.name ?? "mein-big-board")
      .toLowerCase()
      .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "mein-big-board";

  const exportPng = async (format: PngFormat) => {
    if (!view || busy) return;
    setBusy(format);
    try {
      const blob = await renderBoardPng(view, rows, format);
      download(blob, `${fileBase()}-2027-${format === "story" ? "story" : "feed"}.png`);
      setToast(format === "story" ? "Story-Bild (9:16) gespeichert" : "Feed-Bild (4:5) gespeichert");
    } catch {
      setToast("Bild konnte nicht erzeugt werden");
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = async () => {
    if (!view || busy) return;
    setBusy("pdf");
    try {
      const blob = await renderBoardPdf(view, rows);
      download(blob, `${fileBase()}-2027.pdf`);
      setToast("PDF gespeichert – mit Notizen und Abhak-Kästchen");
    } catch {
      setToast("PDF konnte nicht erzeugt werden");
    } finally {
      setBusy(null);
    }
  };

  // ---- Drag & Drop (Pointer-Events, funktioniert mit Maus und Touch) ----
  const listRef = useRef<HTMLOListElement>(null);
  const [drag, setDrag] = useState<{ from: number; key: string; dy: number; target: number } | null>(null);
  const dragRef = useRef<{ from: number; target: number; startY: number; lastY: number; startScroll: number; raf: number } | null>(null);

  const computeTarget = (clientY: number, from: number): number => {
    const els = listRef.current?.querySelectorAll<HTMLElement>("[data-row]");
    if (!els) return from;
    let t = 0;
    els.forEach((el) => {
      const idx = Number(el.dataset.row);
      if (idx === from) return;
      const r = el.getBoundingClientRect();
      if (clientY > r.top + r.height / 2) t += 1;
    });
    return t;
  };

  const updateDrag = (clientY: number) => {
    const d = dragRef.current;
    if (!d) return;
    d.lastY = clientY;
    const dy = clientY + window.scrollY - (d.startY + d.startScroll);
    d.target = computeTarget(clientY, d.from);
    const target = d.target;
    setDrag((cur) => (cur ? { ...cur, dy, target } : cur));
  };

  const autoScroll = () => {
    const d = dragRef.current;
    if (!d) return;
    const edge = 90;
    const y = d.lastY;
    let speed = 0;
    if (y < edge) speed = -Math.ceil((edge - y) / 6);
    else if (y > window.innerHeight - edge) speed = Math.ceil((y - (window.innerHeight - edge)) / 6);
    if (speed) {
      window.scrollBy(0, speed);
      updateDrag(y);
    }
    d.raf = requestAnimationFrame(autoScroll);
  };

  const onHandleDown = (e: React.PointerEvent<HTMLButtonElement>, index: number, key: string) => {
    if (readOnly || filter || e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { from: index, target: index, startY: e.clientY, lastY: e.clientY, startScroll: window.scrollY, raf: 0 };
    dragRef.current.raf = requestAnimationFrame(autoScroll);
    setDrag({ from: index, key, dy: 0, target: index });
  };

  const endDrag = (apply: boolean) => {
    const d = dragRef.current;
    if (!d) return;
    cancelAnimationFrame(d.raf);
    dragRef.current = null;
    setDrag(null);
    if (apply && d.target !== d.from) {
      moveTo(d.from, d.target);
      setAnnounce(`Verschoben`);
    }
  };

  useEffect(() => () => cancelAnimationFrame(dragRef.current?.raf ?? 0), []);

  // ------------------------------------------------------------------------
  if (!ready || !watch.ready) {
    return <p className="py-16 text-center text-sm text-muted">Editor lädt …</p>;
  }

  // Erster Besuch: Vorlage waehlen
  if (!view) {
    return (
      <section aria-labelledby="start-titel" className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        <h2 id="start-titel" className="mb-1 font-display text-2xl font-semibold uppercase tracking-tight">
          Womit willst du starten?
        </h2>
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
          Nimm das Consensus-Board als Grundlage und schieb die Spieler dorthin, wo du sie siehst –
          oder fang mit deiner Merkliste an. Du kannst jederzeit neu starten.
        </p>
        {sharedInvalid && (
          <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Der geteilte Link ist ungültig oder unvollständig und wurde ignoriert.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => start(t.slugs(), t.label)}
              className="min-w-0 rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary"
            >
              <span className="block font-bold text-foreground">{t.label}</span>
              <span className="block text-xs text-muted">{t.hint}</span>
            </button>
          ))}
          <button
            type="button"
            disabled={watchSlugs.length === 0}
            onClick={() => start(watchSlugs, "Merkliste")}
            className="min-w-0 rounded-xl border border-border bg-background p-4 text-left transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="block font-bold text-foreground">Aus meiner Merkliste</span>
            <span className="block text-xs text-muted">
              {watchSlugs.length ? `${watchSlugs.length} gemerkte Spieler` : "Noch keine Spieler gemerkt"}
            </span>
          </button>
        </div>
      </section>
    );
  }

  const dragging = Boolean(drag);
  // Einfuegeposition (unter den Nicht-gezogenen Zeilen) -> Index der Zeile mit Markierung
  let dropBeforeKey: string | null = null;
  let dropAtEnd = false;
  if (drag && drag.target !== drag.from) {
    const others = rows.filter((r) => r.index !== drag.from);
    if (drag.target >= others.length) dropAtEnd = true;
    else dropBeforeKey = others[drag.target].key;
  }

  const visibleRows = filter
    ? rows.filter((r) => r.item.type === "player" && "p" in r && r.p?.position === filter)
    : rows;

  return (
    <div className={cn("board-editor", dragging && "select-none")}>
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>

      {/* Geteiltes Board: Vorschau mit Uebernehmen/Verwerfen */}
      {shared && (
        <div role="region" aria-label="Geteiltes Board" className="mb-5 flex flex-col gap-3 rounded-2xl border border-primary/40 bg-primary-glow p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground">
            <strong>Geteiltes Board:</strong> „{shared.name}“ mit {playerCount} Spielern. Das ist eine
            Vorschau – dein eigenes Board bleibt unverändert, bis du es übernimmst.
          </p>
          <div className="flex flex-shrink-0 gap-2">
            <button type="button" onClick={acceptShared} className={btnPrimary}>
              {board ? "Übernehmen (ersetzt meins)" : "Übernehmen"}
            </button>
            <button type="button" onClick={dismissShared} className={btnGhost}>
              {board ? "Zu meinem Board" : "Verwerfen"}
            </button>
          </div>
        </div>
      )}
      {sharedInvalid && !shared && (
        <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Der geteilte Link ist ungültig oder unvollständig und wurde ignoriert.{" "}
          <button type="button" className="underline" onClick={dismissShared}>Ausblenden</button>
        </p>
      )}

      {/* Werkzeugleiste */}
      <div className="no-print mb-4 rounded-2xl border border-border bg-surface p-3 sm:p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="board-name" className="sr-only">Name des Boards</label>
          <input
            id="board-name"
            key={view.name}
            defaultValue={view.name}
            readOnly={readOnly}
            maxLength={MAX_NAME}
            onBlur={(e) => {
              const v = cleanText(e.target.value, MAX_NAME);
              if (!readOnly && v && v !== view.name) commit((b) => ({ ...b, name: v }), "Name geändert");
              else e.target.value = view.name;
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-1 font-display text-2xl font-semibold uppercase tracking-tight text-foreground hover:border-border focus:border-primary focus:outline-none"
          />
          <span className="px-2 font-mono text-[11px] text-muted sm:text-right">
            {playerCount} Spieler{tierCount ? ` · ${tierCount} Tiers` : ""}
            {!readOnly && board && (
              <>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> · </span>
                {saveOk ? `gespeichert ${timeLabel(board.updated)}` : (
                  <span className="text-red-700">Speichern im Browser nicht möglich</span>
                )}
              </>
            )}
          </span>
        </div>

        {!readOnly && (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={undo} disabled={!past.length} className={btnGhost} title="Strg+Z">
              Rückgängig
            </button>
            <button type="button" onClick={redo} disabled={!future.length} className={btnGhost} title="Strg+Umschalt+Z">
              Wiederholen
            </button>
            <button type="button" onClick={() => addTier()} className={btnGhost}>
              {Icon.plus} Tier-Trenner
            </button>
            <button type="button" onClick={() => setPoolOpen((o) => !o)} aria-expanded={poolOpen} aria-controls="pool" className={cn(btnGhost, "lg:hidden")}>
              {Icon.plus} Spieler
            </button>
            <span className="mx-1 hidden w-px self-stretch bg-border sm:block" aria-hidden="true" />
            <button type="button" onClick={copyShare} className={btnGhost} data-ga-event="board_export" data-ga-label="link">Link teilen</button>
            <button type="button" onClick={exportText} className={btnGhost} data-ga-event="board_export" data-ga-label="text">Als Text</button>
            <span className="mx-1 hidden w-px self-stretch bg-border sm:block" aria-hidden="true" />
            <button type="button" onClick={sortByConsensus} className={btnGhost}>Nach Consensus</button>
            <button type="button" onClick={() => setConfirmReset((c) => !c)} aria-expanded={confirmReset} className={btnGhost}>
              Neu starten
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl bg-surface-light/60 p-2">
          <span className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted">Download</span>
          <button type="button" onClick={() => exportPng("feed")} disabled={Boolean(busy)} className={btnPrimary} data-ga-event="board_export" data-ga-label="png_feed">
            {busy === "feed" ? "Erzeuge …" : "PNG Feed 4:5"}
          </button>
          <button type="button" onClick={() => exportPng("story")} disabled={Boolean(busy)} className={btnPrimary} data-ga-event="board_export" data-ga-label="png_story">
            {busy === "story" ? "Erzeuge …" : "PNG Story 9:16"}
          </button>
          <button type="button" onClick={exportPdf} disabled={Boolean(busy)} className={btnPrimary} data-ga-event="board_export" data-ga-label="pdf">
            {busy === "pdf" ? "Erzeuge …" : "PDF für den Draft"}
          </button>
          <span className="px-1 text-[10px] text-muted">PNG: deine Top 32 · PDF: ganzes Board mit Notizen</span>
        </div>

        {confirmReset && !readOnly && (
          <div className="mt-3 rounded-xl border border-border bg-background p-3">
            <p className="mb-2 text-xs text-muted">
              Neue Vorlage wählen. Dein aktuelles Board lässt sich danach mit „Rückgängig“ zurückholen.
            </p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button key={t.label} type="button" onClick={() => start(t.slugs(), t.label)} className={btnGhost}>
                  {t.label}
                </button>
              ))}
              <button type="button" disabled={!watchSlugs.length} onClick={() => start(watchSlugs, "Merkliste")} className={btnGhost}>
                Merkliste ({watchSlugs.length})
              </button>
            </div>
          </div>
        )}

        {/* Positionsfilter fuer die Ansicht */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3" role="group" aria-label="Board nach Position filtern">
          <button
            type="button"
            onClick={() => setFilter(null)}
            aria-pressed={!filter}
            className={cn("rounded-full px-3 py-1 text-[11px] font-bold", !filter ? "bg-foreground text-background" : "bg-surface-light text-muted hover:text-primary")}
          >
            Alle
          </button>
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setFilter(filter === pos ? null : pos)}
              aria-pressed={filter === pos}
              className={cn("rounded-full px-3 py-1 text-[11px] font-bold", filter === pos ? "bg-foreground text-background" : "bg-surface-light text-muted hover:text-primary")}
            >
              {pos}
            </button>
          ))}
          {filter && !readOnly && (
            <span className="ml-1 text-[11px] text-muted">Sortieren ist in der gefilterten Ansicht aus.</span>
          )}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Das Board */}
        <div className="min-w-0">
          {visibleRows.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface p-8 text-center text-sm text-muted">
              {filter ? `Keine ${filter} auf deinem Board.` : "Dein Board ist leer – füge rechts Spieler hinzu."}
            </p>
          ) : (
            <ol ref={listRef} className="flex flex-col gap-1.5" aria-label={view.name}>
              {visibleRows.map((r) => {
                const isDragged = drag?.key === r.key;
                const marker = dropBeforeKey === r.key;
                const style = isDragged ? { transform: `translateY(${drag!.dy}px)`, zIndex: 20 } : undefined;

                if (r.item.type === "tier") {
                  const tier = r.item;
                  return (
                    <li
                      key={r.key}
                      data-row={r.index}
                      style={style}
                      className={cn(
                        "relative flex items-center gap-2 rounded-lg border-l-4 border-primary bg-foreground px-2 py-1.5 text-background",
                        isDragged && "shadow-2xl ring-2 ring-primary",
                        marker && "drop-marker"
                      )}
                    >
                      {!readOnly && (
                        <button
                          type="button"
                          aria-label={`${tier.label} verschieben (ziehen)`}
                          onPointerDown={(e) => onHandleDown(e, r.index, r.key)}
                          onPointerMove={(e) => dragRef.current && updateDrag(e.clientY)}
                          onPointerUp={() => endDrag(true)}
                          onPointerCancel={() => endDrag(false)}
                          className="no-print flex h-8 w-7 flex-shrink-0 cursor-grab touch-none items-center justify-center text-background/60 hover:text-background active:cursor-grabbing"
                        >
                          {Icon.grip}
                        </button>
                      )}
                      <label className="sr-only" htmlFor={`tier-${tier.id}`}>Tier-Name</label>
                      <input
                        id={`tier-${tier.id}`}
                        key={tier.label}
                        defaultValue={tier.label}
                        readOnly={readOnly}
                        maxLength={MAX_TIER_LABEL}
                        onBlur={(e) => {
                          if (e.target.value.trim() !== tier.label) setTierLabel(r.index, e.target.value);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        className="min-w-0 flex-1 rounded bg-transparent px-1 py-0.5 font-display text-sm font-semibold uppercase tracking-[0.15em] text-background focus:bg-background/10 focus:outline-none"
                      />
                      {!readOnly && (
                        <div className="no-print flex items-center">
                          <button type="button" className={cn(iconBtn, "text-background/60 hover:bg-background/10 hover:text-background")} disabled={r.index === 0} onClick={() => moveTo(r.index, r.index - 1)} aria-label={`${tier.label} nach oben`}>{Icon.up}</button>
                          <button type="button" className={cn(iconBtn, "text-background/60 hover:bg-background/10 hover:text-background")} disabled={r.index === view.items.length - 1} onClick={() => moveTo(r.index, r.index + 1)} aria-label={`${tier.label} nach unten`}>{Icon.down}</button>
                          <button type="button" className={cn(iconBtn, "text-background/60 hover:bg-background/10 hover:text-background")} onClick={() => removeAt(r.index)} aria-label={`${tier.label} entfernen`}>{Icon.x}</button>
                        </div>
                      )}
                    </li>
                  );
                }

                if (!("p" in r) || !r.p) return null;
                const { p, rank, posRank, delta } = r;
                const slug = p.slug;
                const note: PlayerNote | undefined = view.notes[slug];
                const noteOpen = openNote === slug;
                return (
                  <li
                    key={r.key}
                    data-row={r.index}
                    style={style}
                    className={cn(
                      "relative rounded-xl border border-border bg-surface transition-shadow",
                      isDragged && "shadow-2xl ring-2 ring-primary",
                      marker && "drop-marker"
                    )}
                  >
                    <div className="flex items-center gap-1.5 px-1.5 py-1.5 sm:gap-3 sm:px-2">
                      {!readOnly && !filter && (
                        <button
                          type="button"
                          aria-label={`${p.name} verschieben (ziehen)`}
                          onPointerDown={(e) => onHandleDown(e, r.index, r.key)}
                          onPointerMove={(e) => dragRef.current && updateDrag(e.clientY)}
                          onPointerUp={() => endDrag(true)}
                          onPointerCancel={() => endDrag(false)}
                          className="no-print flex h-10 w-7 flex-shrink-0 cursor-grab touch-none items-center justify-center text-muted/60 hover:text-primary active:cursor-grabbing"
                        >
                          {Icon.grip}
                        </button>
                      )}

                      {/* Eigener Rang – direkt editierbar */}
                      {readOnly || filter ? (
                        <span className="w-10 flex-shrink-0 text-center font-mono text-base font-bold text-primary">{rank}</span>
                      ) : (
                        <>
                          <label htmlFor={`rank-${slug}`} className="sr-only">Rang von {p.name}</label>
                          <input
                            id={`rank-${slug}`}
                            key={`${slug}-${rank}`}
                            inputMode="numeric"
                            defaultValue={rank}
                            onFocus={(e) => e.currentTarget.select()}
                            onBlur={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (Number.isFinite(v) && v !== rank) moveToRank(r.index, Math.max(1, Math.min(playerCount, v)));
                              else e.target.value = String(rank);
                            }}
                            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                            className="h-9 w-10 flex-shrink-0 rounded-md border border-transparent bg-transparent text-center font-mono text-base font-bold text-primary hover:border-border focus:border-primary focus:bg-background focus:outline-none"
                            title="Rang eintippen, um zu verschieben"
                          />
                        </>
                      )}

                      <span className="relative hidden h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light min-[400px]:block">
                        <PlayerAvatar name={p.name} size="sm" />
                      </span>

                      <Link href={`/player/${slug}`} className="min-w-0 flex-1 py-1" draggable={false}>
                        <span className="block truncate text-sm font-bold uppercase tracking-wide text-foreground hover:text-primary">
                          {p.name}
                        </span>
                        <span className="block truncate text-[11px] text-muted">
                          <span className="font-bold text-foreground/80">{p.position}{posRank}</span> · {p.college}
                        </span>
                      </Link>

                      <span
                        className="hidden w-[74px] flex-shrink-0 text-right font-mono text-[11px] leading-tight sm:block"
                        title={`Consensus-Rang ${p.ranking_overall}`}
                      >
                        <span className="block text-muted">Cons. #{p.ranking_overall}</span>
                        <span className={cn("block font-bold", delta > 0 ? "text-accent" : delta < 0 ? "text-red-700" : "text-muted")}>
                          {delta > 0 ? `▲ ${delta}` : delta < 0 ? `▼ ${-delta}` : "="}
                        </span>
                      </span>
                      <span className={cn("w-8 flex-shrink-0 text-right font-mono text-[11px] font-bold sm:hidden", delta > 0 ? "text-accent" : delta < 0 ? "text-red-700" : "text-muted")} aria-label={`Consensus-Rang ${p.ranking_overall}`}>
                        {delta > 0 ? `+${delta}` : delta < 0 ? delta : "="}
                      </span>

                      {(!readOnly || note) && (
                        <button
                          type="button"
                          onClick={() => setOpenNote(noteOpen ? null : slug)}
                          aria-expanded={noteOpen}
                          aria-label={note ? `Notiz zu ${p.name} anzeigen` : `Notiz zu ${p.name} schreiben`}
                          className={cn(iconBtn, "no-print", note && "text-primary")}
                        >
                          {Icon.note(hasNote(note))}
                        </button>
                      )}
                      {!readOnly && !filter && (
                        <div className="no-print hidden items-center sm:flex">
                          <button type="button" className={iconBtn} disabled={r.index === 0} onClick={() => moveTo(r.index, r.index - 1)} aria-label={`${p.name} nach oben`}>{Icon.up}</button>
                          <button type="button" className={iconBtn} disabled={r.index === view.items.length - 1} onClick={() => moveTo(r.index, r.index + 1)} aria-label={`${p.name} nach unten`}>{Icon.down}</button>
                        </div>
                      )}
                      {!readOnly && (
                        <button type="button" className={cn(iconBtn, "no-print hover:text-red-700")} onClick={() => removeAt(r.index)} aria-label={`${p.name} vom Board entfernen`}>
                          {Icon.x}
                        </button>
                      )}
                    </div>
                    {note && !noteOpen && (
                      <button
                        type="button"
                        onClick={() => setOpenNote(slug)}
                        className="block w-full truncate border-t border-border px-3 py-1.5 text-left text-xs text-muted hover:text-foreground"
                      >
                        {noteSummary(note)}
                      </button>
                    )}
                    {noteOpen && (
                      <div className="grid gap-2 border-t border-border px-3 py-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label htmlFor={`round-${slug}`} className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-muted">
                            Meine Projektion
                          </label>
                          <select
                            id={`round-${slug}`}
                            disabled={readOnly}
                            value={note?.round ?? ""}
                            onChange={(e) => setNoteField(slug, "round", e.target.value)}
                            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none"
                          >
                            <option value="">– keine –</option>
                            {ROUNDS.map((rd) => (
                              <option key={rd} value={rd}>{rd === "UDFA" ? "Undrafted (UDFA)" : `Runde ${rd}`}</option>
                            ))}
                          </select>
                        </div>
                        {NOTE_FIELD_META.map((f, fi) => (
                          <div key={f.key} className={f.key === "text" ? "sm:col-span-2" : undefined}>
                            <label htmlFor={`${f.key}-${slug}`} className={cn("mb-1 block text-[10px] font-bold uppercase tracking-wider", f.color)}>
                              {f.label}
                            </label>
                            <textarea
                              id={`${f.key}-${slug}`}
                              autoFocus={fi === 0}
                              readOnly={readOnly}
                              defaultValue={note?.[f.key] ?? ""}
                              maxLength={MAX_NOTE}
                              rows={2}
                              placeholder={f.placeholder}
                              onBlur={(e) => {
                                if (!readOnly && e.target.value.trim() !== (note?.[f.key] ?? "")) setNoteField(slug, f.key, e.target.value);
                              }}
                              className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            />
                          </div>
                        ))}
                        <div className="flex items-center justify-between gap-3 sm:col-span-2">
                          <p className="text-[10px] text-muted">Notizen bleiben in diesem Browser, landen im PDF und gehen nicht mit in geteilte Links.</p>
                          <button type="button" onClick={() => setOpenNote(null)} className={btnGhost}>Fertig</button>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
              {dropAtEnd && <li aria-hidden="true" className="h-0.5 rounded bg-primary" />}
            </ol>
          )}
          {!readOnly && !filter && playerCount > 0 && (
            <p className="no-print mt-3 text-[11px] leading-relaxed text-muted">
              Tipp: Am Griff <span aria-hidden="true">⠿</span> ziehen, Pfeile nutzen oder einfach einen neuen Rang
              in das Zahlenfeld tippen. ▲/▼ zeigt, wie weit du über oder unter dem Consensus liegst.
            </p>
          )}
        </div>

        {/* Spielerpool */}
        {!readOnly && (
          <aside
            id="pool"
            aria-label="Spieler hinzufügen"
            className={cn("no-print min-w-0 lg:block", poolOpen ? "block" : "hidden")}
          >
            <div className="rounded-2xl border border-border bg-surface p-3 lg:sticky lg:top-20 lg:flex lg:max-h-[calc(100vh-6rem)] lg:flex-col">
              <h2 className="mb-2 px-1 font-display text-lg font-semibold uppercase tracking-tight">
                Spieler hinzufügen
              </h2>
              <label htmlFor="pool-suche" className="sr-only">Spieler suchen</label>
              <input
                id="pool-suche"
                type="search"
                value={poolQuery}
                onChange={(e) => setPoolQuery(e.target.value)}
                placeholder="Name oder College …"
                autoComplete="off"
                className="mb-2 w-full rounded-full border border-border bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Pool nach Position filtern">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    aria-pressed={poolPos === pos}
                    onClick={() => setPoolPos(poolPos === pos ? null : pos)}
                    className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", poolPos === pos ? "bg-primary text-background" : "bg-surface-light text-muted hover:text-primary")}
                  >
                    {pos}
                  </button>
                ))}
              </div>
              <p className="mb-1 px-1 text-[11px] text-muted" role="status" aria-live="polite">
                {pool.length === 0
                  ? playerCount === RANKED.length
                    ? "Alle Prospects sind auf deinem Board."
                    : "Keine Treffer."
                  : `${pool.length} verfügbar · nach Consensus`}
              </p>
              <ul className="max-h-[60vh] overflow-y-auto lg:max-h-none lg:flex-1">
                {pool.slice(0, 80).map((p) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => addPlayer(p.slug)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-surface-light"
                      aria-label={`${p.name} (${p.position}, ${p.college}) ans Ende des Boards setzen`}
                    >
                      <span className="w-8 flex-shrink-0 font-mono text-[11px] text-muted">#{p.ranking_overall}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-foreground">{p.name}</span>
                        <span className="block truncate text-[10px] text-muted">{p.position} · {p.college}</span>
                      </span>
                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-border text-primary">{Icon.plus}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {pool.length > 80 && (
                <p className="mt-1 px-1 text-[10px] text-muted">Weitere {pool.length - 80} über Suche oder Positionsfilter.</p>
              )}
            </div>
          </aside>
        )}
      </div>

      {toast && (
        <div role="status" className="no-print fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-full bg-foreground px-5 py-3 text-center text-sm font-bold text-background shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}

// ---- Notiz-Helfer ---------------------------------------------------------

const NOTE_FIELD_META: { key: "plus" | "minus" | "text"; label: string; color: string; placeholder: string }[] = [
  { key: "plus", label: "Stärken", color: "text-accent", placeholder: "z. B. Explosiver erster Schritt, lange Arme" },
  { key: "minus", label: "Schwächen", color: "text-red-700", placeholder: "z. B. Run-Defense, hohe Pad-Level" },
  { key: "text", label: "Notiz / Team-Fit", color: "text-muted", placeholder: "z. B. Perfekter Fit für die Bears an Pick 9" },
];

function noteSummary(n: PlayerNote): string {
  const parts: string[] = [];
  if (n.round) parts.push(n.round === "UDFA" ? "UDFA" : `Runde ${n.round}`);
  if (n.plus) parts.push(`+ ${n.plus}`);
  if (n.minus) parts.push(`− ${n.minus}`);
  if (n.text) parts.push(n.text);
  return parts.join("  ·  ").replace(/\s+/g, " ");
}
