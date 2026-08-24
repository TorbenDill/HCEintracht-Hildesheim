import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Flag, Palette } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Fans",
  description: "Fanbereich des HC Eintracht Hildesheim – Fanshop, Fanartikel und Fanchoreografie.",
};

const SECTIONS = [
  {
    icon: ShoppingBag,
    title: "Fanshop",
    description: "Trikots, Schals und weitere Fanartikel im offiziellen Shop.",
    href: "/fans/fanshop",
  },
  {
    icon: Flag,
    title: "Fanartikel",
    description: "Zeige deine Unterstützung mit offiziellen Fanartikeln des HCE.",
    href: "/fans/fanartikel",
  },
  {
    icon: Palette,
    title: "Fanchoreografie",
    description: "Gemeinsam für die Mannschaft – unsere Choreografien und Aktionen.",
    href: "/fans/fanchoreografie",
  },
];

export default function FansPage() {
  return (
    <>
      <PageHeader
        title="Fans"
        subtitle="Alles für die Fans des HC Eintracht Hildesheim"
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
