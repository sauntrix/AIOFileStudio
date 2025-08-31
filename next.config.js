/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
  experimental: {
    // ✅ ensures sharp works in Vercel serverless functions
    serverComponentsExternalPackages: ["sharp"],
  },
};

module.exports = nextConfig;
