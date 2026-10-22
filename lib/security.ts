// Sicherheits-Helfer fuer Inhalte, die aus Daten-Dateien (Recherche-Pipeline,
// Web-Crawls, KI-Wochen-Update) ins HTML gelangen. Die Daten gelten als
// "halb vertrauenswuerdig": Sie werden zwar per Build-Gate geprueft, stammen
// aber letztlich aus fremden Webseiten.

/**
 * JSON fuer <script type="application/ld+json"> sicher serialisieren.
 * JSON.stringify escaped "<" nicht – ein Datenwert wie "</script><script>…"
 * wuerde sonst den Script-Block beenden und eigenes HTML/JS einschleusen.
 * Die Unicode-Escapes sind gueltiges JSON und aendern den Inhalt nicht.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Externe Link-URL aus Daten absichern: nur http(s) zulassen. Verhindert
 * "javascript:"/"data:"-Links, falls je ein manipulierter Wert in die Daten
 * gelangt. Ungueltige Werte werden zu "#".
 */
export function safeExternalUrl(url: string | null | undefined): string {
  if (!url) return "#";
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? url : "#";
  } catch {
    return "#";
  }
}
