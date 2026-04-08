import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPlayerBySlug,
  getPlayerImage,
  getPlayers,
  getPlayerSlug,
} from "@/lib/player-service";
import { cn } from "@/lib/utils";

const PIKTOGRAMM_ICONS: Record<string, string> = {
  Spielintelligenz: "🧠",
  Armstärke: "💪",
  Selbstvertrauen: "🔥",
  Genauigkeit: "🎯",
  Körperbeherrschung: "🤸",
  Athletik: "⚡",
  "Ball Skills": "🏈",
  Instinkte: "👁️",
  Speed: "💨",
  Geschwindigkeit: "💨",
  Quickness: "⚡",
  "Deep Threat": "🚀",
  Release: "✨",
  "Route Running": "🔀",
  Hände: "🤲",
  IQ: "🧠",
  Physis: "💪",
  Power: "💪",
  Stärke: "💪",
  Härte: "🛡️",
  Größe: "📏",
  "Catch Radius": "📡",
  YAC: "🏃",
  Explosivität: "💥",
  Technik: "⚙️",
  Fußarbeit: "👟",
  Beweglichkeit: "🤸",
  Blocking: "🧱",
  Bending: "🌊",
  Länge: "📏",
  Coverage: "🛡️",
  Tackling: "🤜",
  Leadership: "👑",
  Mobilität: "🏃",
  "Deep Ball": "🚀",
  "Arm Talent": "💪",
  Kreativität: "🎨",
  Vielseitigkeit: "🔄",
  "Pass Rush": "⚡",
  Instinkt: "👁️",
  Reichweite: "📡",
  "Contested Catch": "🏈",
  Motor: "🔥",
  Produktivität: "📈",
  Zuverlässigkeit: "✅",
  Erfahrung: "🎓",
  Agilität: "⚡",
  "Slot-Expertise": "🎯",
  Eleganz: "✨",
  Kontaktbalance: "⚖️",
  Vision: "👁️",
  Ausdauer: "♾️",
  "One-Cut": "✂️",
  Potential: "📈",
  Allround: "🔄",
  Toughness: "🛡️",
  Finesse: "✨",
  Receiving: "🤲",
  Mismatch: "⚠️",
  Masse: "⚓",
  "Short-Yardage": "🎯",
  Leverage: "⚖️",
  Geduld: "⏳",
  "Stride Length": "📏",
  "Run Stopping": "🛑",
  Hebelwirkung: "⚖️",
  "Return Skills": "↩️",
  Nervenstärke: "🧊",
  Präzision: "🎯",
  Beinkraft: "🦵",
  Hangtime: "⏱️",
  Spannweite: "📐",
  Einsatz: "💯",
  Energie: "⚡",
  "Route Matching": "🔀",
  Furchtlosigkeit: "🦁",
  "Pocket Presence": "🧱",
};

export async function generateStaticParams() {
  const players = getPlayers();
  return players.map((p) => ({ slug: getPlayerSlug(p.name) }));
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            {player.position}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ── HEADER SECTION ── */}
        <section className="mb-10 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Player Image */}
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-surface">
            <Image
              src={getPlayerImage(player.name)}
              alt={player.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Rank Overlay */}
            {player.ranking_overall && (
              <div className="absolute left-3 top-3 rounded bg-background/90 px-3 py-1.5 backdrop-blur-sm">
                <span className="font-mono text-2xl font-black text-primary text-glow-primary">
                  #{player.ranking_overall}
                </span>
              </div>
            )}
            {/* Position Badge */}
            <div className="absolute bottom-3 right-3 rounded bg-primary px-3 py-1 text-sm font-black uppercase text-background">
              {player.position}
            </div>
          </div>

          {/* Player Info + Stats */}
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              {player.college}
            </p>
            <h1 className="mb-4 text-4xl font-black uppercase tracking-tight text-foreground lg:text-5xl">
              {player.name}
            </h1>

            {/* Stat Boxes */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatBox label="Größe" value={player.height} />
              <StatBox label="Gewicht" value={player.weight} />
              <StatBox
                label="Pos. Rank"
                value={`#${player.ranking_pos}`}
                accent
              />
            </div>

            {/* Piktogramme */}
            {player.piktogramme.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                  Fähigkeiten
                </h3>
                <div className="flex flex-wrap gap-2">
                  {player.piktogramme.map((p) => (
                    <div
                      key={p}
                      className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-glow px-3 py-1.5"
                    >
                      <span className="text-sm">
                        {PIKTOGRAMM_ICONS[p] ?? "⭐"}
                      </span>
                      <span className="text-xs font-bold text-primary">
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro Comparison */}
            {(player.best_case_nfl || player.worst_case_nfl) && (
              <div>
                <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
                  NFL Comparison
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {player.best_case_nfl && (
                    <div className="rounded border border-accent/30 bg-accent-glow p-4">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-accent">
                        Best Case
                      </p>
                      <p className="text-sm font-black uppercase text-foreground">
                        {player.best_case_nfl}
                      </p>
                    </div>
                  )}
                  {player.worst_case_nfl && (
                    <div className="rounded border border-red-500/30 bg-red-500/10 p-4">
                      <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-red-400">
                        Worst Case
                      </p>
                      <p className="text-sm font-black uppercase text-foreground">
                        {player.worst_case_nfl}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── FORSTNER'S TAKE ── */}
        {player.forstner_statement && (
          <section className="mb-10">
            <div className="rounded-lg border border-primary/30 bg-gradient-to-r from-primary-glow to-surface p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-background">
                  Experte
                </span>
                <span className="text-sm font-bold text-foreground">
                  Philipp Forstner
                </span>
              </div>
              <blockquote className="border-l-2 border-primary pl-4 text-lg italic text-foreground/90">
                &ldquo;{player.forstner_statement}&rdquo;
              </blockquote>
            </div>
          </section>
        )}

        {/* ── SCOUTING REPORT ── */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Scouting Report
          </h2>
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {player.scouting_report_de}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded border p-3",
        accent
          ? "border-primary/40 bg-primary-glow"
          : "border-border bg-surface"
      )}
    >
      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-muted">
        {label}
      </p>
      <p
        className={cn(
          "font-mono text-lg font-black",
          accent ? "text-primary text-glow-primary" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
