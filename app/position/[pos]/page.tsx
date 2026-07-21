import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPlayersByPosition, getBoardMeta } from "@/lib/player-service";
import { getAllPositionKeys, getPositionInfo } from "@/lib/positions";
import { getPlayerSlug } from "@/lib/player-service";
import { absoluteUrl } from "@/lib/site";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return getAllPositionKeys().map((pos) => ({ pos: pos.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pos: string }>;
}): Promise<Metadata> {
  const { pos } = await params;
  const info = getPositionInfo(pos);
  const meta = getBoardMeta();
  if (!info) return { title: "Position nicht gefunden" };
  const title = `Die besten ${info.label} im NFL Draft ${meta.draftYear}`;
  return {
    title,
    description: `${info.label} im NFL Draft ${meta.draftYear}: Ranking der Top-Prospects mit deutschem Scouting-Profil. ${info.intro}`,
    alternates: { canonical: `/position/${pos.toLowerCase()}` },
    openGraph: {
      type: "article",
      title,
      description: info.intro,
      url: absoluteUrl(`/position/${pos.toLowerCase()}`),
    },
  };
}

export default async function PositionPage({
  params,
}: {
  params: Promise<{ pos: string }>;
}) {
  const { pos } = await params;
  const info = getPositionInfo(pos);
  const meta = getBoardMeta();
  if (!info) notFound();

  const key = pos.toUpperCase();
  const players = getPlayersByPosition(key);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: `Beste ${info.label} – NFL Draft ${meta.draftYear}`,
        itemListElement: players.slice(0, 20).map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${p.name} (${p.college})`,
          url: absoluteUrl(`/player/${getPlayerSlug(p.name)}`),
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: info.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-3">
          <Link
            href="/positionen"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Positionen
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            {key}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Die besten {info.label} <br className="hidden sm:block" />
            <span className="text-primary">NFL Draft {meta.draftYear}</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
            {info.longtext}
          </p>
        </div>

        {/* Ranking */}
        <Reveal>
          <div className="flex flex-col gap-2">
            {players.map((p) => (
              <Link
                key={p.name}
                href={`/player/${getPlayerSlug(p.name)}`}
                className="group grid grid-cols-[40px_44px_1fr_auto] items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition-all hover:border-primary/40 hover:bg-surface-light sm:px-4"
              >
                <span className="font-mono text-lg font-black text-primary sm:text-xl">
                  {p.ranking_pos}
                </span>
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-surface-light">
                  <PlayerAvatar name={p.name} size="sm" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    {p.name}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {p.college}
                    {p.projection ? ` · ${p.projection}` : ""}
                  </p>
                </div>
                {p.ranking_overall != null && (
                  <span className="font-mono text-[11px] text-muted">
                    OVR #{p.ranking_overall}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </Reveal>

        <div className="my-10">
          <AdSense slot="6888694163" layout="in-article" />
        </div>

        {/* FAQ */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">
            Häufige Fragen zu {info.label}
          </h2>
          <div className="flex flex-col gap-2">
            {info.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border bg-surface px-4 py-3"
              >
                <summary className="cursor-pointer list-none text-sm font-bold text-foreground marker:hidden group-open:text-primary">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/"
            className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
          >
            Zum Gesamt-Board
          </Link>
          {info.lexikon && (
            <Link
              href={`/lexikon/${info.lexikon}`}
              className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
            >
              Begriff im Lexikon
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
