import Link from "next/link";
import lexikon from "@/data/lexikon.json";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "NFL Draft Lexikon: Scouting-Begriffe auf Deutsch erklärt",
  description:
    "Was ist ein 3-Technique? Was bedeutet Cover 3? RAS Score, Senior Bowl, Draft Grades und alle wichtigen Scouting-Begriffe ausführlich auf Deutsch erklärt.",
  alternates: { canonical: "/lexikon" },
};

type Entry = {
  slug: string;
  term: string;
  category: string;
  kurz: string;
  text: string;
};

export default function LexikonPage() {
  const entries = lexikon as Entry[];
  const categories = Array.from(new Set(entries.map((e) => e.category)));

  return (
    <main className="min-h-screen bg-background">

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-10">
          <h1 className="mb-3 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
            Draft-<span className="text-primary">Lexikon</span>
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">
            Von 3-Technique bis YAC: die wichtigsten Begriffe aus Scouting und
            Draft-Prozess, ausführlich auf Deutsch erklärt. Das Lexikon wächst
            mit jedem Update weiter.
          </p>
        </div>

        {categories.map((cat) => (
          <Reveal key={cat} className="mb-10">
            <h2 className="mb-4 text-lg font-black tracking-tight text-foreground">
              {cat}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {entries
                .filter((e) => e.category === cat)
                .map((e) => (
                  <Link
                    key={e.slug}
                    href={`/lexikon/${e.slug}`}
                    className="card-lift group rounded-xl border border-border bg-surface p-5 hover:border-primary/50"
                  >
                    <h3 className="mb-1 text-base font-bold text-foreground group-hover:text-primary">
                      {e.term}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted">
                      {e.kurz}
                    </p>
                  </Link>
                ))}
            </div>
          </Reveal>
        ))}

      </div>
    </main>
  );
}
