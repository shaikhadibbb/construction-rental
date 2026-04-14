import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: '.',
    },
  },
  images: {
    remotePatterns: [
      {
        // Supabase Storage — covers all project buckets
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Supabase Storage CDN
        protocol: 'https',
        hostname: '*.supabase.in',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Unsplash placeholders
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
