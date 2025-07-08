/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  
  basePath: '/CribbageHelper',
  assetPrefix: '/CribbageHelper',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },   
}

module.exports = nextConfig;
