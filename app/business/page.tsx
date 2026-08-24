import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Megaphone, Handshake, UtensilsCrossed } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Business & VIP",
  description:
    "Business- und VIP-Angebote des HC Eintracht Hildesheim – Logen, Werbemöglichkeiten, B2B-Netzwerk und Catering.",
};

const SECTIONS = [
  {
    icon: Building2,
    title: "Logen",
    description: "Exklusive Logen für ein besonderes Spielerlebnis mit Geschäftspartnern und Kunden.",
    href: "/business/logen",
  },
  {
    icon: Megaphone,
    title: "Werbemöglichkeiten",
    description: "Präsentiere dein Unternehmen einem begeisterten Publikum in der Halle und digital.",
    href: "/business/werbemoeglichkeiten",
  },
  {
    icon: Handshake,
    title: "B2B-Netzwerk",
    description: "Vernetze dich mit anderen Unternehmen aus der Region beim HC Eintracht.",
    href: "/business/b2b-netzwerk",
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description: "Erstklassiges Catering für VIP-Bereiche und Veranstaltungen.",
    href: "/business/catering",
  },
];

export default function BusinessPage() {
  return (
    <>
      <PageHeader
        title="Business & VIP"
        subtitle="Erlebe Handball auf höchstem Niveau – geschäftlich und privat"
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

          <div className="mt-16 bg-dark text-white rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl font-black uppercase tracking-wide mb-4">
              Partner des <span className="text-primary">HC Eintracht</span>
            </h2>
            <p className="text-gray-300 max-w-xl mb-6">
              Werden Sie Teil unseres Sponsorennetzwerks und profitieren Sie von
              der Reichweite und Emotionalität des Handballsports in Hildesheim.
            </p>
            <a href="/verein/kontakt" className="btn-primary">
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
