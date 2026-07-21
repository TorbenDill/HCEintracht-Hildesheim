import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL, SITE_NAME } from "@/lib/site";
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
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description,
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
        <Script
          id="adsbygoogle-js"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3725697242603398"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
