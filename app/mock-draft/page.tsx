import Link from "next/link";
import { getMockDraft, getBoardMeta, getPlayerSlug } from "@/lib/player-service";
import { getStandingsMeta, teamSlug } from "@/lib/teams";
import { absoluteUrl } from "@/lib/site";
import PlayerAvatar from "@/components/PlayerAvatar";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Mock Draft 2027 – Runde 1 mit aktueller Draft-Reihenfolge",
  description:
    "NFL Mock Draft 2027: alle 32 Erstrunden-Picks nach aktuellem NFL-Tabellenstand, inklusive getauschter Picks, Consensus-Anteil und deutscher Begründung zu jedem Pick.",
  alternates: { canonical: "/mock-draft" },
  openGraph: {
    type: "article",
    title: "NFL Mock Draft 2027 – Runde 1",
    description:
      "Alle 32 Erstrunden-Picks des NFL Draft 2027 nach aktuellem Tabellenstand, mit deutscher Begründung.",
    url: "/mock-draft",
  },
};

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export default function MockDraftPage() {
  const picks = getMockDraft();
  const meta = getBoardMeta();
  const standings = getStandingsMeta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `NFL Mock Draft ${meta.draftYear} – Runde 1`,
    dateModified: standings.stand,
    itemListElement: picks.map((p) => ({
      "@type": "ListItem",
      position: p.pick,
      name: `Pick ${p.pick}: ${p.team} – ${p.player} (${p.position}, ${p.college})`,
      url: absoluteUrl(`/player/${getPlayerSlug(p.player)}`),
    })),
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs
          className="mb-6"
          items={[{ name: "Draft Board", href: "/" }, { name: "Mock Draft" }]}
        />
        <div className="mb-8">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Mock Draft <span className="text-primary">{meta.draftYear}</span>
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-foreground/85">
            Runde 1 nach dem aktuellen NFL-Tabellenstand (nach Woche {standings.week}),
            inklusive aller getauschten Picks – die Jets halten derzeit gleich drei
            Erstrundenpicks, die Colts, Rams und Packers keinen. Pro Pick steht der
            Spieler, den die meisten Mock Drafts der letzten Woche an genau dieser
            Stelle sehen (Consensus der NFL Mock Draft Database); der Prozentwert
            zeigt, wie einig sich die Mocks sind. Ist die meistgenannte Wahl schon
            vergeben, setzen wir den bestplatzierten verfügbaren Spieler unseres
            Boards auf einer Bedarfsposition des Teams.
          </p>
          <p className="mt-3 text-xs text-muted">
            Stand {germanDate(standings.stand)} · Draft-Reihenfolge: Tankathon ·
            Picks: NFL Mock Draft Database
          </p>
        </div>

        <Reveal>
          <ol className="flex flex-col gap-3">
            {picks.map((pick) => (
              <li key={pick.pick}>
                <PickRow pick={pick} />
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Quellen */}
        <div className="mt-10 rounded border border-border bg-surface p-5">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
            Quellen
          </h2>
          <ul className="flex flex-col gap-1 text-xs">
            <li>
              <a
                href="https://www.nflmockdraftdatabase.com/mock-drafts/2027/consensus-mock-draft-2027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-2 hover:text-primary hover:underline"
              >
                NFL Mock Draft Database – Consensus Mock Draft 2027
              </a>
            </li>
            <li>
              <a
                href="https://www.tankathon.com/nfl/full-draft"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-2 hover:text-primary hover:underline"
              >
                Tankathon – NFL Draft Order 2027
              </a>
            </li>
            <li>
              <a
                href="https://cfbstats.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted underline-offset-2 hover:text-primary hover:underline"
              >
                cfbstats.com – Saisonstatistiken 2026
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

type Pick = ReturnType<typeof getMockDraft>[number];

function PickRow({ pick }: { pick: Pick }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40">
      <div className="grid grid-cols-[44px_40px_1fr] items-center gap-3 sm:grid-cols-[52px_44px_1fr_auto]">
        <span className="font-mono text-2xl font-black text-primary">{pick.pick}</span>
        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-surface-light">
          <PlayerAvatar name={pick.player} size="sm" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
            <Link href={`/team/${teamSlug(pick.teamAbbr)}`} className="hover:text-primary">
              {pick.team}
            </Link>
            {pick.viaTeam && <span className="normal-case tracking-normal"> · via {pick.viaTeam}</span>}
          </p>
          <Link
            href={`/player/${getPlayerSlug(pick.player)}`}
            className="block truncate text-sm font-black uppercase tracking-wide text-foreground hover:text-primary sm:text-base"
          >
            {pick.player}
            <span className="ml-2 text-xs font-bold text-primary">{pick.position}</span>
            <span className="ml-2 text-xs font-medium normal-case text-muted">{pick.college}</span>
          </Link>
        </div>
        {pick.consensus_pct != null ? (
          <span
            className="col-span-3 justify-self-start rounded-full border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-muted sm:col-span-1 sm:justify-self-end"
            title="Anteil der Mock Drafts der letzten Woche mit genau diesem Spieler an diesem Pick"
          >
            {pick.consensus_pct} % der Mocks
          </span>
        ) : (
          <span className="col-span-3 justify-self-start rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:text-amber-400 sm:col-span-1 sm:justify-self-end">
            Board-Pick
          </span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{pick.reason_de}</p>
    </div>
  );
}
