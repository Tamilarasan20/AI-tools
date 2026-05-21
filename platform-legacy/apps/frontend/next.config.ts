import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  images: {
    domains: [
      'pub-loraloop.r2.dev',
      'loraloop.r2.cloudflarestorage.com',
      'cdn.loraloop.io',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'pbs.twimg.com',
      'media.licdn.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api',
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
