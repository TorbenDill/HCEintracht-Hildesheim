"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getPlayers, type Player } from "@/lib/player-service";
import {
  getDraftTeams,
  cpuPick,
  positionColor,
  type DraftTeam,
} from "@/lib/simulator";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

type Mode = "team" | "gm";

const ALL_POS = [
  "ALL",
  "QB",
  "RB",
  "WR",
  "TE",
  "OT",
  "IOL",
  "EDGE",
  "DT",
  "LB",
  "CB",
  "S",
];

const SPEED_OPTIONS: { label: string; ms: number }[] = [
  { label: "Langsam", ms: 1500 },
  { label: "Normal", ms: 600 },
  { label: "Schnell", ms: 200 },
  { label: "Sofort", ms: 0 },
];

const CLOCK_OPTIONS: { label: string; s: number }[] = [
  { label: "10:00 (Original)", s: 600 },
  { label: "2:00", s: 120 },
  { label: "1:00", s: 60 },
  { label: "0:30", s: 30 },
  { label: "Aus", s: 0 },
];

function fmtClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MockSimulator() {
  const teams = useMemo(() => getDraftTeams(), []);
  const pool = useMemo(
    () =>
      [...getPlayers()].sort(
        (a, b) =>
          (a.ranking_overall ?? 999) - (b.ranking_overall ?? 999)
      ),
    []
  );

  const [mode, setMode] = useState<Mode | null>(null);
  const [yourTeam, setYourTeam] = useState<number | null>(null);
  const [picks, setPicks] = useState<(Player | null)[]>(
    Array(teams.length).fill(null)
  );
  const [onClock, setOnClock] = useState(0);
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [cpuMs, setCpuMs] = useState(600); // CPU-Tempo (Team-Modus)
  const [clockLen, setClockLen] = useState(120); // Pick-Uhr in Sek. (GM-Modus)
  const [timeLeft, setTimeLeft] = useState(120);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const pickedNames = useMemo(
    () => new Set(picks.filter(Boolean).map((p) => (p as Player).name)),
    [picks]
  );
  const available = useMemo(
    () => pool.filter((p) => !pickedNames.has(p.name)),
    [pool, pickedNames]
  );

  const finished = onClock >= teams.length;
  const isUserPick =
    !finished && (mode === "gm" || (mode === "team" && onClock === yourTeam));

  const makePick = useCallback(
    (player: Player) => {
      setPicks((prev) => {
        const next = [...prev];
        next[onClock] = player;
        return next;
      });
      setOnClock((c) => c + 1);
    },
    [onClock]
  );

  // CPU rückt automatisch vor, wenn im Team-Modus ein fremdes Team dran ist.
  useEffect(() => {
    if (finished || mode !== "team" || yourTeam === null || onClock === yourTeam)
      return;
    const team = teams[onClock];
    const t = setTimeout(() => {
      const choice = cpuPick(team.needs, available);
      if (choice) makePick(choice);
    }, cpuMs);
    return () => clearTimeout(t);
  }, [finished, mode, onClock, yourTeam, teams, available, makePick, cpuMs]);

  // Pick-Uhr (GM-Modus): bei jedem neuen Pick zurücksetzen.
  useEffect(() => {
    setTimeLeft(clockLen);
  }, [onClock, clockLen]);

  // Countdown herunterzählen, solange der Nutzer am Zug ist.
  useEffect(() => {
    if (finished || mode !== "gm" || clockLen === 0) return;
    if (timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [finished, mode, clockLen, timeLeft]);

  // Zeit abgelaufen -> automatisch den besten verfügbaren Spieler picken.
  useEffect(() => {
    if (finished || mode !== "gm" || clockLen === 0 || timeLeft > 0) return;
    if (available.length > 0) makePick(available[0]);
  }, [finished, mode, clockLen, timeLeft, available, makePick]);

  function reset(toMode: Mode | null) {
    setMode(toMode);
    setYourTeam(null);
    setPicks(Array(teams.length).fill(null));
    setOnClock(0);
    setFilter("ALL");
    setQuery("");
    setTimeLeft(clockLen);
  }

  const visibleAvailable = available.filter((p) => {
    const okPos = filter === "ALL" || p.position === filter;
    const q = query.trim().toLowerCase();
    const okQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.college.toLowerCase().includes(q);
    return okPos && okQ;
  });

  // ---------- PNG EXPORT ----------
  const drawAndDownload = useCallback(
    (ratio: "4:5" | "9:16") => {
      const W = 1080;
      const H = ratio === "4:5" ? 1350 : 1920;
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Hintergrund
      ctx.fillStyle = "#0b0d10";
      ctx.fillRect(0, 0, W, H);
      const grad = ctx.createRadialGradient(120, 60, 40, 120, 60, 900);
      grad.addColorStop(0, "rgba(238,112,20,0.14)");
      grad.addColorStop(1, "rgba(11,13,16,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const pad = 64;
      // Header
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#ee7014";
      ctx.font = "700 26px Archivo, sans-serif";
      ctx.fillText("NFL MOCK DRAFT", pad, 92);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "900 88px Archivo, sans-serif";
      ctx.fillText("2027", pad, 176);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "600 24px Archivo, sans-serif";
      const subtitle =
        mode === "team" && yourTeam != null
          ? `${teams[yourTeam].team} · GM-Edition`
          : "Runde 1 · GM-Modus";
      ctx.fillText(subtitle, pad, 214);

      // Rows
      const headerH = 250;
      const footerH = 70;
      const n = teams.length;
      const rowH = (H - headerH - footerH) / n;
      const showCollege = rowH >= 40;

      for (let i = 0; i < n; i++) {
        const p = picks[i];
        const y = headerH + i * rowH;
        const mine = mode === "team" && i === yourTeam;

        if (mine) {
          ctx.fillStyle = "rgba(238,112,20,0.10)";
          ctx.fillRect(pad - 16, y, W - 2 * (pad - 16), rowH - 4);
          ctx.fillStyle = "#ee7014";
          ctx.fillRect(pad - 16, y, 5, rowH - 4);
        }

        const midY = y + rowH / 2;
        // Pick number
        ctx.fillStyle = "#475569";
        ctx.font = "800 22px Archivo, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(String(i + 1).padStart(2, "0"), pad - 4, midY);

        // Team abbr
        ctx.fillStyle = "#64748b";
        ctx.font = "800 20px Archivo, sans-serif";
        ctx.fillText(teams[i].teamAbbr, pad + 52, midY);

        if (p) {
          // Position dot
          ctx.fillStyle = positionColor(p.position);
          ctx.beginPath();
          ctx.arc(pad + 140, midY, 6, 0, Math.PI * 2);
          ctx.fill();
          // Name
          ctx.fillStyle = "#f8fafc";
          ctx.font = `800 ${rowH >= 44 ? 28 : 22}px Archivo, sans-serif`;
          ctx.fillText(p.name, pad + 158, midY);
          // Pos · College (rechts)
          ctx.fillStyle = "#94a3b8";
          ctx.font = "600 20px Archivo, sans-serif";
          ctx.textAlign = "right";
          const right = showCollege ? `${p.position} · ${p.college}` : p.position;
          ctx.fillText(right, W - pad, midY);
          ctx.textAlign = "left";
        } else {
          ctx.fillStyle = "#334155";
          ctx.font = "600 22px Archivo, sans-serif";
          ctx.fillText("-", pad + 158, midY);
        }
        ctx.textBaseline = "alphabetic";
      }

      // Footer
      ctx.fillStyle = "#64748b";
      ctx.font = "600 22px Archivo, sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(
        SITE_URL.replace(/^https?:\/\//, ""),
        pad,
        H - footerH / 2
      );
      ctx.textAlign = "right";
      ctx.fillStyle = "#ee7014";
      ctx.fillText("Forstner Scouting", W - pad, H - footerH / 2);
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mock-draft-2027-${ratio.replace(":", "x")}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    },
    [picks, teams, mode, yourTeam]
  );

  // ---------- RENDER ----------
  if (mode === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={() => reset("team")}
          className="card-lift group rounded-xl border border-border bg-surface p-8 text-left hover:border-primary/50"
        >
          <h3 className="mb-2 text-xl font-black uppercase tracking-tight text-foreground group-hover:text-primary">
            Ein Team draften
          </h3>
          <p className="text-sm text-muted">
            Wähle dein Team – die CPU übernimmt alle anderen 31 Picks. Du bist
            nur an deiner Position am Zug.
          </p>
        </button>
        <button
          onClick={() => reset("gm")}
          className="card-lift group rounded-xl border border-border bg-surface p-8 text-left hover:border-primary/50"
        >
          <h3 className="mb-2 text-xl font-black uppercase tracking-tight text-foreground group-hover:text-primary">
            GM-Modus · Alle 32 Picks
          </h3>
          <p className="text-sm text-muted">
            Du entscheidest jeden einzelnen Pick der ersten Runde und lädst dein
            Ergebnis als Social-Media-Bild (4:5 & 9:16) herunter.
          </p>
        </button>
      </div>
    );
  }

  if (mode === "team" && yourTeam === null) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary">
            Wähle dein Team
          </h3>
          <button
            onClick={() => reset(null)}
            className="text-xs uppercase tracking-wider text-muted hover:text-primary"
          >
            ← Zurück
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {teams.map((t, i) => (
            <button
              key={t.teamAbbr}
              onClick={() => setYourTeam(i)}
              className="card-lift rounded border border-border bg-surface px-3 py-3 text-left hover:border-primary/50"
            >
              <p className="text-[10px] font-mono text-muted">Pick {t.pick}</p>
              <p className="text-sm font-bold text-foreground">{t.team}</p>
              <p className="mt-1 truncate text-[10px] text-muted">
                Bedarf: {t.needs.join(", ")}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Statusleiste */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            {mode === "team"
              ? `Deine Franchise: ${teams[yourTeam!].team}`
              : "GM-Modus – alle Picks"}
          </p>
          {!finished ? (
            <p className="text-lg font-black uppercase tracking-tight text-foreground">
              Pick {onClock + 1} ·{" "}
              <span className="text-primary">{teams[onClock].team}</span>
              {isUserPick ? (
                <span className="ml-2 rounded bg-primary px-2 py-0.5 text-[10px] text-background">
                  DU BIST DRAN
                </span>
              ) : (
                <span className="ml-2 animate-pulse text-xs text-muted">
                  CPU wählt…
                </span>
              )}
            </p>
          ) : (
            <p className="text-lg font-black uppercase tracking-tight text-accent text-glow-accent">
              Draft komplett
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* GM-Modus: Pick-Uhr */}
          {mode === "gm" && !finished && clockLen > 0 && (
            <div
              className={cn(
                "rounded border px-4 py-2 text-center font-mono",
                timeLeft <= 10
                  ? "animate-pulse border-red-500 bg-red-500/15 text-red-400"
                  : timeLeft <= 30
                    ? "border-accent/50 bg-accent-glow text-accent"
                    : "border-border bg-surface text-foreground"
              )}
            >
              <span className="block text-[9px] uppercase tracking-widest text-muted">
                On the Clock
              </span>
              <span className="text-2xl font-black tabular-nums">
                {fmtClock(timeLeft)}
              </span>
            </div>
          )}
          <button
            onClick={() => reset(mode)}
            className="rounded-full border border-border bg-surface px-5 py-2 text-xs font-bold uppercase tracking-wider text-muted hover:border-primary hover:text-primary"
          >
            Neu starten
          </button>
        </div>
      </div>

      {/* Einstellungen: CPU-Tempo (Team) / Pick-Uhr (GM) */}
      {!finished && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded border border-border bg-surface/60 px-4 py-2.5">
          {mode === "team" ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                CPU-Tempo:
              </span>
              {SPEED_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  onClick={() => setCpuMs(o.ms)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    cpuMs === o.ms
                      ? "bg-primary text-background"
                      : "border border-border bg-surface text-muted hover:text-primary"
                  )}
                >
                  {o.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                Pick-Uhr:
              </span>
              {CLOCK_OPTIONS.map((o) => (
                <button
                  key={o.label}
                  onClick={() => {
                    setClockLen(o.s);
                    setTimeLeft(o.s);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                    clockLen === o.s
                      ? "bg-primary text-background"
                      : "border border-border bg-surface text-muted hover:text-primary"
                  )}
                >
                  {o.label}
                </button>
              ))}
              <span className="ml-1 text-[10px] text-muted/70">
                Läuft die Uhr ab, pickt automatisch der beste verfügbare Spieler.
              </span>
            </>
          )}
        </div>
      )}

      {/* Download-Leiste bei Fertigstellung */}
      {finished && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary-glow p-5">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
            Als Social-Media-Bild herunterladen
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => drawAndDownload("4:5")}
              className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-background glow-primary hover:brightness-110"
            >
              PNG 4:5 (Feed)
            </button>
            <button
              onClick={() => drawAndDownload("9:16")}
              className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-background glow-primary hover:brightness-110"
            >
              PNG 9:16 (Story)
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Draft-Board */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
            Draft-Board
          </h3>
          <div className="flex max-h-[70vh] flex-col gap-1 overflow-y-auto pr-1">
            {teams.map((t, i) => {
              const p = picks[i];
              const current = i === onClock && !finished;
              const mine = mode === "team" && i === yourTeam;
              return (
                <div
                  key={t.teamAbbr}
                  className={cn(
                    "grid grid-cols-[32px_44px_1fr] items-center gap-2 rounded border px-3 py-2",
                    current
                      ? "border-primary bg-primary-glow"
                      : "border-border bg-surface",
                    mine && "ring-1 ring-primary/40"
                  )}
                >
                  <span className="font-mono text-sm font-black text-muted">
                    {t.pick}
                  </span>
                  <span className="text-xs font-bold text-muted">
                    {t.teamAbbr}
                  </span>
                  {p ? (
                    <span className="flex items-center gap-2 truncate">
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: positionColor(p.position) }}
                      />
                      <span className="truncate text-sm font-bold text-foreground">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-primary">
                        {p.position}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted/50">
                      {current ? "am Zug…" : "-"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Verfügbare Spieler */}
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted">
            Verfügbare Spieler{" "}
            {isUserPick && (
              <span className="text-primary">– klicke zum Picken</span>
            )}
          </h3>
          <input
            type="text"
            placeholder="Spieler / College suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mb-2 w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted/50 outline-none focus:border-primary"
          />
          <div className="mb-3 flex flex-wrap gap-1">
            {ALL_POS.map((pos) => (
              <button
                key={pos}
                onClick={() => setFilter(pos)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                  filter === pos
                    ? "bg-primary text-background"
                    : "border border-border bg-surface text-muted hover:text-primary"
                )}
              >
                {pos}
              </button>
            ))}
          </div>
          <div className="flex max-h-[60vh] flex-col gap-1 overflow-y-auto pr-1">
            {visibleAvailable.map((p) => (
              <button
                key={p.name}
                disabled={!isUserPick}
                onClick={() => isUserPick && makePick(p)}
                className={cn(
                  "grid grid-cols-[36px_1fr_auto] items-center gap-2 rounded border px-3 py-2 text-left transition-all",
                  isUserPick
                    ? "border-border bg-surface hover:border-primary/50 hover:bg-surface-light"
                    : "cursor-default border-border/50 bg-surface/50 opacity-70"
                )}
              >
                <span className="font-mono text-xs font-black text-muted">
                  {p.ranking_overall ?? "–"}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-foreground">
                    {p.name}
                  </span>
                  <span className="block truncate text-[10px] text-muted">
                    {p.college}
                  </span>
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    color: positionColor(p.position),
                    backgroundColor: "rgba(148,163,184,0.12)",
                  }}
                >
                  {p.position}
                </span>
              </button>
            ))}
            {visibleAvailable.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">
                Keine verfügbaren Spieler für diesen Filter.
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        Fertig? Zurück zum{" "}
        <Link href="/" className="text-primary hover:underline">
          Draft Board
        </Link>
        .
      </p>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
