import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import HandballWidget from "@/components/HandballWidget";

export const metadata: Metadata = {
  title: "Tabelle",
  description: "Aktuelle Tabelle des HC Eintracht Hildesheim in der laufenden Saison.",
};

export default function TabellePage() {
  return (
    <>
      <PageHeader title="Tabelle" subtitle="Aktuelle Tabellenplatzierung" />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-6 md:p-8">
            <HandballWidget widget="tabelle" />
          </div>
        </div>
      </section>
    </>
  );
}
