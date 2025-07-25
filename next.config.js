/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any conflicting route configurations
  // Don't use both 'routes' and any of: 'rewrites', 'redirects', 'headers', etc.
  
  // Example of a clean config:
  reactStrictMode: true,
  swcMinify: true,
  
  // Don't include both of these types of configurations together
  /* 
  async rewrites() {
    return [];
  },
  */
  
  /* 
  // Remove this if you have rewrites, redirects, etc.
  async headers() {
    return [];
  },
  */

  // Images configuration if needed
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;