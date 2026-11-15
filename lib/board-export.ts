// Downloads fuer "Mein Big Board": PNG fuer Social Media (Feed 4:5, Story
// 9:16) und PDF fuer den eigenen Draft. Alles laeuft im Browser ueber
// <canvas>; das PDF wird ohne Fremdbibliothek erzeugt (JPEG-Seiten in einem
// minimalen PDF-Container), damit kein zusaetzlicher Code nachgeladen wird
// und die Hausschriften (Oswald/Archivo) erhalten bleiben.

import type { BoardItem, MyBoard, PlayerNote } from "@/lib/my-board";
import type { MinPlayer } from "@/lib/players-min";

export type ExportRow = {
  item: BoardItem;
  rank?: number;
  posRank?: number;
  delta?: number;
  p?: MinPlayer;
};

// CI der Seite (app/globals.css)
const C = {
  bg: "#f7f7f6",
  fg: "#17181a",
  muted: "#5f646c",
  primary: "#c2410c",
  primaryDark: "#9a3412",
  accent: "#047857",
  red: "#b91c1c",
  surface: "#ffffff",
  border: "#e2e1df",
  light: "#ededec",
};
const DISPLAY = "'Oswald Variable', 'Archivo Variable', sans-serif";
const SANS = "'Archivo Variable', system-ui, sans-serif";
const MONO = "'JetBrains Mono Variable', ui-monospace, monospace";

async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load(`600 40px ${DISPLAY}`),
      document.fonts.load(`700 20px ${SANS}`),
      document.fonts.load(`500 20px ${SANS}`),
      document.fonts.load(`700 20px ${MONO}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* Fallback-Schriften reichen */
  }
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width <= max) line = test;
      else {
        if (line) out.push(line);
        line = ctx.measureText(word).width > max ? fit(ctx, word, max) : word;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

function deltaLabel(d: number): string {
  return d > 0 ? `▲${d}` : d < 0 ? `▼${-d}` : "=";
}
function deltaColor(d: number): string {
  return d > 0 ? C.accent : d < 0 ? C.red : C.muted;
}

function germanDate(d = new Date()): string {
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function canvasToBlob(c: HTMLCanvasElement, type: string, q?: number): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), type, q));
}

// ---- PNG (Social Media) ----------------------------------------------------

export type PngFormat = "feed" | "story";

export async function renderBoardPng(board: MyBoard, rows: readonly ExportRow[], format: PngFormat): Promise<Blob> {
  await fontsReady();
  const W = 1080;
  const H = format === "story" ? 1920 : 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("canvas");

  // Hintergrund + Kopfband
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  const headH = format === "story" ? 300 : 200;
  ctx.fillStyle = C.fg;
  ctx.fillRect(0, 0, W, headH);
  ctx.fillStyle = C.primary;
  ctx.fillRect(0, headH, W, 10);

  const pad = 60;
  const topY = format === "story" ? 120 : 70;
  ctx.fillStyle = C.primary;
  ctx.font = `600 24px ${DISPLAY}`;
  ctx.fillText("NFL DRAFT BOARD 2027", pad, topY);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 ${format === "story" ? 76 : 62}px ${DISPLAY}`;
  ctx.fillText(fit(ctx, board.name.toUpperCase(), W - pad * 2), pad, topY + (format === "story" ? 92 : 76));
  ctx.fillStyle = "#b9bbbf";
  ctx.font = `500 22px ${SANS}`;
  ctx.fillText(`Meine Top 32 · Stand ${germanDate()}`, pad, topY + (format === "story" ? 140 : 112));

  // Top 32 in zwei Spalten
  const players = rows.filter((r) => r.item.type === "player" && r.p).slice(0, 32);
  const gap = 24;
  const colW = (W - pad * 2 - gap) / 2;
  const top = headH + 40;
  const footer = format === "story" ? 170 : 90;
  const rowH = Math.floor((H - top - footer) / 16);
  const boxH = rowH - 8;
  players.forEach((r, i) => {
    const col = i < 16 ? 0 : 1;
    const x = pad + col * (colW + gap);
    const y = top + (i % 16) * rowH;
    ctx.fillStyle = C.surface;
    ctx.fillRect(x, y, colW, boxH);
    ctx.fillStyle = i < 10 ? C.primary : C.border;
    ctx.fillRect(x, y, 6, boxH);

    const mid = y + boxH / 2;
    ctx.textBaseline = "middle";
    ctx.fillStyle = C.primary;
    ctx.font = `700 ${format === "story" ? 30 : 26}px ${MONO}`;
    ctx.fillText(String(r.rank), x + 20, mid);

    const nameX = x + 78;
    const right = 70;
    ctx.fillStyle = C.fg;
    ctx.font = `700 ${format === "story" ? 23 : 20}px ${SANS}`;
    ctx.fillText(fit(ctx, r.p!.name.toUpperCase(), colW - (nameX - x) - right), nameX, mid - (format === "story" ? 15 : 11));
    ctx.fillStyle = C.muted;
    ctx.font = `500 ${format === "story" ? 18 : 15}px ${SANS}`;
    ctx.fillText(fit(ctx, `${r.p!.position} · ${r.p!.college}`, colW - (nameX - x) - right), nameX, mid + (format === "story" ? 16 : 12));

    const d = r.delta ?? 0;
    const lbl = deltaLabel(d);
    ctx.font = `700 17px ${MONO}`;
    ctx.fillStyle = deltaColor(d);
    ctx.fillText(lbl, x + colW - 16 - ctx.measureText(lbl).width, mid);
    ctx.textBaseline = "alphabetic";
  });

  // Fusszeile
  const fy = H - footer / 2 + 8;
  ctx.fillStyle = C.muted;
  ctx.font = `500 18px ${SANS}`;
  ctx.fillText("▲/▼ Abweichung vom Consensus", pad, fy);
  ctx.fillStyle = C.fg;
  ctx.font = `700 22px ${SANS}`;
  const url = "nfldraft-scouting.de/mein-board";
  ctx.fillText(url, W - pad - ctx.measureText(url).width, fy);

  return canvasToBlob(c, "image/png");
}

// ---- PDF (eigener Draft) ---------------------------------------------------

const PT_W = 595.28; // A4 in Punkt
const PT_H = 841.89;
const SCALE = 2.2; // Pixel je Punkt (~158 dpi)

function noteLines(ctx: CanvasRenderingContext2D, n: PlayerNote | undefined, width: number): { label: string; color: string; lines: string[] }[] {
  if (!n) return [];
  const out: { label: string; color: string; lines: string[] }[] = [];
  ctx.font = `400 8.5px ${SANS}`;
  if (n.plus) out.push({ label: "Stärken", color: C.accent, lines: wrap(ctx, n.plus, width) });
  if (n.minus) out.push({ label: "Schwächen", color: C.red, lines: wrap(ctx, n.minus, width) });
  if (n.text) out.push({ label: "Notiz", color: C.muted, lines: wrap(ctx, n.text, width) });
  return out;
}

export async function renderBoardPdf(board: MyBoard, rows: readonly ExportRow[]): Promise<Blob> {
  await fontsReady();
  const M = 36; // Seitenrand
  const contentW = PT_W - M * 2;
  const pages: HTMLCanvasElement[] = [];
  let ctx!: CanvasRenderingContext2D;
  let y = 0;

  // Spalten (x relativ zum Rand)
  const col = { check: 0, rank: 18, name: 50, pos: 212, cons: 350, delta: 390, round: 430 };
  const notesX = col.name;
  const notesW = contentW - notesX;

  const newPage = () => {
    const c = document.createElement("canvas");
    c.width = Math.round(PT_W * SCALE);
    c.height = Math.round(PT_H * SCALE);
    const g = c.getContext("2d");
    if (!g) throw new Error("canvas");
    g.scale(SCALE, SCALE);
    g.fillStyle = "#ffffff";
    g.fillRect(0, 0, PT_W, PT_H);
    pages.push(c);
    ctx = g;
    // Kopf
    g.fillStyle = C.fg;
    g.fillRect(0, 0, PT_W, 58);
    g.fillStyle = C.primary;
    g.fillRect(0, 58, PT_W, 3);
    g.fillStyle = C.primary;
    g.font = `600 8px ${DISPLAY}`;
    g.fillText("NFL DRAFT BOARD 2027 · MEIN BIG BOARD", M, 22);
    g.fillStyle = "#ffffff";
    g.font = `600 19px ${DISPLAY}`;
    g.fillText(fit(g, board.name.toUpperCase(), contentW - 120), M, 45);
    g.fillStyle = "#b9bbbf";
    g.font = `500 8px ${SANS}`;
    const st = `Stand ${germanDate()}`;
    g.fillText(st, PT_W - M - g.measureText(st).width, 45);
    // Spaltenkoepfe
    y = 80;
    g.fillStyle = C.muted;
    g.font = `700 6.5px ${SANS}`;
    const hx = (t: string, x: number) => g.fillText(t, M + x, y);
    hx("✓", col.check + 2);
    hx("RANG", col.rank);
    hx("SPIELER", col.name);
    hx("POSITION / COLLEGE", col.pos);
    hx("CONS.", col.cons);
    hx("+/−", col.delta);
    hx("MEINE RUNDE", col.round);
    g.fillStyle = C.border;
    g.fillRect(M, y + 4, contentW, 0.6);
    y += 14;
  };

  const ensure = (h: number) => {
    if (y + h > PT_H - 40) newPage();
  };

  newPage();
  for (const r of rows) {
    if (r.item.type === "tier") {
      ensure(30);
      y += 4;
      ctx.fillStyle = C.fg;
      ctx.fillRect(M, y, contentW, 16);
      ctx.fillStyle = C.primary;
      ctx.fillRect(M, y, 3, 16);
      ctx.fillStyle = "#ffffff";
      ctx.font = `600 8.5px ${DISPLAY}`;
      ctx.fillText(r.item.label.toUpperCase(), M + 10, y + 11);
      y += 22;
      continue;
    }
    if (!r.p) continue;
    const note = board.notes[r.p.slug];
    const blocks = noteLines(ctx, note, notesW - 48);
    const noteH = blocks.reduce((h, b) => h + b.lines.length * 10.5, 0);
    const rowH = 22 + (noteH ? noteH + 4 : 0);
    ensure(rowH);

    // Zebra
    if ((r.rank ?? 0) % 2 === 0) {
      ctx.fillStyle = "#fafaf9";
      ctx.fillRect(M, y - 2, contentW, rowH);
    }
    const base = y + 12;
    // Abhakkaestchen fuer den Draft-Tag
    ctx.strokeStyle = C.muted;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(M + col.check + 1, base - 8, 9, 9);

    ctx.fillStyle = C.primary;
    ctx.font = `700 10px ${MONO}`;
    ctx.fillText(String(r.rank), M + col.rank, base);
    ctx.fillStyle = C.fg;
    ctx.font = `700 9.5px ${SANS}`;
    ctx.fillText(fit(ctx, r.p.name.toUpperCase(), col.pos - col.name - 8), M + col.name, base);
    ctx.fillStyle = C.muted;
    ctx.font = `500 8px ${SANS}`;
    ctx.fillText(fit(ctx, `${r.p.position}${r.posRank ?? ""} · ${r.p.college}`, col.cons - col.pos - 6), M + col.pos, base);
    ctx.font = `500 8px ${MONO}`;
    ctx.fillText(`#${r.p.ranking_overall}`, M + col.cons, base);
    const d = r.delta ?? 0;
    ctx.fillStyle = deltaColor(d);
    ctx.font = `700 8px ${MONO}`;
    ctx.fillText(deltaLabel(d), M + col.delta, base);
    ctx.fillStyle = C.fg;
    ctx.font = `700 8.5px ${SANS}`;
    ctx.fillText(note?.round ? (note.round === "UDFA" ? "UDFA" : `Runde ${note.round}`) : "—", M + col.round, base);

    let ny = y + 22;
    for (const b of blocks) {
      ctx.fillStyle = b.color;
      ctx.font = `700 7px ${SANS}`;
      ctx.fillText(b.label.toUpperCase(), M + notesX, ny + 6);
      ctx.fillStyle = C.fg;
      ctx.font = `400 8.5px ${SANS}`;
      for (const line of b.lines) {
        ctx.fillText(line, M + notesX + 48, ny + 6);
        ny += 10.5;
      }
    }
    ctx.fillStyle = C.border;
    ctx.fillRect(M, y + rowH - 2, contentW, 0.5);
    y += rowH;
  }

  // Fusszeilen mit Seitenzahlen
  pages.forEach((p, i) => {
    const g = p.getContext("2d")!;
    g.fillStyle = C.muted;
    g.font = `500 7px ${SANS}`;
    g.fillText("Erstellt auf nfldraft-scouting.de/mein-board · Consensus = Forstner Scouting Big Board", M, PT_H - 20);
    const t = `Seite ${i + 1} / ${pages.length}`;
    g.fillText(t, PT_W - M - g.measureText(t).width, PT_H - 20);
  });

  const jpegs = await Promise.all(
    pages.map(async (p) => ({
      data: new Uint8Array(await (await canvasToBlob(p, "image/jpeg", 0.88)).arrayBuffer()),
      w: p.width,
      h: p.height,
    }))
  );
  return buildPdf(jpegs, board.name);
}

/** Minimaler PDF-1.4-Container: je Seite ein JPEG-Bild (DCTDecode). */
function buildPdf(pages: { data: Uint8Array; w: number; h: number }[], title: string): Blob {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let len = 0;
  const push = (x: string | Uint8Array) => {
    const b = typeof x === "string" ? enc.encode(x) : x;
    parts.push(b);
    len += b.length;
  };
  const obj = (n: number, body: string | (string | Uint8Array)[]) => {
    offsets[n] = len;
    push(`${n} 0 obj\n`);
    (Array.isArray(body) ? body : [body]).forEach(push);
    push("\nendobj\n");
  };

  // Titel nur als ASCII-Hexstring (UTF-16BE), damit kein Escaping-Problem entsteht.
  const hexTitle =
    "FEFF" +
    Array.from(title.slice(0, 80))
      .map((ch) => ch.charCodeAt(0).toString(16).padStart(4, "0"))
      .join("")
      .toUpperCase();

  push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  const n = pages.length;
  const kids = pages.map((_, i) => `${4 + i * 3} 0 R`).join(" ");
  obj(1, "<< /Type /Catalog /Pages 2 0 R >>");
  obj(2, `<< /Type /Pages /Kids [${kids}] /Count ${n} >>`);
  obj(3, `<< /Title <${hexTitle}> /Producer (nfldraft-scouting.de) >>`);
  pages.forEach((p, i) => {
    const pageN = 4 + i * 3;
    const imgN = pageN + 1;
    const contN = pageN + 2;
    obj(
      pageN,
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PT_W} ${PT_H}] /Resources << /XObject << /Im0 ${imgN} 0 R >> >> /Contents ${contN} 0 R >>`
    );
    obj(imgN, [
      `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.data.length} >>\nstream\n`,
      p.data,
      "\nendstream",
    ]);
    const content = `q ${PT_W} 0 0 ${PT_H} 0 0 cm /Im0 Do Q`;
    obj(contN, `<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });
  const total = 4 + n * 3;
  const xref = len;
  push(`xref\n0 ${total}\n0000000000 65535 f \n`);
  for (let i = 1; i < total; i++) push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size ${total} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  return new Blob(parts as BlobPart[], { type: "application/pdf" });
}
