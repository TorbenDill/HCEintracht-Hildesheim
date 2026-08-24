import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Megaphone, Monitor, Shirt, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "Werbemöglichkeiten",
  description: "Werbemöglichkeiten beim HC Eintracht Hildesheim – Bandenwerbung, Trikotsponsoring und mehr.",
};

const OPTIONS = [
  {
    icon: LayoutGrid,
    title: "Bandenwerbung",
    description: "Platziere dein Logo an den Banden der Spielhalle und erreiche Tausende von Zuschauern pro Heimspiel.",
  },
  {
    icon: Shirt,
    title: "Trikotsponsoring",
    description: "Dein Logo auf den Trikots unserer Mannschaft – maximale Sichtbarkeit bei jedem Spiel.",
  },
  {
    icon: Monitor,
    title: "Digitale Werbung",
    description: "Präsenz auf unserer Website, in Social Media und im Livestream für maximale digitale Reichweite.",
  },
  {
    icon: Megaphone,
    title: "Eventsponsoring",
    description: "Sponsor einzelner Heimspiele oder Veranstaltungen mit exklusiven Branding-Möglichkeiten.",
  },
];

export default function WerbemoeglichkeitenPage() {
  return (
    <>
      <PageHeader
        title="Werbemöglichkeiten"
        subtitle="Erreiche dein Publikum mit dem HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {OPTIONS.map((option) => (
              <div key={option.title} className="card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <option.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold mb-2">{option.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{option.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted mb-4">
              Interesse an einer Zusammenarbeit? Wir freuen uns auf deine Anfrage.
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
