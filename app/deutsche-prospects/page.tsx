import Link from "next/link";
import {
  getGermanProspects,
  getGermanNextGen,
  getPlayerSlug,
  getBoardMeta,
} from "@/lib/player-service";
import { absoluteUrl } from "@/lib/site";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";

export const metadata = {
  title: "Deutsche NFL-Draft-Prospects 2027 (College, D1)",
  description:
    "Deutsche Talente im College Football (NCAA Division 1) mit Kurs auf den NFL Draft 2027: Hero Kanu (Texas), Bruno Dall (UCF), Issa Ouattara (Vanderbilt), Alexander Honig (Northwestern), Daniel Evert (Temple), Max Stege (Boise State), Justin Okoronkwo (South Carolina), Linus Zunk (Washington State), Duncan Brune (Ohio), Noel Portnjagin (James Madison) – mit deutschem Scouting-Profil, Herkunft und Draft-Aussicht.",
  alternates: { canonical: "/deutsche-prospects" },
  openGraph: {
    type: "article",
    title: "Deutsche NFL-Draft-Prospects 2027",
    description:
      "Deutsche D1-College-Football-Spieler mit Kurs auf den NFL Draft 2027 – Scouting-Profile, Herkunft, Draft-Aussicht.",
    url: absoluteUrl("/deutsche-prospects"),
  },
};

export default function DeutscheProspectsPage() {
  const prospects = getGermanProspects();
  const nextGen = getGermanNextGen();
  const meta = getBoardMeta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Deutsche NFL-Draft-Prospects ${meta.draftYear}`,
    itemListElement: prospects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.name} (${p.position}, ${p.college})`,
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
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30" aria-hidden="true">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Deutsche Prospects
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { name: "Draft Board", href: "/" },
            { name: "Deutsche Prospects" },
          ]}
        />

        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Deutsche <span className="text-primary">Prospects</span> 2027
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            So viele deutsche Spieler wie nie stehen in den Rostern der NCAA
            Division 1. Diese Kategorie bündelt die deutschen Talente mit dem
            realistischsten Kurs auf den NFL Draft {meta.draftYear} – mit
            Herkunft, Position, College und individuellem deutschen
            Scouting-Profil. Sie stehen als eigener Tier am Ende unseres Big
            Boards und sind hier zusätzlich gebündelt – von den großen
            US-Consensus-Rankings werden die meisten (noch) nicht geführt. Es
            gilt derselbe Qualitätsstandard wie im übrigen Board: aufgenommen
            wird nur, wer mit mindestens zwei unabhängigen Quellen belegt ist.
            Dieser Block führt die für {meta.draftYear} draft-berechtigten
            Spieler. Darunter steht mit der Nächsten Generation ein eigener
            Bereich für deutsche D1-Talente, die erst ab {meta.draftYear + 1} in
            Frage kommen – sie laufen bewusst außerhalb von Big Board und
            Positionsrankings, damit niemand sie für diesen Jahrgang hält.
          </p>
        </div>

        <Reveal className="grid gap-4 sm:grid-cols-2">
          {prospects.map((p) => (
            <Link
              key={getPlayerSlug(p.name)}
              href={`/player/${getPlayerSlug(p.name)}`}
              className="card-lift group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary/50"
            >
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                  <PlayerAvatar name={p.name} size="sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-bold text-foreground group-hover:text-primary">
                    {p.name}
                  </h2>
                  <p className="truncate text-[11px] uppercase tracking-wider text-muted">
                    {p.position} · {p.college}
                  </p>
                </div>
                <span className="flex-shrink-0 rounded bg-surface-light px-2 py-1 text-xs font-bold uppercase text-primary">
                  {p.position}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                {p.herkunft && (
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-muted">
                    <span aria-hidden="true">🇩🇪</span> {p.herkunft}
                  </span>
                )}
                {p.projection && (
                  <span className="rounded-full border border-primary/30 bg-primary-glow px-2.5 py-1 text-primary">
                    {p.projection}
                  </span>
                )}
              </div>

              {p.scouting_report_de && (
                <p className="line-clamp-3 text-xs leading-relaxed text-foreground/75">
                  {p.scouting_report_de}
                </p>
              )}
            </Link>
          ))}
        </Reveal>

        {nextGen.length > 0 && (
          <section className="mt-16">
            <div className="mb-6 border-t border-border pt-10">
              <h2 className="mb-3 font-display text-2xl font-semibold uppercase tracking-tight text-foreground lg:text-3xl">
                Nächste <span className="text-primary">Generation</span>
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-muted">
                Deutsche Spieler auf D1-Rostern, die für den Draft{" "}
                {meta.draftYear} noch nicht berechtigt sind – frühestens{" "}
                {meta.draftYear + 1}. Für den Standort ist dieser Block der
                eigentlich interessante: Hier stehen die höchstbewerteten
                deutschen Recruits, die es je an US-Colleges gab. Sie sind kein
                Teil des {meta.draftYear}er-Boards und tauchen deshalb weder in
                den Positionsrankings noch im Big Board auf.
              </p>
            </div>

            <Reveal className="grid gap-4 sm:grid-cols-2">
              {nextGen.map((p) => (
                <Link
                  key={getPlayerSlug(p.name)}
                  href={`/player/${getPlayerSlug(p.name)}`}
                  className="card-lift group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                      <PlayerAvatar name={p.name} size="sm" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-foreground group-hover:text-primary">
                        {p.name}
                      </h3>
                      <p className="truncate text-[11px] uppercase tracking-wider text-muted">
                        {p.position} · {p.college}
                      </p>
                    </div>
                    <span className="flex-shrink-0 rounded bg-surface-light px-2 py-1 text-xs font-bold uppercase text-primary">
                      {p.position}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                    {p.herkunft && (
                      <span className="rounded-full border border-border bg-background px-2.5 py-1 text-muted">
                        <span aria-hidden="true">🇩🇪</span> {p.herkunft}
                      </span>
                    )}
                    <span className="rounded-full border border-border bg-background px-2.5 py-1 text-muted">
                      Draft {meta.draftYear + 1}+
                    </span>
                    {p.class_year && (
                      <span className="rounded-full border border-primary/30 bg-primary-glow px-2.5 py-1 text-primary">
                        {p.class_year}
                      </span>
                    )}
                  </div>

                  {p.scouting_report_de && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-foreground/75">
                      {p.scouting_report_de}
                    </p>
                  )}
                </Link>
              ))}
            </Reveal>
          </section>
        )}

        <AdSense slot="6888694163" layout="in-article" className="mt-12" />

        <p className="mt-10 text-[10px] text-muted">
          Herkunftsangaben und Draft-Aussichten basieren auf öffentlichen
          College- und Scouting-Quellen (Stand: {meta.updated}). Die Kategorie
          wächst mit – belegte deutsche D1-Prospects werden laufend ergänzt.
        </p>
      </div>
    </main>
  );
}
