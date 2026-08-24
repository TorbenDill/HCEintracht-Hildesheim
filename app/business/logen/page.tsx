import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Building2, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Logen",
  description: "VIP-Logen beim HC Eintracht Hildesheim – Exklusives Handballerlebnis.",
};

const FEATURES = [
  "Exklusiver Logenbereich mit bester Sicht",
  "All-inclusive Catering während des Spiels",
  "Separater Eingang und eigene Sanitäranlagen",
  "Persönliche Betreuung durch unser VIP-Team",
  "Networking mit anderen Unternehmern der Region",
  "Zugang zum VIP-Bereich vor und nach dem Spiel",
];

export default function LogenPage() {
  return (
    <>
      <PageHeader
        title="Logen"
        subtitle="Handball erleben auf VIP-Niveau"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">VIP-Logen</h2>
                <p className="text-sm text-muted">Das exklusive Handballerlebnis</p>
              </div>
            </div>

            <p className="text-muted mb-6 leading-relaxed">
              Unsere VIP-Logen bieten Ihnen ein einzigartiges Erlebnis bei den
              Heimspielen des HC Eintracht Hildesheim. Nutzen Sie die exklusive
              Atmosphäre für Kundenpflege, Mitarbeitermotivation oder einfach einen
              besonderen Abend mit Freunden und Familie.
            </p>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <a href="/verein/kontakt" className="btn-primary">
              Anfrage stellen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
