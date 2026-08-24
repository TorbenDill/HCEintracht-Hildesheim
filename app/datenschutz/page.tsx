import PageHeader from "@/components/PageHeader";

export const metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO auf der Website des HC Eintracht Hildesheim.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-primary">
      {children}
    </h2>
  );
}

export default function DatenschutzPage() {
  return (
    <>
      <PageHeader title="Datenschutzerklärung" />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <H2>1. Verantwortlicher</H2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <br />
              HC Eintracht Hildesheim e.V.
              <br />
              Hildesheim
              <br />
              Niedersachsen
              <br />
              E-Mail:{" "}
              <a
                href="mailto:info@hceintracht-hildesheim.de"
                className="text-primary hover:underline"
              >
                info@hceintracht-hildesheim.de
              </a>
            </p>
          </section>

          <section>
            <H2>2. Ihre Rechte als betroffene Person</H2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO),
              Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
              Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie ein
              Widerspruchsrecht (Art. 21). Eine erteilte Einwilligung können Sie
              jederzeit mit Wirkung für die Zukunft widerrufen. Zudem haben Sie
              das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu
              beschweren (Art. 77 DSGVO).
            </p>
          </section>

          <section>
            <H2>3. Hosting</H2>
            <p>
              Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, USA, gehostet. Beim Aufruf der Seite verarbeitet
              Vercel technisch notwendige Daten (u. a. IP-Adresse, Zeitpunkt des
              Zugriffs, abgerufene Datei, Browsertyp). Rechtsgrundlage ist unser
              berechtigtes Interesse an einer sicheren und effizienten
              Bereitstellung (Art. 6 Abs. 1 lit. f DSGVO). Da eine Übermittlung
              in die USA erfolgen kann, stützen wir diese auf die
              EU-Standardvertragsklauseln bzw. das EU-US Data Privacy Framework.
            </p>
          </section>

          <section>
            <H2>4. Server-Logfiles</H2>
            <p>
              Der Provider erhebt und speichert automatisch Informationen in
              sogenannten Server-Logfiles, die Ihr Browser automatisch
              übermittelt. Diese Daten sind nicht bestimmten Personen zuordenbar
              und werden nicht mit anderen Datenquellen zusammengeführt. Die
              Erfassung erfolgt zur Sicherstellung eines störungsfreien Betriebs
              und zur Auswertung der Systemsicherheit (Art. 6 Abs. 1 lit. f
              DSGVO).
            </p>
          </section>

          <section>
            <H2>5. Cookies</H2>
            <p>
              Diese Website verwendet ausschließlich technisch notwendige
              Cookies, die für den Betrieb der Website erforderlich sind.
              Rechtsgrundlage ist unser berechtigtes Interesse an der
              Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO, § 25
              Abs. 2 TDDDG).
            </p>
          </section>

          <section>
            <H2>6. Eingebettete Inhalte</H2>
            <p>
              Diese Website bindet Widgets von handball.net (Deutscher
              Handballbund) sowie ggf. Livestreams von sporteurope.tv ein. Beim
              Laden dieser Inhalte wird Ihre IP-Adresse an den jeweiligen
              Anbieter übermittelt. Rechtsgrundlage ist unser berechtigtes
              Interesse an einer informativen Darstellung (Art. 6 Abs. 1 lit. f
              DSGVO).
            </p>
          </section>

          <section>
            <H2>7. SSL-/TLS-Verschlüsselung</H2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-
              Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an
              &bdquo;https://&ldquo; in der Adresszeile Ihres Browsers.
            </p>
          </section>

          <section>
            <H2>8. Aktualität</H2>
            <p>
              Diese Datenschutzerklärung wird bei Bedarf angepasst, um sie stets
              aktuellen rechtlichen Anforderungen anzupassen oder Änderungen der
              Dienste umzusetzen. Für Ihren erneuten Besuch gilt dann die neue
              Fassung.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
