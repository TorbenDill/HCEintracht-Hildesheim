import Link from "next/link";
import { EXTERNAL_LINKS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-dark text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <div className="text-lg font-black text-white tracking-wide">
                HC EINTRACHT
              </div>
              <div className="text-sm text-primary font-semibold">
                HILDESHEIM
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Handball aus Leidenschaft. Seit der Gründung steht der HC Eintracht
              Hildesheim für packenden Handballsport in Niedersachsen.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Spieltag
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/spieltag/tabelle" className="hover:text-primary transition-colors">Tabelle</Link></li>
              <li><Link href="/spieltag/spielplan" className="hover:text-primary transition-colors">Spielplan</Link></li>
              <li><Link href="/spieltag/liveticker" className="hover:text-primary transition-colors">Liveticker</Link></li>
              <li><Link href="/spieltag/livestream" className="hover:text-primary transition-colors">Livestream</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Verein
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mannschaft/kader" className="hover:text-primary transition-colors">Kader</Link></li>
              <li><Link href="/verein/geschichte" className="hover:text-primary transition-colors">Geschichte</Link></li>
              <li><Link href="/verein/vorstand" className="hover:text-primary transition-colors">Vorstand</Link></li>
              <li><Link href="/verein/kontakt" className="hover:text-primary transition-colors">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-white uppercase tracking-wider">
              Folge uns
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={EXTERNAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.shop}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Fanshop
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-dark-light pt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} HC Eintracht Hildesheim e.V.</span>
          <nav className="flex flex-wrap gap-4">
            <Link href="/impressum" className="hover:text-primary transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-primary transition-colors">
              Datenschutz
            </Link>
            <Link href="/verein/kontakt" className="hover:text-primary transition-colors">
              Kontakt
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
