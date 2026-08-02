import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, CONSENT_KEY, ADSENSE_CLIENT } from "@/lib/site";
import CookieConsent from "@/components/CookieConsent";
import "@fontsource-variable/archivo";
import "@fontsource-variable/oswald";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const description =
  "NFL Draft 2027 Scouting-Dashboard auf Deutsch: Big Board, Positionsrankings, Spielerprofile und Mock Draft – powered by Forstner Scouting.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | NFL Draft Board 2027",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "NFL Draft 2027",
    "Big Board",
    "Mock Draft",
    "Scouting",
    "NFL Prospects",
    "Draftboard",
    "College Football",
    "deutsch",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description,
    images: [{ url: "/og/home", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description,
    images: ["/og/home"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: "K_0wLMD7ncSWzJ5qiqYXlRwZj8SLENF9JUnH8pxjEa0",
  },
  // Googles aktuelle AdSense-Site-Verifizierung: rendert
  // <meta name="google-adsense-account" content="ca-pub-...">. Ergänzt die
  // ads.txt (public/ads.txt) als zweiten, unabhängigen Nachweis der Inhaberschaft.
  other: {
    "google-adsense-account": ADSENSE_CLIENT,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <head>
        {/*
         * Google Consent Mode v2. Standardmäßig sind alle Werbe- und
         * Analyse-Signale auf "denied" – dann liefert AdSense nur
         * nicht-personalisierte, cookielose Anzeigen (DSGVO-konform, keine
         * Zustimmung nötig). Liegt eine gespeicherte Einwilligung vor, wird
         * sofort auf "granted" hochgestuft. Muss synchron VOR dem Basisskript
         * laufen.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w=window;w.dataLayer=w.dataLayer||[];function gtag(){w.dataLayer.push(arguments);}w.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});try{if(localStorage.getItem(${JSON.stringify(
              CONSENT_KEY
            )})==='accepted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}w.adsbygoogle=w.adsbygoogle||[];})();`,
          }}
        />
        {/*
         * AdSense-Basisskript bewusst als rohes <script> im <head>:
         * next/script hängt es mit data-nscript in den <body>, was Google
         * bei der Site-Verifizierung ablehnt ("AdSense head tag doesn't
         * support data-nscript attribute").
         */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-muted">
            <span>
              © {new Date().getFullYear()} Marketingberatung Dill · NFL Draft
              Board 2027
            </span>
            <nav className="flex flex-wrap gap-4">
              <a href="/" className="hover:text-primary">
                Board
              </a>
              <a href="/mock-draft" className="hover:text-primary">
                Mock Draft
              </a>
              <a href="/simulator" className="hover:text-primary">
                Simulator
              </a>
              <a href="/positionen" className="hover:text-primary">
                Positionen
              </a>
              <a href="/colleges" className="hover:text-primary">
                Colleges
              </a>
              <a href="/teams" className="hover:text-primary">
                Teams
              </a>
              <a href="/merkliste" className="hover:text-primary">
                Merkliste
              </a>
              <a href="/lexikon" className="hover:text-primary">
                Lexikon
              </a>
              <a href="/impressum" className="hover:text-primary">
                Impressum
              </a>
              <a href="/datenschutz" className="hover:text-primary">
                Datenschutz
              </a>
            </nav>
          </div>
        </footer>
        <CookieConsent />
      </body>
    </html>
  );
}
