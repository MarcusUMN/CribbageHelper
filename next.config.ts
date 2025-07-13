import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/CribbageHelper',
  assetPrefix: '/CribbageHelper',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
