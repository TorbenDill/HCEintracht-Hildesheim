import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export type Crumb = { name: string; href?: string };

/**
 * Sichtbare Breadcrumb-Navigation plus BreadcrumbList-JSON-LD. Verbessert
 * Orientierung, interne Verlinkung und liefert Google eine klare Hierarchie
 * (Breadcrumb-Rich-Result). Das letzte Element ist die aktuelle Seite.
 */
export default function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-[11px] uppercase tracking-wider ${className}`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${it.name}-${i}`} className="flex items-center gap-1.5">
              {it.href && !last ? (
                <Link
                  href={it.href}
                  className="text-muted transition-colors hover:text-primary"
                >
                  {it.name}
                </Link>
              ) : (
                <span
                  className="text-foreground/70"
                  aria-current={last ? "page" : undefined}
                >
                  {it.name}
                </span>
              )}
              {!last && <span className="text-muted/40">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
