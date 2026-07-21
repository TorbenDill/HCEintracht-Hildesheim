import { ImageResponse } from "next/og";
import boardMeta from "@/data/board-meta.json";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

export async function GET() {
  const meta = boardMeta as { draftYear: number };
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
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 3,
            color: "#c2410c",
            fontWeight: 700,
          }}
        >
          FORSTNER SCOUTING
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 112,
              fontWeight: 800,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            NFL Draft{" "}
            <span style={{ display: "flex", color: "#c2410c" }}>
              &nbsp;{meta.draftYear}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              color: "#9aa0a8",
              marginTop: 14,
            }}
          >
            Big Board · Positionsrankings · Mock Draft · Simulator
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9aa0a8" }}>
          nfldraft-scouting.de
        </div>
      </div>
    ),
    SIZE
  );
}
