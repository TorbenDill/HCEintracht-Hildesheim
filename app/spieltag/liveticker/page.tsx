import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Liveticker",
  description:
    "Live-Ergebnisse und Ticker der Spiele des HC Eintracht Hildesheim.",
};

export default function LivetickerPage() {
  return (
    <>
      <PageHeader
        title="Liveticker"
        subtitle="Verfolge unsere Spiele in Echtzeit"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Radio className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">Liveticker</h2>
            <p className="text-muted max-w-md mx-auto mb-6">
              Der Liveticker ist während der Spieltage aktiv. Verfolge alle
              Tore, Strafen und wichtigen Spielszenen in Echtzeit über
              handball.net.
            </p>
            <a
              href="https://www.handball.net"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Zum Liveticker auf handball.net
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
