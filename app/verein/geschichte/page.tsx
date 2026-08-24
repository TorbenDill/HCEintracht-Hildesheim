import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { History } from "lucide-react";

export const metadata: Metadata = {
  title: "Geschichte",
  description: "Die Geschichte des HC Eintracht Hildesheim – Von der Gründung bis heute.",
};

export default function GeschichtePage() {
  return (
    <>
      <PageHeader
        title="Geschichte"
        subtitle="Die Geschichte des HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <History className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Unsere Geschichte</h2>
            </div>

            <div className="prose prose-sm max-w-none space-y-6">
              <p className="text-muted leading-relaxed">
                Der HC Eintracht Hildesheim blickt auf eine bewegte Geschichte
                zurück. Was als kleine Handballabteilung begann, hat sich zu einem
                festen Bestandteil der Handballlandschaft in Niedersachsen
                entwickelt.
              </p>

              <p className="text-muted leading-relaxed">
                Mit dem Wolf &quot;Lupo&quot; als Maskottchen und treuen Fans im
                Rücken hat der Verein über die Jahre zahlreiche sportliche Erfolge
                gefeiert und sich in der Region fest etabliert.
              </p>

              <p className="text-muted leading-relaxed">
                Heute steht der HC Eintracht Hildesheim für modernen,
                leidenschaftlichen Handballsport, engagierte Jugendarbeit und
                eine enge Verbindung zur Stadt und Region Hildesheim.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
