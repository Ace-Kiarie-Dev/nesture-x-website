import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Templates are read at runtime via fs.readFileSync (src/emails/render.ts) —
  // trace them into the API function bundles explicitly.
  outputFileTracingIncludes: {
    '/api/*': ['./src/emails/*.html'],
  },
  async redirects() {
    return [
      { source: '/tools/image-converter',  destination: '/tools/image-studio', permanent: true },
      { source: '/tools/image-compressor', destination: '/tools/image-studio', permanent: true },
    ];
  },
};

export default nextConfig;
