/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  reactStrictMode: true,
  swcMinify: true,
  
  // Remove any conflicting route configurations
  experimental: {
    // Disable appDir if you're using Pages Router
    // appDir: false,
  },
  
  // Choose ONE approach to routing, not multiple:
  // If you use App Router, make sure you don't have conflicting pages in /pages
  
  // If you need redirects, use this (but remove any 'routes' config elsewhere)
  async redirects() {
    return [];
  },
  
  // Only include one of these routing mechanisms
  /*
  async rewrites() {
    return [];
  },
  
  async headers() {
    return [];
  },
  */
  
  // Other configuration settings
  images: {
    domains: ['localhost'],
  },
  
  // Ensure no 'routes' property is defined at the top level
};

module.exports = nextConfig;