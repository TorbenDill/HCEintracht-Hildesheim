import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import lexikon from "@/data/lexikon.json";
import { absoluteUrl } from "@/lib/site";
import AdSense from "@/components/AdSense";

type Entry = {
  slug: string;
  term: string;
  category: string;
  kurz: string;
  text: string;
};

const entries = lexikon as Entry[];

export function generateStaticParams() {
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) return { title: "Begriff nicht gefunden" };
  const title = `${entry.term} einfach erklärt`;
  return {
    title,
    description: entry.kurz,
    alternates: { canonical: `/lexikon/${entry.slug}` },
    openGraph: {
      type: "article",
      title,
      description: entry.kurz,
      url: absoluteUrl(`/lexikon/${entry.slug}`),
    },
  };
}

export default async function LexikonEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) notFound();

  const related = entries.filter((e) => e.slug !== entry.slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.kurz,
    url: absoluteUrl(`/lexikon/${entry.slug}`),
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "NFL Draft Lexikon",
      url: absoluteUrl("/lexikon"),
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-3">
          <Link
            href="/lexikon"
            className="text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary"
          >
            &larr; Lexikon
          </Link>
          <span className="text-muted/30">|</span>
          <span className="text-xs uppercase tracking-wider text-primary">
            {entry.category}
          </span>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="mb-4 font-display text-4xl font-semibold uppercase tracking-tight text-foreground lg:text-5xl">
          {entry.term}
        </h1>
        <p className="mb-8 border-l-2 border-primary pl-4 text-base font-medium leading-relaxed text-foreground/90">
          {entry.kurz}
        </p>

        <div className="space-y-5">
          {entry.text.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-foreground/85"
            >
              {para}
            </p>
          ))}
        </div>

        <AdSense slot="6888694163" layout="in-article" className="my-10" />

        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-sm font-black tracking-tight text-foreground">
            Weitere Begriffe
          </h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/lexikon/${r.slug}`}
                className="rounded-full border border-border bg-background px-4 py-2 text-xs font-bold text-muted transition-all hover:border-primary hover:text-primary"
              >
                {r.term}
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted">
            Begriffe live sehen? Auf dem{" "}
            <Link href="/" className="text-primary hover:underline">
              Big Board 2027
            </Link>{" "}
            und in den Spielerprofilen werden sie angewendet.
          </p>
        </section>
      </article>
    </main>
  );
}
