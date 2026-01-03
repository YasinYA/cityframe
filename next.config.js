/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
      {
        protocol: 'https',
        hostname: '*.minio.*',
      },
    ],
  },
  eslint: {
    // ESLint 9 is incompatible with Next.js 14 - run lint separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type check separately for faster builds
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

module.exports = nextConfig;
