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
  async headers() {
    return [
      {
        // The page lives at /nx-gaming/2048 (no trailing slash), just outside
        // sw.js's default scope, so allow the service worker to claim it.
        source: '/nx-gaming/2048/sw.js',
        headers: [{ key: 'Service-Worker-Allowed', value: '/nx-gaming/2048' }],
      },
      {
        // Same for Flappy Horror at /nx-gaming/flappy-horror.
        source: '/nx-gaming/flappy-horror/sw.js',
        headers: [{ key: 'Service-Worker-Allowed', value: '/nx-gaming/flappy-horror' }],
      },
    ];
  },
};

export default nextConfig;
