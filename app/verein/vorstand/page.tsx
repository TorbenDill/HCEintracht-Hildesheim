import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Vorstand",
  description: "Der Vorstand des HC Eintracht Hildesheim.",
};

const VORSTAND = [
  { name: "1. Vorsitzender", rolle: "1. Vorsitzender" },
  { name: "2. Vorsitzender", rolle: "2. Vorsitzender" },
  { name: "Kassenwart", rolle: "Kassenwart" },
  { name: "Sportwart", rolle: "Sportwart" },
  { name: "Jugendwart", rolle: "Jugendwart" },
  { name: "Pressewart", rolle: "Pressewart" },
];

export default function VorstandPage() {
  return (
    <>
      <PageHeader
        title="Vorstand"
        subtitle="Die Verantwortlichen des HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VORSTAND.map((person) => (
              <div key={person.rolle} className="card p-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-dark to-dark-light flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-black text-primary/40">
                    {person.name.charAt(0)}
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-base">{person.name}</h3>
                  <p className="text-sm text-primary font-semibold mt-1">
                    {person.rolle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
