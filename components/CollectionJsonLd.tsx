import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { safeJsonLd } from "@/lib/security";

/**
 * JSON-LD fuer Uebersichtsseiten: CollectionPage mit ItemList (oder
 * DefinedTermSet fuers Lexikon) plus BreadcrumbList.
 */
export default function CollectionJsonLd({
  name,
  path,
  description,
  items,
  termSet = false,
}: {
  name: string;
  path: string;
  description: string;
  items: { name: string; path: string; description?: string }[];
  termSet?: boolean;
}) {
  const url = absoluteUrl(path);
  const list = termSet
    ? {
        "@type": "DefinedTermSet",
        "@id": `${url}#set`,
        name,
        hasDefinedTerm: items.map((i) => ({
          "@type": "DefinedTerm",
          name: i.name,
          url: absoluteUrl(i.path),
          ...(i.description ? { description: i.description } : {}),
        })),
      }
    : {
        "@type": "ItemList",
        "@id": `${url}#liste`,
        numberOfItems: items.length,
        itemListElement: items.map((i, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: i.name,
          url: absoluteUrl(i.path),
        })),
      };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": url,
        url,
        name,
        description,
        inLanguage: "de-DE",
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
        mainEntity: { "@id": list["@id"] },
      },
      list,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Draft Board", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />;
}
