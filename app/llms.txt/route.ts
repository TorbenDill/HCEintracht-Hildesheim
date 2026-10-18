import { buildLlmsTxt } from "@/lib/llms";

// Zur Build-Zeit statisch erzeugt (siehe lib/llms.ts).
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
