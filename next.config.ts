import type { NextConfig } from "next";

// Kanonischer Host. Alle anderen verbundenen Domains werden per 301 hierher
// weitergeleitet (SEO: vermeidet Duplicate Content über mehrere TLDs).
const CANONICAL_HOST = "nfldraft-scouting.de";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // www -> apex (kanonisch, ohne www)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nfldraft-scouting.de" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      // Zusatz-Domains -> kanonische .de-Domain
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.com" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.store" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?nfldraft-scouting\\.global" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
