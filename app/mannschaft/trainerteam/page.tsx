import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import kaderData from "@/data/kader.json";

export const metadata: Metadata = {
  title: "Trainerteam",
  description: "Das Trainerteam des HC Eintracht Hildesheim.",
};

export default function TrainerteamPage() {
  return (
    <>
      <PageHeader
        title="Trainerteam"
        subtitle="Unsere Trainer und Betreuer"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {kaderData.trainer.map((trainer) => (
              <div key={trainer.name} className="card overflow-hidden">
                <div className="h-56 bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
                  <span className="text-5xl font-black text-primary/20">
                    HCE
                  </span>
                </div>
                <div className="p-5">
                  <div className="text-xs font-bold text-primary mb-1">
                    {trainer.rolle}
                  </div>
                  <h3 className="text-lg font-bold">{trainer.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
