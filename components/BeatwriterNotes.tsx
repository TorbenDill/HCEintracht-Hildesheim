import { getBeatNotes } from "@/lib/beatwriters";
import { safeExternalUrl } from "@/lib/security";
import { cn } from "@/lib/utils";

function germanDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return d ? `${d}.${m}.${y}` : iso;
}

/** Abschnitt "Aus den Team-Beats" auf der Spielerseite (Server-Komponente). */
export default function BeatwriterNotes({ slug }: { slug: string }) {
  const notes = getBeatNotes(slug);
  if (notes.length === 0) return null;

  return (
    <section aria-labelledby="beat-titel" className="mb-10">
      <h2 id="beat-titel" className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-primary">
        Aus den Team-Beats
      </h2>
      <p className="mb-4 max-w-2xl text-xs leading-relaxed text-muted">
        Was Reporter, die ein NFL-Team täglich begleiten, über diesen Prospect schreiben – sinngemäß
        auf Deutsch zusammengefasst und von uns nach Aussagekraft eingeordnet: „Hohe Aussagekraft“ heißt
        eigene Spielanalyse oder Informationen aus dem Teamumfeld (etwa belegte Scouting-Besuche), „Einordnung“
        eine begründete Meinung. Bloße Erwähnungen nehmen wir nicht auf. Der Originalartikel ist jeweils verlinkt.
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {notes.map((n) => (
          <li key={`${n.writer}-${n.url}`} className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-foreground px-2 py-0.5 font-mono text-[10px] font-bold text-background">
                {n.team}
              </span>
              <span className="min-w-0 truncate text-sm font-bold text-foreground">{n.by.writer}</span>
              {n.by.glaubwuerdigkeit === "niedrig" && (
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  Fanseite
                </span>
              )}
              <span
                className={cn(
                  "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  n.wert === "hoch" ? "bg-accent-glow text-accent" : "bg-surface-light text-muted"
                )}
                title={n.begruendung || undefined}
              >
                {n.wert === "hoch" ? "Hohe Aussagekraft" : "Einordnung"}
              </span>
            </div>
            <p className="mb-3 break-words text-sm leading-relaxed text-foreground/85">{n.text}</p>
            <p className="mt-auto break-words text-[11px] text-muted">
              {n.by.outlet} · {germanDate(n.datum)} ·{" "}
              <a
                href={safeExternalUrl(n.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-primary hover:underline"
              >
                {n.titel ? `„${n.titel}“` : "Artikel"} ↗
              </a>
              {n.by.paywall === "ja" && " (Paywall)"}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
