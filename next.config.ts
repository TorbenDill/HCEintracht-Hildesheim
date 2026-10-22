import type { NextConfig } from "next";

// Kanonischer Host = www.nfldraft-scouting.de (passt zur Vercel-Einstellung:
// apex -> www -> Production). Die anderen TLDs werden per 301 hierher
// weitergeleitet (SEO: eine einzige kanonische Adresse).
const CANONICAL = "https://www.nfldraft-scouting.de";

// Security-Header fuer alle Antworten.
// CSP: Die Seiten sind statisch vorgerendert (SSG). Next.js schreibt dafuer
// Inline-Scripts (RSC-Payload) und JSON-LD-Bloecke ins HTML; Nonces wuerden
// dynamisches Rendering erzwingen. Deshalb script-src mit 'unsafe-inline',
// aber ohne fremde Script-Hosts – das blockiert nachgeladene Fremd-Skripte,
// fremde Verbindungen (connect-src), Plugins, <base>-Hijacking und Framing.
// Bilder kommen teils von externen https-Quellen (Wikimedia, Pexels).
// Im Dev-Modus braucht React 'unsafe-eval' + HMR-WebSocket, daher nur in Prod.
const isProd = process.env.NODE_ENV === "production";
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
  // Vercel setzt bereits max-age=63072000; hier explizit, damit es auch bei
  // anderem Hosting gilt. includeSubDomains/preload bewusst NICHT gesetzt
  // (erst pruefen, ob alle Subdomains HTTPS koennen).
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Kein "X-Powered-By: Next.js" (Fingerprinting).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
