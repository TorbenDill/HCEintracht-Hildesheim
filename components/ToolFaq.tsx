import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { safeJsonLd } from "@/lib/security";

export type FaqItem = { q: string; a: string };

/**
 * Serverseitig gerenderter FAQ-Block fuer die interaktiven Werkzeuge
 * (Simulator, Board-Editor) plus JSON-LD (WebApplication, FAQPage,
 * BreadcrumbList). Gibt Suchmaschinen und KI-Antwortmaschinen lesbaren Text,
 * obwohl das Werkzeug selbst erst im Browser entsteht.
 */
export default function ToolFaq({
  name,
  path,
  description,
  heading,
  items,
}: {
  name: string;
  path: string;
  description: string;
  heading: string;
  items: FaqItem[];
}) {
  const url = absoluteUrl(path);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name,
        url,
        description,
        applicationCategory: "SportsApplication",
        operatingSystem: "Web",
        inLanguage: "de-DE",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
      },
      {
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Draft Board", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };

  return (
    <section aria-labelledby="tool-faq" className="no-print mt-14 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <h2 id="tool-faq" className="mb-4 font-display text-2xl font-semibold uppercase tracking-tight text-foreground">
        {heading}
      </h2>
      <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-foreground marker:hidden">
              <span className="mr-2 text-primary transition-transform group-open:rotate-90 inline-block">›</span>
              {f.q}
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
