import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "News",
  description:
    "Aktuelle Nachrichten und Neuigkeiten rund um den HC Eintracht Hildesheim.",
};

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Saisonvorbereitung 2026/27 gestartet",
    excerpt:
      "Die Mannschaft des HC Eintracht Hildesheim ist in die Vorbereitung auf die neue Saison gestartet. Trainer und Team sind hochmotiviert und arbeiten hart an der Fitness und Taktik.",
    date: "2026-08-20",
    category: "Mannschaft",
  },
  {
    id: 2,
    title: "Neuzugang verstärkt den Rückraum",
    excerpt:
      "Der HC Eintracht Hildesheim hat einen neuen Rüchraumspieler verpflichtet, der das Team in der kommenden Saison verstärken wird. Mehr Details folgen in Kürze.",
    date: "2026-08-18",
    category: "Transfer",
  },
  {
    id: 3,
    title: "Dauerkarten für die neue Saison verfügbar",
    excerpt:
      "Ab sofort können Dauerkarten für die Saison 2026/27 erworben werden. Sichert euch jetzt euren Stammplatz in der Halle und spart gegenüber Einzeltickets!",
    date: "2026-08-15",
    category: "Tickets",
  },
  {
    id: 4,
    title: "Jugendcamp in den Sommerferien",
    excerpt:
      "Auch in diesem Jahr veranstaltet der HC Eintracht Hildesheim ein Handballcamp für Kinder und Jugendliche. Anmeldungen sind ab sofort möglich.",
    date: "2026-08-10",
    category: "Jugend",
  },
  {
    id: 5,
    title: "Sponsorentreffen zum Saisonauftakt",
    excerpt:
      "Beim traditionellen Sponsorentreffen wurden die Pläne für die kommende Saison vorgestellt. Die Partner zeigten sich begeistert von den Entwicklungen im Verein.",
    date: "2026-08-05",
    category: "Business",
  },
  {
    id: 6,
    title: "Rückblick: Erfolgreiche letzte Saison",
    excerpt:
      "Die vergangene Saison war für den HC Eintracht Hildesheim ein voller Erfolg. Wir blicken zurück auf die Highlights und besonderen Momente.",
    date: "2026-07-28",
    category: "Verein",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHeader
        title="News"
        subtitle="Alle Neuigkeiten rund um den HC Eintracht Hildesheim"
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {NEWS_ITEMS.map((item) => (
              <article key={item.id} className="card overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
                  <span className="text-primary text-5xl font-black opacity-20">
                    HCE
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <time className="text-xs text-muted">{item.date}</time>
                  </div>
                  <h2 className="text-lg font-bold leading-snug mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
