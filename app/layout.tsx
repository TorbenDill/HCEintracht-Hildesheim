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
         * Werbeanfragen pausieren, bis eine Einwilligung vorliegt
         * (Art. 6 Abs. 1 lit. a DSGVO). Muss synchron VOR dem Basisskript
         * laufen – CookieConsent greift per useEffect zu spät, sobald das
         * Skript im <head> hängt.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var w=window;w.adsbygoogle=w.adsbygoogle||[];var ok=false;try{ok=localStorage.getItem(${JSON.stringify(
              CONSENT_KEY
            )})==="accepted"}catch(e){}w.adsbygoogle.pauseAdRequests=ok?0:1})();`,
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
