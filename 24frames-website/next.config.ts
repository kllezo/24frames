import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
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
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
