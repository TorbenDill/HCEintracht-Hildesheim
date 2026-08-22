import Link from "next/link";
import {
  getEuropeTalents,
  getEuropeTalentsMeta,
  getEuropeTalentSlug,
  getEuropeRadar,
  getEuropeRadarMeta,
} from "@/lib/europe-talents";
import EuropeRadar from "@/components/EuropeRadar";
import { absoluteUrl } from "@/lib/site";
import Reveal from "@/components/Reveal";
import Breadcrumbs from "@/components/Breadcrumbs";
import PlayerAvatar from "@/components/PlayerAvatar";
import AdSense from "@/components/AdSense";

export const metadata = {
  title: "Talente für Europa: D2/D3-Scouting mit GFL-Star-Potenzial",
  description:
    "Spannende NCAA-Division-II- und Division-III-Spieler, deren Produktion und Physis für die GFL und andere europäische Ligen echtes Star-Potenzial bedeuten würde – kein NFL-Draft-Board, sondern ein eigenes Scouting-Radar für Europa.",
  alternates: { canonical: "/europa-talente" },
  openGraph: {
    type: "article",
    title: "Talente für Europa: D2/D3-Scouting",
    description:
      "NCAA-Division-II- und -III-Talente mit GFL-Star-Potenzial – getrennt vom NFL-Draft-Board.",
    url: absoluteUrl("/europa-talente"),
  },
};

export default function EuropaTalentePage() {
  const talents = getEuropeTalents();
  const meta = getEuropeTalentsMeta();
  const radar = getEuropeRadar();
  const radarMeta = getEuropeRadarMeta();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Talente für Europa – D2/D3-Scouting",
    itemListElement: [...talents, ...radar].map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${p.name} (${p.position}, ${p.college})`,
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
            Talente für Europa
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { name: "Draft Board", href: "/" },
            { name: "Talente für Europa" },
          ]}
        />

        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Talente für <span className="text-primary">Europa</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            {meta.intro}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-glow px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            Kein NFL-Draft-Board – eigenständige Kategorie
          </div>
        </div>

        <h2 className="mb-4 font-display text-2xl font-semibold uppercase tracking-tight text-foreground">
          Detailprofile
        </h2>
        <p className="mb-5 max-w-2xl text-xs leading-relaxed text-muted">
          Ausführlich gescoutete Einzelfälle: Rekordhalter, Award-Gewinner und
          Spieler mit einer Geschichte, die über die Statistik hinausgeht.
        </p>

        <Reveal className="grid gap-4 sm:grid-cols-2">
          {talents.map((p) => (
            <div
              key={getEuropeTalentSlug(p.name)}
              /* min-w-0 + break-words: Grid-Items haben min-width:auto und
                 wachsen sonst auf die min-content-Breite des laengsten Worts,
                 wodurch die Karte auf Mobil breiter wird als ihre Spalte. */
              className="flex min-w-0 flex-col gap-3 break-words rounded-xl border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-border bg-surface-light">
                  <PlayerAvatar name={p.name} size="sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-bold text-foreground">
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
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-muted">
                  {p.division}
                </span>
                <span className="rounded-full border border-primary/30 bg-primary-glow px-2.5 py-1 text-primary">
                  {p.class_year}
                </span>
                <span className="rounded-full border border-accent/40 bg-accent-glow px-2.5 py-1 text-accent">
                  GFL-Star-Potenzial
                </span>
              </div>

              <p className="text-xs font-bold uppercase tracking-wide text-accent">
                {p.highlight}
              </p>

              <p className="text-xs leading-relaxed text-foreground/80">
                {p.report_de}
              </p>

              <div className="mt-1 flex flex-wrap gap-2 border-t border-border pt-3">
                {p.sources.map((s) => (
                  <a
                    key={s}
                    href={p.source_urls?.[s] ?? `https://${s}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </Reveal>

        <section className="mt-14">
          <h2 className="mb-4 font-display text-2xl font-semibold uppercase tracking-tight text-foreground">
            Scouting-Radar
          </h2>
          <p className="mb-5 max-w-2xl text-xs leading-relaxed text-muted">
            {radarMeta.note}
          </p>
          <div className="mb-6 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-muted">
              {radarMeta.counts.total} Spieler
            </span>
            <span className="rounded-full border border-primary/30 bg-primary-glow px-2.5 py-1 text-primary">
              {radarMeta.counts.europlayers} mit Europlayers-Profil
            </span>
            <span className="rounded-full border border-accent/40 bg-accent-glow px-2.5 py-1 text-accent">
              {radarMeta.counts.hudl} mit Hudl-Profil
            </span>
          </div>
          <EuropeRadar players={radar} />
        </section>

        <AdSense slot="6888694163" layout="in-article" className="mt-12" />

        <div className="mt-10 space-y-2 text-[10px] leading-relaxed text-muted">
          <p>
            Diese Liste ist ein eigenständiges Scouting-Radar für europäische
            Ligen (allen voran die European League of Football) und folgt
            bewusst nicht der NFL-Draft-Eligibility-Logik unseres Big Boards.
            Aufgenommen wird nur, wer mit mindestens zwei unabhängigen Quellen
            belegt ist. Stand: {meta.updated}. Die Liste wächst laufend.
          </p>
          <p>
            <strong className="text-foreground/70">Zu den Profil-Links:</strong>{" "}
            Ein Europlayers- oder Hudl-Button erscheint ausschließlich dann, wenn
            das Profil dort wirklich existiert und sich eindeutig diesem Spieler
            zuordnen ließ – bei Hudl über den Abgleich der im Profil hinterlegten
            Hochschule, bei Europlayers über einen eindeutigen Namenstreffer im
            Spielerverzeichnis. Mehrdeutige Treffer werden verworfen statt geraten.
            Instagram-Accounts werden nur angezeigt, wenn sie sich belegen lassen;
            weder Hudl noch Europlayers noch die College-Bios geben sie öffentlich
            preis, deshalb ist dieses Feld derzeit leer.
          </p>
          <p>
            <strong className="text-foreground/70">Wer ist überhaupt verfügbar?</strong>{" "}
            Rund ein Drittel der Liste hatte 2025 noch College-Eligibility und ist
            damit kein Kandidat für sofort – diese Spieler tragen einen Hinweis, ab
            wann sie frühestens zu haben sind, und lassen sich über den Filter
            ausblenden. Ebenfalls markiert: wer bereits in Europa unterschrieben hat,
            wer an eine FBS- oder FCS-Hochschule gewechselt ist und wer in der NFL
            unter Vertrag steht. Diese Spieler bleiben bewusst sichtbar, weil sie
            zeigen, welche Profile sich am Markt tatsächlich durchsetzen.
          </p>
          <p>
            <strong className="text-foreground/70">Wichtig vor der Kontaktaufnahme:</strong>{" "}
            Der Kader-Status wurde gegen den NFL Draft 2026 und gegen die Meldungen
            von American Football International geprüft. Undrafted-Free-Agent-Verträge,
            Practice-Squad-Wechsel und Transfers innerhalb des College-Footballs
            lassen sich nicht flächendeckend nachverfolgen – bekannte Fälle sind
            markiert, im Zweifel bitte tagesaktuell prüfen.
          </p>
        </div>
      </div>
    </main>
  );
}
