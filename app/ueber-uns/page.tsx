import type { Metadata } from "next";
import Link from "next/link";
import { getPlayers, getBoardMeta } from "@/lib/player-service";
import { getColleges } from "@/lib/colleges";
import { getTeams } from "@/lib/teams";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";

const meta = getBoardMeta();

export const metadata: Metadata = {
  title: "Über uns & Methodik",
  description: `Wer hinter ${SITE_NAME} steht und wie unser deutschsprachiges NFL-Draft-Big-Board entsteht: Datenquellen, Scouting-Methodik, Aktualisierungszyklus und redaktionelle Grundsätze.`,
  alternates: { canonical: "/ueber-uns" },
  openGraph: {
    type: "article",
    title: "Über uns & Methodik",
    url: absoluteUrl("/ueber-uns"),
  },
};

export default function UeberUnsPage() {
  const playerCount = getPlayers().length;
  const collegeCount = getColleges().length;
  const teamCount = getTeams().length;
  const sourceCount = meta.sources.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Über uns & Methodik",
    url: absoluteUrl("/ueber-uns"),
    inLanguage: "de",
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Deutschsprachiges Scouting-Projekt zum NFL Draft: Big Board, Positionsrankings, Spielerprofile und Mock Draft.",
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30" aria-hidden="true">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Über uns
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Breadcrumbs
          className="mb-6"
          items={[
            { name: "Draft Board", href: "/" },
            { name: "Über uns" },
          ]}
        />

        <header className="mb-10">
          <h1 className="mb-4 font-display text-3xl font-semibold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Über uns &amp;{" "}
            <span className="text-primary">Methodik</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
            {SITE_NAME} ist ein unabhängiges, deutschsprachiges Scouting-Projekt
            rund um den NFL Draft {meta.draftYear}. Wir bündeln die großen
            englischsprachigen Consensus-Rankings, ordnen sie für ein deutsches
            Publikum ein und ergänzen jedes Profil um einen eigenen
            Scouting-Report. Ziel ist eine Anlaufstelle, an der man den
            kommenden Draft-Jahrgang auf Deutsch verstehen kann – ohne sich
            durch ein Dutzend US-Seiten zu klicken.
          </p>
        </header>

        <Reveal className="mb-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { n: playerCount, l: "Spielerprofile" },
              { n: collegeCount, l: "Colleges" },
              { n: teamCount, l: "NFL-Teams" },
              { n: sourceCount, l: "Quell-Boards" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl border border-border bg-surface p-4 text-center"
              >
                <div className="font-mono text-2xl font-black text-primary">
                  {s.n}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="mb-10">
          <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">
            Wer dahinter steht
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            Die Scouting-Einschätzungen und die namentlich gekennzeichneten
            Statements auf den Spielerprofilen stammen von{" "}
            <strong className="text-foreground">Philipp Forstner</strong> unter
            dem Label <strong className="text-foreground">Forstner Scouting</strong>.
            Die Bewertungen sind bewusst als persönliche Einordnung formuliert:
            Wo wir ein Talent höher oder tiefer sehen als der Consensus, schreiben
            wir das hin – samt Begründung. Für rechtliche Angaben, den
            Verantwortlichen im Sinne des Medienrechts und die Kontaktmöglichkeit
            siehe unser{" "}
            <Link href="/impressum" className="text-primary hover:underline">
              Impressum
            </Link>
            .
          </p>
        </Reveal>

        <Reveal className="mb-10">
          <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">
            Wie das Big Board entsteht
          </h2>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/80">
            <p>
              Grundlage ist ein Consensus-Ansatz: Wir werten {sourceCount}{" "}
              etablierte, öffentlich einsehbare Big Boards und Draft-Rankings aus
              (unten vollständig verlinkt) und verdichten sie zu einer
              Gesamtrangfolge. So gleichen sich die Ausreißer einzelner Quellen
              aus und es entsteht ein belastbarer Überblick, welche Prospects der
              Draft-Community aktuell wie hoch gehandelt werden.
            </p>
            <p>
              Auf diese Datenbasis legen wir die eigene Arbeit: Jedes der{" "}
              {playerCount} Profile bekommt einen deutschsprachigen
              Scouting-Report mit Stärken, Schwächen und – als Einordnungshilfe –
              einem Best-Case- und Worst-Case-Vergleich zu einem bekannten
              NFL-Spieler. Die Piktogramme fassen das Spielerprofil auf einen
              Blick zusammen, die Riser-&amp;-Faller-Ansicht zeigt, wer sich seit
              dem letzten Update bewegt hat.
            </p>
            <p>
              Ergänzend ordnen wir die Prospects nach{" "}
              <Link href="/positionen" className="text-primary hover:underline">
                Position
              </Link>{" "}
              und{" "}
              <Link href="/colleges" className="text-primary hover:underline">
                College
              </Link>{" "}
              und projizieren im{" "}
              <Link href="/mock-draft" className="text-primary hover:underline">
                Mock Draft
              </Link>
              , welcher Spieler zu welchem Team passen könnte. Der{" "}
              <Link href="/simulator" className="text-primary hover:underline">
                Draft-Simulator
              </Link>{" "}
              lässt dich die erste Runde selbst durchspielen.
            </p>
          </div>
        </Reveal>

        <Reveal className="mb-10">
          <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">
            Aktualisierung
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            Ein Draft-Jahrgang ist keine Momentaufnahme, sondern verschiebt sich
            über die College-Saison. Wir aktualisieren das Board deshalb
            regelmäßig – {meta.updateCycle.toLowerCase()}. Der jeweils aktuelle
            Stand steht auf jeder Seite: zuletzt aktualisiert am{" "}
            <strong className="text-foreground">{meta.updated}</strong>. Zwischen
            den festen Updates passen wir einzelne Bewertungen an, wenn Verletzungen,
            Formkurven oder neue Erkenntnisse es erfordern.
          </p>
        </Reveal>

        <Reveal className="mb-10">
          <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">
            Quellen &amp; Transparenz
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-foreground/80">
            Wir machen offen, worauf die Consensus-Rangfolge beruht. Diese{" "}
            {sourceCount} Boards fließen in die Auswertung ein:
          </p>
          <ul className="mb-4 grid gap-1.5 sm:grid-cols-2">
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
          <p className="text-xs leading-relaxed text-muted">
            Spielerfotos: {meta.imageSource.name}. Wir stehen in keiner
            Verbindung zur National Football League oder den genannten Portalen;
            alle Marken- und Team-Namen gehören ihren jeweiligen Rechteinhabern
            und werden nur zur Beschreibung verwendet.
          </p>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-2 text-base font-black tracking-tight text-foreground">
              Kontakt &amp; Rechtliches
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80">
              Fragen, Hinweise auf Fehler oder Korrekturwünsche? Die
              Kontaktdaten findest du im{" "}
              <Link href="/impressum" className="text-primary hover:underline">
                Impressum
              </Link>
              . Wie wir mit Daten umgehen, steht in der{" "}
              <Link href="/datenschutz" className="text-primary hover:underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
