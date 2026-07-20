import Link from "next/link";
import { getMockDraft, getBoardMeta, getPlayerSlug } from "@/lib/player-service";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Mock Draft 2027 – Runde 1",
  description:
    "NFL Mock Draft 2027: komplette Runde 1 mit projizierter Draft-Reihenfolge, Team-Needs und deutscher Begründung zu jedem Pick.",
  alternates: { canonical: "/mock-draft" },
  openGraph: {
    type: "article",
    title: "NFL Mock Draft 2027 – Runde 1",
    description:
      "Alle 32 Erstrunden-Picks des NFL Draft 2027 mit deutscher Begründung.",
    url: "/mock-draft",
  },
};

export default function MockDraftPage() {
  const picks = getMockDraft();
  const meta = getBoardMeta();

  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Mock Draft {meta.draftYear}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-black uppercase tracking-tight text-foreground lg:text-4xl">
            Mock Draft <span className="text-primary">{meta.draftYear}</span>
          </h1>
          <p className="text-sm text-muted">
            Runde 1 · Projizierte Draft-Reihenfolge (Stand vor der Saison 2026)
            · Stand: {meta.updated} · {meta.updateCycle}
          </p>
        </div>

        <Reveal>
        <div className="flex flex-col gap-2">
          {picks.map((pick) => (
            <Link
              key={pick.pick}
              href={`/player/${getPlayerSlug(pick.player)}`}
              className="group grid grid-cols-[52px_44px_1fr] items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 transition-all hover:border-primary/40 hover:bg-surface-light sm:grid-cols-[52px_44px_1fr_220px]"
            >
              {/* Pick number */}
              <span className="font-mono text-2xl font-black text-primary text-glow-primary">
                {pick.pick}
              </span>

              {/* Player Image */}
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-light">
                <PlayerAvatar name={pick.player} size="sm" />
              </div>

              {/* Team + Player */}
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  {pick.team}
                </p>
                <p className="truncate text-sm font-black uppercase tracking-wide text-foreground group-hover:text-primary">
                  {pick.player}
                  <span className="ml-2 text-xs font-bold text-primary">
                    {pick.position}
                  </span>
                  <span className="ml-2 text-xs font-medium normal-case text-muted">
                    {pick.college}
                  </span>
                </p>
              </div>

              {/* Reason */}
              <p className="hidden text-[11px] leading-snug text-muted sm:block">
                {pick.reason_de}
              </p>
            </Link>
          ))}
        </div>
        </Reveal>

        {/* Anzeige */}
        <div className="mt-10">
          <AdSense slot="6888694163" layout="in-article" />
        </div>

        {/* Sources */}
        <div className="mt-10 rounded border border-border bg-surface p-5">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
            Quellen
          </h2>
          <ul className="flex flex-col gap-1">
            {meta.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted underline-offset-2 transition-colors hover:text-primary hover:underline"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] text-muted/60">
            Spielerdarstellung: {meta.imageSource.name}
          </p>
        </div>
      </div>
    </main>
  );
}
