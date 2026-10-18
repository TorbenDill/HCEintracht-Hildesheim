import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import SiteHeader from "@/components/SiteHeader";
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
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div id="inhalt" className="flex-1">
          {children}
        </div>
        <footer className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-muted">
            <span>
              © {new Date().getFullYear()} Marketingberatung Dill · NFL Draft
              Board 2027
            </span>
            <nav className="flex flex-wrap gap-4">
              <Link href="/" className="hover:text-primary">
                Board
              </Link>
              <Link href="/mock-draft" className="hover:text-primary">
                Mock Draft
              </Link>
              <Link href="/simulator" className="hover:text-primary">
                Simulator
              </Link>
              <Link href="/positionen" className="hover:text-primary">
                Positionen
              </Link>
              <Link href="/colleges" className="hover:text-primary">
                Colleges
              </Link>
              <Link href="/teams" className="hover:text-primary">
                Teams
              </Link>
              <Link href="/merkliste" className="hover:text-primary">
                Merkliste
              </Link>
              <Link href="/lexikon" className="hover:text-primary">
                Lexikon
              </Link>
              <Link href="/ueber-uns" className="hover:text-primary">
                Über uns
              </Link>
              <Link href="/impressum" className="hover:text-primary">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-primary">
                Datenschutz
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
