import { NextResponse, type NextRequest } from "next/server";
import gone from "@/data/gone-players.json";

// Spieler, die einmal auf dem Board standen und entfernt wurden (z. B. bereits
// gedraftet oder nicht mehr 2027-eligible). Für ihre alten URLs liefern wir
// bewusst 410 (Gone) statt 404 – das sauberste Signal an Google, die Seite
// dauerhaft aus dem Index zu nehmen. Unbekannte Slugs laufen normal in die
// 404-Seite. Die Liste pflegt scripts/build_2027.py automatisch fort.
const goneSet = new Set(gone as string[]);

export function proxy(req: NextRequest) {
  const match = req.nextUrl.pathname.match(/^\/player\/([^/]+)\/?$/);
  if (match && goneSet.has(decodeURIComponent(match[1]).toLowerCase())) {
    return new NextResponse(
      "410 Gone – dieser Prospect ist nicht mehr Teil des NFL-Draft-2027-Boards.",
      { status: 410, headers: { "content-type": "text/plain; charset=utf-8" } }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/player/:slug*",
};
