import type { Metadata } from "next";
import Link from "next/link";
import { Table2, CalendarDays, Radio, Tv } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Spieltag",
  description:
    "Alles rund um den Spieltag: Tabelle, Spielplan, Liveticker und Livestream des HC Eintracht Hildesheim.",
};

const SECTIONS = [
  {
    icon: Table2,
    title: "Tabelle",
    description: "Aktuelle Tabelle der laufenden Saison mit allen Platzierungen.",
    href: "/spieltag/tabelle",
  },
  {
    icon: CalendarDays,
    title: "Spielplan",
    description: "Alle Spiele der Saison auf einen Blick – Heim- und Auswärtsspiele.",
    href: "/spieltag/spielplan",
  },
  {
    icon: Radio,
    title: "Liveticker",
    description: "Verfolge unsere Spiele in Echtzeit mit dem Liveticker.",
    href: "/spieltag/liveticker",
  },
  {
    icon: Tv,
    title: "Livestream",
    description: "Schau dir die Spiele live im Stream an – egal wo du bist.",
    href: "/spieltag/livestream",
  },
];

export default function SpieltragPage() {
  return (
    <>
      <PageHeader
        title="Spieltag"
        subtitle="Tabelle, Spielplan, Liveticker und Livestream"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SECTIONS.map((item) => (
              <Link key={item.href} href={item.href} className="card p-6 group">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h2 className="text-lg font-bold mb-2">{item.title}</h2>
                <p className="text-sm text-muted">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
