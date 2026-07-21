import { ImageResponse } from "next/og";
import { getPlayerBySlug, getBoardMeta } from "@/lib/player-service";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);
  const meta = getBoardMeta();

  const shell = (children: React.ReactNode) => (
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
        padding: "64px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: "#c2410c",
          display: "flex",
        }}
      />
      {children}
    </div>
  );

  if (!player) {
    return new ImageResponse(
      shell(
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800 }}>
          NFL Draft {meta.draftYear}
        </div>
      ),
      SIZE
    );
  }

  return new ImageResponse(
    shell(
      <>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 3,
            color: "#c2410c",
            fontWeight: 700,
          }}
        >
          NFL DRAFT {meta.draftYear} · SCOUTING
        </div>

        <div
          style={{ display: "flex", alignItems: "flex-end", gap: 28 }}
        >
          {player.ranking_overall != null && (
            <div
              style={{
                display: "flex",
                fontSize: 150,
                fontWeight: 800,
                color: "#c2410c",
                lineHeight: 1,
              }}
            >
              #{player.ranking_overall}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 74,
                fontWeight: 800,
                lineHeight: 1.02,
                textTransform: "uppercase",
              }}
            >
              {player.name}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 36,
                color: "#9aa0a8",
                marginTop: 10,
              }}
            >
              {player.position} · {player.college}
              {player.projection ? ` · ${player.projection}` : ""}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#9aa0a8",
          }}
        >
          <div style={{ display: "flex" }}>nfldraft-scouting.de</div>
          <div style={{ display: "flex", color: "#e9e7e4", fontWeight: 700 }}>
            Forstner Scouting
          </div>
        </div>
      </>
    ),
    SIZE
  );
}
