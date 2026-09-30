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
      { source: '/portfolio/status/betledger', destination: '/betledger', permanent: true },
      { source: '/portfolio/status/sorapesa', destination: '/sorapesa', permanent: true },
      { source: '/portfolio/status/kikota', destination: '/kikota', permanent: true },
      { source: '/portfolio/status/matatu-dash', destination: '/matatu-dash', permanent: true },
    ];
  },
};

export default nextConfig;
