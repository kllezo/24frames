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
  async redirects() {
    return [
      {
        source: "/artist",
        destination: "/#artist",
        permanent: true,
      },
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
