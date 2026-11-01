import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/work/bellamkonda-kavya-reception",
        destination: "/stories/bellam-srikonda",
        permanent: true,
      },
      {
        source: "/work/bellam-srikonda",
        destination: "/stories/bellam-srikonda",
        permanent: true,
      },
      {
        source: "/work/sireesh-harshitha",
        destination: "/stories/sirish-and-harshitha",
        permanent: true,
      },
      {
        source: "/work/sirish-and-harshitha",
        destination: "/stories/sirish-and-harshitha",
        permanent: true,
      },
      {
        source: "/work/hrithika-abhishek",
        destination: "/stories/hrithika-abhishek",
        permanent: true,
      },
      {
        source: "/work/karthik-gayathri",
        destination: "/stories/karthik-and-gayathri",
        permanent: true,
      },
      {
        source: "/work/karthik-and-gayathri",
        destination: "/stories/karthik-and-gayathri",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
