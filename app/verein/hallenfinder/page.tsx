import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { MapPin, Car, Train, ParkingSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Hallenfinder",
  description: "Anfahrt zur Spielstätte des HC Eintracht Hildesheim.",
};

export default function HallenfinderPage() {
  return (
    <>
      <PageHeader
        title="Hallenfinder"
        subtitle="So findest du uns"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6 space-y-8">
          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold">Adresse</h2>
            </div>
            <p className="text-muted">
              Die genaue Adresse der Spielstätte wird hier bekannt gegeben.
              <br />
              Hildesheim, Niedersachsen
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">Mit dem Auto</h2>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Hildesheim ist über die A7 gut erreichbar. Nehmen Sie die
                Ausfahrt Hildesheim und folgen Sie der Beschilderung zur
                Sporthalle. Parkplätze stehen in begrenzter Anzahl zur Verfügung.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Train className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">Mit der Bahn</h2>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Vom Hauptbahnhof Hildesheim ist die Halle gut mit öffentlichen
                Verkehrsmitteln erreichbar. Mehrere Buslinien halten in der Nähe
                der Spielstätte.
              </p>
            </div>
          </div>

          <div className="card p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <ParkingSquare className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold">Parken</h2>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Kostenlose Parkplätze stehen in begrenzter Anzahl direkt an der
              Halle zur Verfügung. Weitere Parkmöglichkeiten finden sich in der
              näheren Umgebung. Bei ausverkauften Spielen empfehlen wir eine
              frühzeitige Anreise oder die Nutzung öffentlicher Verkehrsmittel.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
