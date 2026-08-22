// Zieht den Text aus dem D2CCA-All-America-PDF. Die Eintraege stehen dort in
// Spalten, deshalb wird pro Zeile (gleiche y-Position) zusammengefasst.
//
// BRAUCHT pdfjs-dist, das bewusst KEINE Dependency des Projekts ist - dieses
// Skript laeuft einmal pro Saison. Vorbereitung in einem Arbeitsordner:
//   npm init -y && npm install pdfjs-dist@4.10.38
// Die Rohdatei d2cca.pdf danebenlegen; die echte PDF-Adresse steht im
// Quelltext der Sidearm-Wrapper-Seite (siehe README).
import fs from "node:fs";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const data = new Uint8Array(fs.readFileSync(process.argv[2] ?? "d2cca.pdf"));
const doc = await getDocument({ data, useSystemFonts: true }).promise;
console.log("Seiten:", doc.numPages);

const lines = [];
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const byY = new Map();
  for (const item of content.items) {
    if (!item.str?.trim()) continue;
    const y = Math.round(item.transform[5]); // gleiche Zeile = gleiche y-Position
    if (!byY.has(y)) byY.set(y, []);
    byY.get(y).push({ x: item.transform[4], s: item.str });
  }
  const ordered = [...byY.entries()].sort((a, b) => b[0] - a[0]);
  for (const [, parts] of ordered) {
    const text = parts.sort((a, b) => a.x - b.x).map((p) => p.s).join(" ").replace(/\s+/g, " ").trim();
    if (text) lines.push({ page: i, text });
  }
}

fs.writeFileSync("d2cca-lines.json", JSON.stringify(lines, null, 1));
console.log("Zeilen:", lines.length);
lines.slice(0, 25).forEach((l) => console.log(` p${l.page}: ${l.text}`));
