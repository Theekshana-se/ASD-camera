/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif','image/webp'],
        remotePatterns: [
          { protocol: 'https', hostname: 'placehold.co' },
          { protocol: 'http', hostname: 'localhost', port: '3001' },
          { protocol: 'https', hostname: 'localhost', port: '3001' },
          { protocol: 'http', hostname: '127.0.0.1', port: '3001' },
        ],
      },
    env: {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
          ],
        },
      ];
    },
};

export default nextConfig;
