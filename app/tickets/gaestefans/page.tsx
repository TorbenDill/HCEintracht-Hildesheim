import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { MapPin, Ticket, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Gästefans",
  description:
    "Informationen für Gästefans des HC Eintracht Hildesheim – Tickets, Anreise und mehr.",
};

export default function GaestefansPage() {
  return (
    <>
      <PageHeader
        title="Gästefans"
        subtitle="Willkommen in Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 space-y-8">
          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Ticket className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold">Tickets für Gästefans</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Gästetickets sind über den Ticketshop des HC Eintracht Hildesheim
              erhältlich. Wir empfehlen eine frühzeitige Buchung, da die
              Kapazitäten im Gästeblock begrenzt sind. Bei ausverkauften Spielen
              können keine Tickets an der Tageskasse garantiert werden.
            </p>
          </div>

          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold">Anreise</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              Informationen zur Anreise mit dem Auto und öffentlichen
              Verkehrsmitteln findest du auf unserer Hallenfinder-Seite. Dort
              gibt es auch Hinweise zu Parkmöglichkeiten.
            </p>
            <a href="/verein/hallenfinder" className="btn-outline text-sm">
              <MapPin className="h-4 w-4" />
              Zum Hallenfinder
            </a>
          </div>

          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Info className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold">Hallenordnung</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Bitte beachtet die Hallenordnung. Pyrotechnik und
              gefährliche Gegenstände sind nicht erlaubt. Wir bitten alle
              Gäste um sportlich fairen Umgang miteinander.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
