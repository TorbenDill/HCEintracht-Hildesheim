import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.hceintracht-hildesheim.de",
      },
    ],
  },
};

export default nextConfig;
