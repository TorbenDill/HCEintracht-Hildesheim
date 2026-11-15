import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

// Generisches Vorschaubild (Open Graph / Twitter) mit Seitentitel im Seiten-CI.
// Eingaben kommen aus der URL und werden deshalb gekappt und von Steuerzeichen
// befreit; ImageResponse rendert sie als reinen Text (kein HTML).
function clean(v: string | null, max: number): string {
  return (v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const title = clean(sp.get("t"), 90) || "NFL Draft Board 2027";
  const kicker = clean(sp.get("k"), 40) || "Forstner Scouting";
  const size = title.length > 60 ? 64 : title.length > 36 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d10",
          color: "#e9e7e4",
          fontFamily: "sans-serif",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 18, background: "#c2410c", display: "flex" }} />
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 3, color: "#c2410c", fontWeight: 700, textTransform: "uppercase" }}>
          {kicker}
        </div>
        <div style={{ display: "flex", fontSize: size, fontWeight: 800, lineHeight: 1.05, textTransform: "uppercase", maxWidth: 1040 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#9aa0a8" }}>
          <span style={{ display: "flex" }}>NFL Draft Board 2027</span>
          <span style={{ display: "flex" }}>nfldraft-scouting.de</span>
        </div>
      </div>
    ),
    { ...SIZE, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } }
  );
}
