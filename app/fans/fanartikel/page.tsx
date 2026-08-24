import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Flag } from "lucide-react";

export const metadata: Metadata = {
  title: "Fanartikel",
  description: "Fanartikel des HC Eintracht Hildesheim – Schals, Trikots und mehr.",
};

const ARTICLES = [
  { name: "Heimtrikot", description: "Das offizielle Heimtrikot der aktuellen Saison" },
  { name: "Auswärtstrikot", description: "Das offizielle Auswärtstrikot der aktuellen Saison" },
  { name: "Fanschal", description: "Der klassische Fanschal in den Vereinsfarben" },
  { name: "Cap", description: "Basecap mit dem Vereinslogo" },
  { name: "Hoodie", description: "Bequemer Hoodie mit HC Eintracht Branding" },
  { name: "Trinkflasche", description: "Sportflasche im Vereinsdesign" },
];

export default function FanartikelPage() {
  return (
    <>
      <PageHeader
        title="Fanartikel"
        subtitle="Zeige deine Unterstützung"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((item) => (
              <div key={item.name} className="card overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
                  <Flag className="h-12 w-12 text-primary/30" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold mb-1">{item.name}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
