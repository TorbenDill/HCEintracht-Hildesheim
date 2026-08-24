import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Catering",
  description: "Catering beim HC Eintracht Hildesheim – Kulinarische Highlights an Spieltagen.",
};

export default function CateringPage() {
  return (
    <>
      <PageHeader
        title="Catering"
        subtitle="Kulinarische Highlights an Spieltagen"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Catering</h2>
                <p className="text-sm text-muted">Genuss beim Handball</p>
              </div>
            </div>

            <p className="text-muted mb-6 leading-relaxed">
              Unser Catering-Team sorgt für kulinarische Highlights bei jedem
              Heimspiel. Im VIP-Bereich erwartet Sie ein exklusives Buffet,
              während an den Verkaufsständen in der Halle eine vielfältige
              Auswahl an Speisen und Getränken angeboten wird.
            </p>

            <p className="text-muted mb-8 leading-relaxed">
              Für besondere Anlässe und Firmenevents bieten wir individuelle
              Catering-Lösungen an. Sprechen Sie uns gerne an.
            </p>

            <a href="/verein/kontakt" className="btn-primary">
              Catering anfragen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
