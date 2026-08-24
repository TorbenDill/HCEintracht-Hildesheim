import type { Metadata } from "next";
import Link from "next/link";
import { Users, UserCog, BarChart3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Mannschaft",
  description: "Die Mannschaft des HC Eintracht Hildesheim – Kader, Trainerteam und Statistiken.",
};

const SECTIONS = [
  {
    icon: Users,
    title: "Kader",
    description: "Alle Spieler der ersten Mannschaft im Überblick.",
    href: "/mannschaft/kader",
  },
  {
    icon: UserCog,
    title: "Trainerteam",
    description: "Trainer und Betreuer des HC Eintracht Hildesheim.",
    href: "/mannschaft/trainerteam",
  },
  {
    icon: BarChart3,
    title: "Statistiken",
    description: "Spieler- und Mannschaftsstatistiken der aktuellen Saison.",
    href: "/mannschaft/statistiken",
  },
];

export default function MannschaftPage() {
  return (
    <>
      <PageHeader
        title="Mannschaft"
        subtitle="Unsere Spieler, Trainer und Statistiken"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
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
