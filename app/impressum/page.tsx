import Link from "next/link";

export const metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung nach § 5 DDG.",
  alternates: { canonical: "/impressum" },
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Draft Board
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            Impressum
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-black uppercase tracking-tight text-foreground lg:text-4xl">
          Impressum
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Angaben gemäß § 5 DDG
            </h2>
            <p>
              Marketingberatung Dill
              <br />
              Torben Dill
              <br />
              Wollenweberstraße 23
              <br />
              31134 Hildesheim
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Kontakt
            </h2>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:info@marketingberatung-dill.de"
                className="text-primary hover:underline"
              >
                info@marketingberatung-dill.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p>
              Torben Dill
              <br />
              Wollenweberstraße 23
              <br />
              31134 Hildesheim
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Haftung für Inhalte
            </h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
              Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
              verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter
              jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
              Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche
              Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden von
              entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend
              entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Haftung für Links
            </h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren
              Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
              fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
              der Seiten verantwortlich. Die verlinkten Seiten wurden zum
              Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
              erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
              Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von
              Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht
              kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser
              Seite nicht vom Betreiber erstellt wurden, werden die
              Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter
              als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
              entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
              werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Hinweis zu Inhalten
            </h2>
            <p>
              Dieses Angebot ist ein privates, redaktionelles Hobbyprojekt rund
              um den NFL Draft. Es steht in keiner Verbindung zur National
              Football League (NFL) oder zu den genannten Colleges und Teams.
              Spielerbewertungen sind subjektive Einschätzungen. Verwendete
              Spielerportraits stammen von nfldraftbuzz.com; Rankings und Daten
              basieren auf den auf der Startseite genannten Quellen.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
              Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind
              nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor
              einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
