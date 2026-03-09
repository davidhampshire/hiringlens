import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/s2/favicons**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/companies/:slug",
        destination: "/company/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
