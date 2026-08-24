import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Tv } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Livestream",
  description:
    "Livestream der Heimspiele des HC Eintracht Hildesheim via sporteurope.tv.",
};

export default function LivestreamPage() {
  return (
    <>
      <PageHeader
        title="Livestream"
        subtitle="Unsere Spiele live erleben – egal wo du bist"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Tv className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">Livestream</h2>
            <p className="text-muted max-w-md mx-auto mb-6">
              Die Heimspiele des HC Eintracht Hildesheim werden live auf
              sporteurope.tv übertragen. Erlebe alle Spiele bequem von zu Hause
              oder unterwegs.
            </p>
            <a
              href={EXTERNAL_LINKS.livestream}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <Tv className="h-5 w-5" />
              Zum Livestream
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
