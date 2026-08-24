"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/site";

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  external?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "News", href: "/news" },
  {
    label: "Spieltag",
    href: "/spieltag",
    children: [
      { label: "Tabelle", href: "/spieltag/tabelle" },
      { label: "Spielplan", href: "/spieltag/spielplan" },
      { label: "Liveticker", href: "/spieltag/liveticker" },
      { label: "Livestream", href: "/spieltag/livestream" },
    ],
  },
  {
    label: "Tickets",
    href: "/tickets",
    children: [
      { label: "Ticketshop", href: "/tickets/ticketshop" },
      { label: "Dauerkarten", href: "/tickets/dauerkarten" },
      { label: "Gästefans", href: "/tickets/gaestefans" },
    ],
  },
  {
    label: "Mannschaft",
    href: "/mannschaft",
    children: [
      { label: "Kader", href: "/mannschaft/kader" },
      { label: "Trainerteam", href: "/mannschaft/trainerteam" },
      { label: "Statistiken", href: "/mannschaft/statistiken" },
    ],
  },
  { label: "Jugend", href: "/jugend" },
  {
    label: "Business & VIP",
    href: "/business",
    children: [
      { label: "Logen", href: "/business/logen" },
      { label: "Werbemöglichkeiten", href: "/business/werbemoeglichkeiten" },
      { label: "B2B-Netzwerk", href: "/business/b2b-netzwerk" },
      { label: "Catering", href: "/business/catering" },
    ],
  },
  {
    label: "Fans",
    href: "/fans",
    children: [
      { label: "Fanshop", href: "/fans/fanshop" },
      { label: "Fanartikel", href: "/fans/fanartikel" },
      { label: "Fanchoreografie", href: "/fans/fanchoreografie" },
    ],
  },
  {
    label: "Verein",
    href: "/verein",
    children: [
      { label: "Geschichte", href: "/verein/geschichte" },
      { label: "Vorstand", href: "/verein/vorstand" },
      { label: "Hallenfinder", href: "/verein/hallenfinder" },
      { label: "Kontakt", href: "/verein/kontakt" },
    ],
  },
  {
    label: "Shop",
    href: EXTERNAL_LINKS.shop,
    external: true,
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-dark text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-black text-white">
            HC
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold leading-tight tracking-wide">
              HC EINTRACHT
            </div>
            <div className="text-xs text-primary leading-tight">HILDESHEIM</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            if (item.external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-200 hover:text-primary transition-colors rounded"
                >
                  {item.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              );
            }

            if ("children" in item && item.children) {
              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-200 hover:text-primary transition-colors rounded"
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Link>
                  {openDropdown === item.label && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="min-w-48 rounded-lg bg-dark-light shadow-xl border border-dark-lighter py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-200 hover:bg-primary hover:text-white transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-semibold text-gray-200 hover:text-primary transition-colors rounded"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="lg:hidden p-2 text-gray-200 hover:text-primary"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden border-t border-dark-light bg-dark pb-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-200 hover:text-primary hover:bg-dark-light"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="block px-6 py-3 text-sm font-semibold text-gray-200 hover:text-primary hover:bg-dark-light"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {"children" in item &&
                    item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-10 py-2 text-sm text-gray-400 hover:text-primary hover:bg-dark-light"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                </>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
