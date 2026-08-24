import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fanshop",
  description: "Offizieller Fanshop des HC Eintracht Hildesheim – Trikots, Schals und mehr.",
};

export default function FanshopPage() {
  return (
    <>
      <PageHeader
        title="Fanshop"
        subtitle="Offizielle Fanartikel des HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">Offizieller Fanshop</h2>
            <p className="text-muted max-w-md mx-auto mb-6">
              Im offiziellen Fanshop findest du Trikots, Schals, Caps und viele
              weitere Fanartikel. Zeige deine Unterstützung für den HC Eintracht
              Hildesheim!
            </p>
            <a
              href={EXTERNAL_LINKS.shop}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ShoppingBag className="h-5 w-5" />
              Zum Fanshop
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
