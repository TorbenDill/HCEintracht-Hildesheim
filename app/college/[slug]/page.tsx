import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getColleges, getCollegeBySlug } from "@/lib/colleges";
import { getBoardMeta, getPlayerSlug } from "@/lib/player-service";
import { absoluteUrl } from "@/lib/site";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return getColleges().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const college = getCollegeBySlug(slug);
  const meta = getBoardMeta();
  if (!college) return { title: "College nicht gefunden" };
  const title = `${college.name}: NFL Draft ${meta.draftYear} Prospects`;
  return {
    title,
    description: `Alle NFL-Draft-${meta.draftYear}-Prospects der ${college.name} in unserem Big Board: ${college.players
      .slice(0, 4)
      .map((p) => p.name)
      .join(", ")} und mehr, mit deutschem Scouting-Profil.`,
    alternates: { canonical: `/college/${slug}` },
    openGraph: {
      type: "article",
      title,
      url: absoluteUrl(`/college/${slug}`),
    },
  };
}

export default async function CollegePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const college = getCollegeBySlug(slug);
  const meta = getBoardMeta();
  if (!college) notFound();

  const players = college.players;
  const positions = Array.from(new Set(players.map((p) => p.position)));
  const top = players[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${college.name} – NFL Draft ${meta.draftYear} Prospects`,
    itemListElement: players.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.name} (${p.position})`,
      url: absoluteUrl(`/player/${getPlayerSlug(p.name)}`),
    })),
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
            href="/colleges"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Colleges
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            {meta.draftYear}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-8">
          <h1 className="mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {college.name}
            <br className="hidden sm:block" />{" "}
            <span className="text-primary">
              NFL Draft {meta.draftYear}
            </span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
            Die {college.name} stellt für den NFL Draft {meta.draftYear} aktuell{" "}
            {players.length} Prospects in unserem Big Board, angeführt von{" "}
            {top.name} ({top.position}
            {top.ranking_overall != null
              ? `, Consensus #${top.ranking_overall}`
              : ""}
            ). Vertreten sind die Positionen {positions.join(", ")}. Jedes Profil
            enthält einen deutschen Scouting-Report samt Best- und
            Worst-Case-Vergleich.
          </p>
        </div>

        <Reveal>
          <div className="flex flex-col gap-2">
            {players.map((p) => (
              <Link
                key={p.name}
                href={`/player/${getPlayerSlug(p.name)}`}
                className="group grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 transition-all hover:border-primary/40 hover:bg-surface-light sm:px-4"
              >
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-border bg-surface-light">
                  <PlayerAvatar name={p.name} size="sm" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
                    {p.name}
                  </p>
                  <p className="truncate text-[11px] text-muted">
                    {p.position}
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

        <div className="flex flex-wrap gap-3 text-xs">
          <Link
            href="/colleges"
            className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
          >
            Alle Colleges
          </Link>
          <Link
            href="/positionen"
            className="rounded-full border border-border bg-surface px-4 py-2 font-bold text-muted hover:border-primary hover:text-primary"
          >
            Positionsrankings
          </Link>
        </div>
      </div>
    </main>
  );
}
