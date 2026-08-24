import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Users,
  Trophy,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import HandballWidget from "@/components/HandballWidget";

const PLACEHOLDER_NEWS = [
  {
    id: 1,
    title: "Saisonvorbereitung 2026/27 gestartet",
    excerpt:
      "Die Mannschaft des HC Eintracht Hildesheim ist in die Vorbereitung auf die neue Saison gestartet. Trainer und Team sind hochmotiviert.",
    date: "2026-08-20",
    category: "Mannschaft",
  },
  {
    id: 2,
    title: "Neuzugang verstärkt den Rückraum",
    excerpt:
      "Der HC Eintracht Hildesheim hat einen neuen Rüchraumspieler verpflichtet, der das Team in der kommenden Saison verstärken wird.",
    date: "2026-08-18",
    category: "Transfer",
  },
  {
    id: 3,
    title: "Dauerkarten für die neue Saison verfügbar",
    excerpt:
      "Ab sofort können Dauerkarten für die Saison 2026/27 erworben werden. Sichert euch jetzt euren Stammplatz in der Halle!",
    date: "2026-08-15",
    category: "Tickets",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative bg-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark-light to-dark opacity-90" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-3xl">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">
              Handball aus Leidenschaft
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight">
              HC Eintracht
              <br />
              <span className="text-primary">Hildesheim</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-xl leading-relaxed">
              Willkommen beim HC Eintracht Hildesheim. Erlebe packenden
              Handballsport, leidenschaftliche Fans und eine starke
              Gemeinschaft.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/tickets/ticketshop" className="btn-primary">
                <Ticket className="h-5 w-5" />
                Tickets sichern
              </Link>
              <Link href="/spieltag" className="btn-outline">
                <Calendar className="h-5 w-5" />
                Spieltag
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold uppercase tracking-wider opacity-80">
                Nächstes Heimspiel
              </span>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">Saisonstart 2026/27</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>TBA</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Hildesheim</span>
              </div>
            </div>
            <Link
              href="/tickets/ticketshop"
              className="text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors"
            >
              Tickets kaufen
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-10">
            <SectionHeading
              title="Aktuelle News"
              subtitle="Die neuesten Nachrichten rund um den HC Eintracht Hildesheim"
            />
            <Link
              href="/news"
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              Alle News
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_NEWS.map((item) => (
              <article key={item.id} className="card overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-dark to-dark-light flex items-center justify-center">
                  <span className="text-primary text-5xl font-black opacity-20">
                    HCE
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <time className="text-xs text-muted">{item.date}</time>
                  </div>
                  <h3 className="text-lg font-bold leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/news" className="btn-primary">
              Alle News
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-surface-alt py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SectionHeading
                title="Tabelle"
                subtitle="Aktuelle Tabelle der laufenden Saison"
              />
              <div className="mt-8 card p-6">
                <HandballWidget widget="tabelle" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <SectionHeading title="Quicklinks" />
              <div className="mt-8 grid gap-4">
                {[
                  {
                    icon: Trophy,
                    label: "Spielplan",
                    desc: "Alle Spiele der Saison",
                    href: "/spieltag/spielplan",
                  },
                  {
                    icon: Users,
                    label: "Kader",
                    desc: "Unsere Mannschaft",
                    href: "/mannschaft/kader",
                  },
                  {
                    icon: Ticket,
                    label: "Ticketshop",
                    desc: "Tickets online kaufen",
                    href: "/tickets/ticketshop",
                  },
                  {
                    icon: MapPin,
                    label: "Hallenfinder",
                    desc: "So findest du uns",
                    href: "/verein/hallenfinder",
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="card flex items-center gap-4 p-4 group"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{link.label}</div>
                      <div className="text-xs text-muted">{link.desc}</div>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark text-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
            Werde Teil der{" "}
            <span className="text-primary">Eintracht-Familie</span>
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Unterstütze den HC Eintracht Hildesheim als Fan, Sponsor oder
            Mitglied. Gemeinsam sind wir stärker.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/tickets/dauerkarten" className="btn-primary">
              Dauerkarte sichern
            </Link>
            <Link href="/business" className="btn-outline border-white text-white hover:bg-white hover:text-dark">
              Business &amp; VIP
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
