import type { Metadata } from "next";
import Link from "next/link";
import { History, UserCheck, MapPin, Mail } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Verein",
  description: "Der HC Eintracht Hildesheim – Geschichte, Vorstand, Hallenfinder und Kontakt.",
};

const SECTIONS = [
  {
    icon: History,
    title: "Geschichte",
    description: "Die Geschichte des HC Eintracht Hildesheim von den Anfängen bis heute.",
    href: "/verein/geschichte",
  },
  {
    icon: UserCheck,
    title: "Vorstand",
    description: "Der Vorstand und die Verantwortlichen des Vereins.",
    href: "/verein/vorstand",
  },
  {
    icon: MapPin,
    title: "Hallenfinder",
    description: "So findest du unsere Spielstätte – Anfahrt und Parkmöglichkeiten.",
    href: "/verein/hallenfinder",
  },
  {
    icon: Mail,
    title: "Kontakt",
    description: "Kontaktiere den HC Eintracht Hildesheim direkt.",
    href: "/verein/kontakt",
  },
];

export default function VereinPage() {
  return (
    <>
      <PageHeader
        title="Verein"
        subtitle="Alles über den HC Eintracht Hildesheim"
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
