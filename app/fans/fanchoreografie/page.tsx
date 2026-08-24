import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Palette, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Fanchoreografie",
  description: "Fanchoreografien beim HC Eintracht Hildesheim – Gemeinsam für unsere Mannschaft.",
};

export default function FanchoreografiePage() {
  return (
    <>
      <PageHeader
        title="Fanchoreografie"
        subtitle="Gemeinsam sorgen wir für Gänsehaut in der Halle"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Palette className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Choreografien & Aktionen</h2>
                <p className="text-sm text-muted">Support aus dem Herzen</p>
              </div>
            </div>

            <p className="text-muted mb-6 leading-relaxed">
              Die Fans des HC Eintracht Hildesheim sind bekannt für ihre
              leidenschaftliche Unterstützung. Regelmäßig werden Choreografien
              und Aktionen organisiert, die die Halle in ein Farbenmeer verwandeln
              und der Mannschaft den nötigen Rückhalt geben.
            </p>

            <p className="text-muted mb-8 leading-relaxed">
              Du möchtest bei der nächsten Choreografie mitwirken oder hast eine
              Idee? Melde dich bei uns!
            </p>

            <div className="flex items-center gap-2 text-sm text-primary font-semibold">
              <Heart className="h-5 w-5" />
              <span>Gemeinsam für Eintracht!</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
