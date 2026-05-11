import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/tools/image-converter',  destination: '/tools/image-studio', permanent: true },
      { source: '/tools/image-compressor', destination: '/tools/image-studio', permanent: true },
    ];
  },
};

export default nextConfig;
