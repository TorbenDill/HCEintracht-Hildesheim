import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { ShoppingCart } from "lucide-react";

export const metadata: Metadata = {
  title: "Ticketshop",
  description:
    "Online-Ticketshop des HC Eintracht Hildesheim – Kaufe deine Eintrittskarten bequem online.",
};

export default function TicketshopPage() {
  return (
    <>
      <PageHeader
        title="Ticketshop"
        subtitle="Tickets für alle Heimspiele online kaufen"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-3">Online Ticketshop</h2>
            <p className="text-muted max-w-lg mx-auto mb-8">
              Hier kannst du Tickets für die Heimspiele des HC Eintracht
              Hildesheim erwerben. Wähle dein Spiel, deinen Platz und sichere
              dir dein Erlebnis in der Halle.
            </p>
            <div className="rounded-lg border-2 border-dashed border-border p-12 text-muted text-sm">
              Ticketshop-Integration wird hier eingebunden.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
