import type { NextConfig } from "next";
import "./lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clario.t3.storage.dev",
        port: "",
        pathname: "**",
      },
    ],
  },
  experimental: {
    cpus: 4,
  },
};

export default nextConfig;
