import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HandballWidget from "@/components/HandballWidget";

export const metadata: Metadata = {
  title: "Spielplan",
  description: "Der komplette Spielplan des HC Eintracht Hildesheim für die aktuelle Saison.",
};

export default function SpielplanPage() {
  return (
    <>
      <PageHeader
        title="Spielplan"
        subtitle="Alle Spiele der aktuellen Saison"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-6 md:p-8">
            <HandballWidget widget="spielplan" />
          </div>
        </div>
      </section>
    </>
  );
}
