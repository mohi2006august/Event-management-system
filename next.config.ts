import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/events',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
