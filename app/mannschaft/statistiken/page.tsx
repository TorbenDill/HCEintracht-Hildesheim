import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { BarChart3 } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Statistiken",
  description: "Statistiken des HC Eintracht Hildesheim – Spieler- und Mannschaftsstatistiken.",
};

export default function StatistikenPage() {
  return (
    <>
      <PageHeader
        title="Statistiken"
        subtitle="Zahlen und Fakten zur Saison"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">Mannschaftsstatistiken</h2>
            <p className="text-muted max-w-md mx-auto mb-6">
              Detaillierte Spieler- und Mannschaftsstatistiken findest du auf
              handball.net. Dort werden alle Tore, Assists und weitere Kennzahlen
              der aktuellen Saison gepflegt.
            </p>
            <a
              href={EXTERNAL_LINKS.statistics}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <BarChart3 className="h-5 w-5" />
              Zu den Statistiken
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
