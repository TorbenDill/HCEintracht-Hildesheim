import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import lexikon from "@/data/lexikon.json";
import { absoluteUrl } from "@/lib/site";
import { safeJsonLd } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
import { getPlayersByPosition, getPlayerSlug, byOverallRank } from "@/lib/player-service";
import { getPositionInfo } from "@/lib/positions";

type Entry = {
  slug: string;
  term: string;
  category: string;
  kurz: string;
  text: string;
};

const entries = lexikon as Entry[];

// Begriffe mit klarem Positionsbezug: Die Seite zeigt dazu die aktuell
// bestplatzierten Prospects aus dem Board (interne Verlinkung + Aktualitaet).
const POSITIONS_FOR: Record<string, string[]> = {
  "3-technique": ["DT"],
  edge: ["EDGE"],
  "cover-3": ["CB", "S"],
  "nickel-dime": ["CB", "S"],
  rpo: ["QB"],
  "40-yard-dash": ["WR", "CB"],
};

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return { title: "Begriff nicht gefunden" };
  const title = `${entry.term} einfach erklärt`;
  return pageMetadata({
    title,
    description: `${entry.kurz} Einfach erklärt im NFL-Draft-Lexikon auf Deutsch – mit Einordnung, wofür der Begriff im Scouting steht.`,
    path: `/lexikon/${entry.slug}`,
    type: "article",
    kicker: "NFL Draft Lexikon",
  });

}

export default async function LexikonEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  // Erst Begriffe derselben Kategorie, dann auffuellen.
  const others = entries.filter((e) => e.slug !== entry.slug);
  const related = [
    ...others.filter((e) => e.category === entry.category),
    ...others.filter((e) => e.category !== entry.category),
  ].slice(0, 8);

  const positions = POSITIONS_FOR[entry.slug] ?? [];
  const prospects = positions
    .flatMap((pos) => getPlayersByPosition(pos).filter((p) => p.ranking_overall != null))
    .sort(byOverallRank)
    .slice(0, 5);

  const url = absoluteUrl(`/lexikon/${entry.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${url}#begriff`,
        name: entry.term,
        description: entry.kurz,
        url,
        inLanguage: "de-DE",
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "NFL Draft Lexikon",
          url: absoluteUrl("/lexikon"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Draft Board", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Lexikon", item: absoluteUrl("/lexikon") },
          { "@type": "ListItem", position: 3, name: entry.term, item: url },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-4 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
          {entry.term}
        </h1>
        <p className="mb-8 border-l-2 border-primary pl-4 text-base font-medium leading-relaxed text-foreground/90">
          {entry.kurz}
        </p>

        <div className="space-y-5">
          {entry.text.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-foreground/85"
            >
              {para}
            </p>
          ))}
        </div>


        {prospects.length > 0 && (
          <section aria-labelledby="board-bezug" className="my-10 rounded-2xl border border-border bg-surface p-6">
            <h2 id="board-bezug" className="mb-1 text-sm font-black tracking-tight text-foreground">
              {entry.term} im Big Board 2027
            </h2>
            <p className="mb-4 text-xs text-muted">
              Die aktuell bestplatzierten Prospects auf{" "}
              {positions.map((pos) => getPositionInfo(pos)?.label ?? pos).join(" und ")} in unserem Consensus-Board.
            </p>
            <ol className="space-y-2">
              {prospects.map((p) => (
                <li key={p.name} className="flex items-baseline gap-3 text-sm">
                  <span className="w-8 font-mono text-xs font-bold text-primary">#{p.ranking_overall}</span>
                  <Link href={`/player/${getPlayerSlug(p.name)}`} className="font-bold text-foreground hover:text-primary">
                    {p.name}
                  </Link>
                  <span className="text-xs text-muted">{p.position} · {p.college}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs">
              {positions.map((pos, i) => (
                <span key={pos}>
                  {i > 0 && " · "}
                  <Link href={`/position/${pos.toLowerCase()}`} className="font-bold text-primary hover:underline">
                    Komplettes Ranking {getPositionInfo(pos)?.label ?? pos}
                  </Link>
                </span>
              ))}
            </p>
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-sm font-black tracking-tight text-foreground">
            Weitere Begriffe
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/lexikon/${r.slug}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-muted transition-all hover:border-primary hover:text-primary"
              >
                {r.term}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted">
            Begriffe live sehen? Auf dem{" "}
            <Link href="/" className="text-primary underline underline-offset-2">
              Big Board 2027
            </Link>{" "}
            und in den Spielerprofilen werden sie angewendet.
          </p>
        </section>
      </article>
    </main>
  );
}
