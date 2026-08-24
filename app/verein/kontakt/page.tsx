import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontakt zum HC Eintracht Hildesheim – Geschäftsstelle, Anfragen und Social Media.",
};

export default function KontaktPage() {
  return (
    <>
      <PageHeader
        title="Kontakt"
        subtitle="Wir freuen uns auf deine Nachricht"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">E-Mail</h2>
              </div>
              <p className="text-sm text-muted">
                Für allgemeine Anfragen erreichst du uns unter:
              </p>
              <a
                href="mailto:info@hceintracht-hildesheim.de"
                className="text-primary font-semibold text-sm hover:underline mt-2 inline-block"
              >
                info@hceintracht-hildesheim.de
              </a>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">Telefon</h2>
              </div>
              <p className="text-sm text-muted">
                Die Geschäftsstelle ist telefonisch erreichbar.
                Sprechzeiten werden hier bekannt gegeben.
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">Anschrift</h2>
              </div>
              <p className="text-sm text-muted">
                HC Eintracht Hildesheim e.V.
                <br />
                Hildesheim
                <br />
                Niedersachsen
              </p>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-bold">Social Media</h2>
              </div>
              <div className="space-y-2">
                <a
                  href={EXTERNAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-semibold hover:underline block"
                >
                  Instagram
                </a>
                <a
                  href={EXTERNAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary font-semibold hover:underline block"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
