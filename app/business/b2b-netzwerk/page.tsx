import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Handshake, Users, Calendar, Building } from "lucide-react";

export const metadata: Metadata = {
  title: "B2B-Netzwerk",
  description: "B2B-Netzwerk des HC Eintracht Hildesheim – Networking und Kontakte für Unternehmen.",
};

export default function B2BNetzwerkPage() {
  return (
    <>
      <PageHeader
        title="B2B-Netzwerk"
        subtitle="Vernetze dich mit der Wirtschaft Hildesheims"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="card p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Handshake className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Business-Netzwerk</h2>
                <p className="text-sm text-muted">Kontakte knüpfen beim Handball</p>
              </div>
            </div>

            <p className="text-muted mb-8 leading-relaxed">
              Unser B2B-Netzwerk bringt Unternehmen aus Hildesheim und der Region
              zusammen. Regelmäßige Netzwerkveranstaltungen vor und nach den Heimspielen
              bieten die ideale Plattform für den geschäftlichen Austausch in
              lockerer Atmosphäre.
            </p>

            <div className="grid gap-6 sm:grid-cols-3 mb-8">
              {[
                { icon: Users, label: "50+ Partnerunternehmen" },
                { icon: Calendar, label: "Regelmäßige Events" },
                { icon: Building, label: "Regionale Vernetzung" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              ))}
            </div>

            <a href="/verein/kontakt" className="btn-primary">
              Jetzt Mitglied werden
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
