/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/camera-footage/:path*',
        destination: '/api/video/:path*'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Improve build performance and error handling
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Handle API timeouts better in production
  serverRuntimeConfig: {
    maxDuration: 10
  },
  // Optimize for production
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@prisma/client']
  }
}

module.exports = nextConfig