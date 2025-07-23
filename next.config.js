/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/camera-footage/:path*',
        destination: '/api/video/:path*'
      }
    ]
  }
}

module.exports = nextConfig