import Link from "next/link";

export const metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten nach DSGVO – inkl. Hosting, Cookies und Google AdSense.",
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
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
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
            Datenschutz
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-3xl font-black uppercase tracking-tight text-foreground lg:text-4xl">
          Datenschutzerklärung
        </h1>

        <div className="space-y-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <H2>1. Verantwortlicher</H2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              <br />
              <br />
              Marketingberatung Dill
              <br />
              Torben Dill
              <br />
              Wollenweberstraße 23
              <br />
              31134 Hildesheim
              <br />
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
            <H2>5. Cookies &amp; Einwilligung</H2>
            <p>
              Diese Website verwendet Cookies. Technisch notwendige Cookies (z. B.
              zur Speicherung Ihrer Cookie-Entscheidung) werden auf Grundlage
              unseres berechtigten Interesses gesetzt (Art. 6 Abs. 1 lit. f
              DSGVO, § 25 Abs. 2 TDDDG). Alle nicht notwendigen Cookies –
              insbesondere für Werbung (Google AdSense) – werden erst gesetzt,
              nachdem Sie über den von Google bereitgestellten, zertifizierten
              Einwilligungsdienst (Consent-Banner) ausdrücklich eingewilligt
              haben (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Ihre
              Einwilligung wird durch diesen Einwilligungsdienst gespeichert; Sie
              können sie jederzeit über die Datenschutz-Optionen des Banners bzw.
              durch Löschen der Website-Daten in Ihrem Browser widerrufen.
            </p>
          </section>

          <section>
            <H2>6. Google AdSense</H2>
            <p>
              Diese Website nutzt Google AdSense, einen Dienst der Google
              Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland.
              Das AdSense-Basisskript wird beim Seitenaufruf technisch geladen.
              Ohne Ihre Einwilligung liefert Google AdSense ausschließlich
              nicht-personalisierte Werbung aus, ohne hierfür Werbe-Cookies zu
              setzen (umgesetzt über Google Consent Mode v2). Die Einwilligung
              wird über den von Google bereitgestellten, zertifizierten
              Einwilligungsdienst (CMP) eingeholt und verwaltet. Erst mit Ihrer
              Einwilligung werden zusätzlich Cookies und vergleichbare
              Technologien für personalisierte Werbung eingesetzt.
              Dabei können Nutzungsdaten (u. a. IP-Adresse, Geräte- und
              Browserinformationen) verarbeitet und an Server von Google – auch
              in den USA – übertragen werden. Rechtsgrundlage für
              nicht-personalisierte, cookielose Werbung ist unser berechtigtes
              Interesse an der Finanzierung des Angebots (Art. 6 Abs. 1 lit. f
              DSGVO); für personalisierte Werbung und den Einsatz von Cookies
              Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).
              Sie können personalisierte Werbung in den{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google-Anzeigeneinstellungen
              </a>{" "}
              deaktivieren. Weitere Informationen zur Datenverarbeitung durch
              Google:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
          </section>

          <section>
            <H2>7. Spielerdarstellungen</H2>
            <p>
              Wo verfügbar, zeigen wir frei lizenzierte Spielerfotos (z. B.
              Creative-Commons- oder Public-Domain-Bilder) von Wikimedia Commons
              (upload.wikimedia.org, Wikimedia Foundation Inc., USA). Für
              atmosphärische Hintergrundbilder (z. B. Stadionfotografie) können
              zusätzlich lizenzfreie Fotos vom Anbieter Pexels
              (images.pexels.com, Pexels GmbH) eingebunden sein. Beim Laden
              dieser Bilder wird Ihre IP-Adresse an den jeweiligen Anbieter
              übermittelt. Rechtsgrundlage ist unser berechtigtes Interesse an
              einer anschaulichen Darstellung (Art. 6 Abs. 1 lit. f DSGVO). Ist
              kein frei lizenziertes Foto vorhanden, wird ein lokal generierter
              Initialen-Avatar ohne Drittübermittlung angezeigt.
            </p>
          </section>

          <section>
            <H2>8. SSL-/TLS-Verschlüsselung</H2>
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine SSL-/TLS-
              Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an
              „https://“ in der Adresszeile Ihres Browsers.
            </p>
          </section>

          <section>
            <H2>9. Aktualität</H2>
            <p>
              Diese Datenschutzerklärung wird bei Bedarf angepasst, um sie stets
              aktuellen rechtlichen Anforderungen anzupassen oder Änderungen der
              Dienste umzusetzen. Für Ihren erneuten Besuch gilt dann die neue
              Fassung.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
