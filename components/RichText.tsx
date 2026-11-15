import Link from "next/link";
import type { ReactNode } from "react";

// Minimal-Markup fuer redaktionelle Texte (Lexikon): Absaetze durch Leerzeile,
// Listen mit "- " am Zeilenanfang, interne Links als [Text](/pfad).
// Externe oder relative Ziele werden bewusst als reiner Text ausgegeben.
const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK)) {
    const [whole, label, href] = m;
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    out.push(
      isInternal(href) ? (
        <Link
          key={`${keyBase}-${i++}`}
          href={href}
          className="font-semibold text-primary-dark underline underline-offset-2 hover:text-primary"
        >
          {label}
        </Link>
      ) : (
        label
      ),
    );
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Entfernt das Link-Markup (fuer JSON-LD und Meta-Texte). */
export function plainText(text: string): string {
  return text.replace(LINK, "$1").replace(/^- /gm, "").replace(/\s*\n+\s*/g, " ").trim();
}

export default function RichText({
  text,
  className = "text-[15px] leading-relaxed text-foreground/85",
}: {
  text: string;
  className?: string;
}) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={bi} className={`list-disc space-y-2 pl-5 marker:text-primary ${className}`}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.slice(2), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className={className}>
            {inline(lines.join(" "), String(bi))}
          </p>
        );
      })}
    </div>
  );
}
