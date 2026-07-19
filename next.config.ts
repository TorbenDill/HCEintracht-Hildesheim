import type { NextConfig } from "next";

// Kanonischer Host = www.nfldraft-scouting.de (passt zur Vercel-Einstellung:
// apex -> www -> Production). Die anderen TLDs werden per 301 hierher
// weitergeleitet (SEO: eine einzige kanonische Adresse).
const CANONICAL = "https://www.nfldraft-scouting.de";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Zusatz-Domains (apex + www) -> kanonische www.de-Domain.
      // .de selbst wird von Vercel (apex -> www) gehandhabt, daher hier NICHT
      // aufgeführt, um eine Redirect-Schleife zu vermeiden.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.com" }],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.store" }],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.global" }],
        destination: `${CANONICAL}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
