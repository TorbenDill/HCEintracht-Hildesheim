import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { Users, Calendar, Trophy, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Jugend",
  description: "Die Jugendabteilung des HC Eintracht Hildesheim – Nachwuchsförderung und Jugendmannschaften.",
};

const TEAMS = [
  { name: "A-Jugend", description: "U18 – Unsere älteste Jugendmannschaft" },
  { name: "B-Jugend", description: "U16 – Talente auf dem Weg nach oben" },
  { name: "C-Jugend", description: "U14 – Technik und Taktik im Fokus" },
  { name: "D-Jugend", description: "U12 – Spielerische Grundlagen" },
  { name: "E-Jugend", description: "U10 – Erste Schritte im Handball" },
  { name: "Minis", description: "U8 – Spaß und Bewegung stehen im Vordergrund" },
];

export default function JugendPage() {
  return (
    <>
      <PageHeader
        title="Jugend"
        subtitle="Nachwuchsförderung beim HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {[
              { icon: Users, label: "Jugendteams", value: "6" },
              { icon: Heart, label: "Aktive Spieler", value: "100+" },
              { icon: Calendar, label: "Trainingseinheiten/Woche", value: "12+" },
              { icon: Trophy, label: "Turniere/Saison", value: "20+" },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-black text-primary">{stat.value}</div>
                <div className="text-sm text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-black uppercase tracking-wide mb-6">
            Unsere Jugendmannschaften
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TEAMS.map((team) => (
              <div key={team.name} className="card p-5">
                <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                <p className="text-sm text-muted">{team.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 card p-8 bg-primary/5 border border-primary/20">
            <h2 className="text-xl font-bold mb-3">Lust auf Handball?</h2>
            <p className="text-sm text-muted mb-4 max-w-xl">
              Dein Kind möchte Handball spielen? Bei uns kann jeder mitmachen!
              Komm einfach zum Probetraining vorbei oder kontaktiere uns für
              weitere Informationen.
            </p>
            <a href="/verein/kontakt" className="btn-primary">
              Kontakt aufnehmen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
