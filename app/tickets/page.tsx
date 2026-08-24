import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, CreditCard, Users } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Tickets",
  description:
    "Tickets für die Heimspiele des HC Eintracht Hildesheim – Einzeltickets, Dauerkarten und Infos für Gästefans.",
};

const SECTIONS = [
  {
    icon: ShoppingCart,
    title: "Ticketshop",
    description: "Kaufe Einzeltickets für unsere Heimspiele bequem online.",
    href: "/tickets/ticketshop",
  },
  {
    icon: CreditCard,
    title: "Dauerkarten",
    description: "Sichere dir deinen Stammplatz für die gesamte Saison und spare.",
    href: "/tickets/dauerkarten",
  },
  {
    icon: Users,
    title: "Gästefans",
    description: "Infos für Fans der Gastmannschaften zu Tickets und Anreise.",
    href: "/tickets/gaestefans",
  },
];

export default function TicketsPage() {
  return (
    <>
      <PageHeader
        title="Tickets"
        subtitle="Sichere dir dein Ticket für das nächste Heimspiel"
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
