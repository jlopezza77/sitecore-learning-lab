import type { NextConfig } from 'next';

const basePath = '/next';

const nextConfig: NextConfig = {
  // Static export: `next build` writes plain HTML/JS/CSS to out/, deployed next to the original site.
  output: 'export',
  // The app lives under /next/ in the same Azure Static Web App, so it shares the /api backend.
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
