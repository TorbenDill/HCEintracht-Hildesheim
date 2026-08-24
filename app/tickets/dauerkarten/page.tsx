import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { CreditCard, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Dauerkarten",
  description: "Dauerkarten für die Saison des HC Eintracht Hildesheim – Dein Stammplatz für alle Heimspiele.",
};

const BENEFITS = [
  "Garantierter Stammplatz bei allen Heimspielen",
  "Bis zu 20% günstiger als Einzeltickets",
  "Exklusive Dauerkarten-Events",
  "Vorverkaufsrecht für Sonderspiele",
  "Kostenlose Stornierung einzelner Spieltage",
];

export default function DauerkartenPage() {
  return (
    <>
      <PageHeader
        title="Dauerkarten"
        subtitle="Dein Stammplatz in der Halle"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dauerkarte 2026/27</h2>
                <p className="text-sm text-muted">Saison-Dauerkarte für alle Heimspiele</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-bold mb-3">Deine Vorteile</h3>
              <ul className="space-y-2">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-sm text-muted mb-6">
              Weitere Informationen zu Preisen und Kategorien findest du im
              Ticketshop oder kontaktiere uns direkt.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="/tickets/ticketshop" className="btn-primary">
                Zum Ticketshop
              </a>
              <a href="/verein/kontakt" className="btn-outline">
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
