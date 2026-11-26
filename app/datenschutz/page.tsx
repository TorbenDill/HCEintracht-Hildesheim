import { pageMetadata } from "@/lib/seo";
import { EinwilligungWiderrufen } from "@/components/Einwilligung";

export const metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description:
    "Datenschutz bei nfldraft-scouting.de: Hosting, Server-Logfiles, lokale Merkliste und eigenes Board sowie Google Analytics nur mit Einwilligung – nach DSGVO erklärt.",
  path: "/datenschutz",
});

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
            <H2>5. Cookies &amp; lokale Speicherung</H2>
            <p>
              Ohne Ihre Einwilligung setzt diese Website keine Cookies und lädt
              keine Analyse- oder Werbedienste. Werbedienste setzen wir nicht
              ein. Ihre Entscheidung zur Reichweitenmessung (Abschnitt 6)
              speichern wir unter dem Schlüssel „nds-einwilligung“ im
              localStorage Ihres Browsers. Wenn Sie Spieler auf Ihre
              Merkliste setzen oder unter „Mein Board“ ein eigenes Big Board
              mit Notizen anlegen, wird das ausschließlich lokal im Speicher
              Ihres Browsers (localStorage) abgelegt und nicht an uns oder
              Dritte übertragen. Auch Bild- und PDF-Downloads entstehen direkt
              in Ihrem Browser. Ein geteilter Board-Link enthält nur Reihenfolge,
              Tiers und Board-Namen im URL-Fragment (nach dem „#“), das Browser
              nicht an den Server senden; Notizen sind nie enthalten. Sie können
              Merkliste und Board jederzeit durch Löschen der Website-Daten in
              Ihrem Browser entfernen. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG, da die
              Speicherung für die von Ihnen ausdrücklich gewünschte Funktion
              unbedingt erforderlich ist.
            </p>
          </section>

          <section id="analytics" className="scroll-mt-24">
            <H2>6. Reichweitenmessung mit Google Analytics 4</H2>
            <p>
              Nur wenn Sie in der Abfrage „Zustimmen“ gewählt haben, setzen wir
              Google Analytics 4 ein, einen Dienst der Google Ireland Limited,
              Gordon House, Barrow Street, Dublin 4, Irland. Zweck ist
              auszuwerten, welche Rankings, Spielerprofile und Werkzeuge
              genutzt werden und über welche Wege Besuche entstehen, um die
              Inhalte zu verbessern.
            </p>
            <p className="mt-3">
              Verarbeitet werden insbesondere: eine zufällig vergebene Kennung
              Ihres Browsers (Cookies „_ga“ und „_ga_…“, Laufzeit bis zu 2
              Jahre), aufgerufene Seiten und Zeitpunkte, Verweildauer,
              Scrolltiefe, Klicks auf ausgehende Links, die Nutzung von
              Merkliste, Board-Export und Simulator-Export (ohne Board-Inhalte
              oder Notizen), Herkunft des Zugriffs (Referrer, Suchmaschine),
              Angaben zu Gerät, Browser und Sprache sowie ein ungefährer
              Standort auf Ebene von Land, Region und Stadt. Google speichert
              IP-Adressen in Analytics 4 nicht. Google Signals und
              personalisierte Werbung sind abgeschaltet; die Ereignisdaten
              werden nach 14 Monaten gelöscht.
            </p>
            <p className="mt-3">
              Rechtsgrundlage für das Speichern und Auslesen der Kennung ist §
              25 Abs. 1 TDDDG in Verbindung mit Ihrer Einwilligung, für die
              weitere Verarbeitung Art. 6 Abs. 1 lit. a DSGVO.{" "}
              <strong>
                Ohne Einwilligung wird kein Google-Skript geladen und es
                werden auch keine anonymen Messsignale gesendet.
              </strong>
            </p>
            <p className="mt-3">
              Drittlandtransfer: Eine Verarbeitung durch die Google LLC in den
              USA ist möglich. Google LLC ist unter dem EU-US Data Privacy
              Framework zertifiziert (Angemessenheitsbeschluss der
              EU-Kommission); ergänzend gelten Standardvertragsklauseln.
              Weitere Informationen:{" "}
              <a
                href="https://policies.google.com/privacy?hl=de"
                rel="noopener noreferrer"
                target="_blank"
                className="text-primary hover:underline"
              >
                policies.google.com/privacy
              </a>
              .
            </p>
            <p className="mt-3">
              Sie können Ihre Einwilligung jederzeit mit Wirkung für die
              Zukunft widerrufen – über „Cookie-Einstellungen“ in der
              Fußzeile oder hier:
            </p>
            <div className="mt-3">
              <EinwilligungWiderrufen />
            </div>
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
