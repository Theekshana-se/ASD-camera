/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Allow common placeholder services
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'placeholder.com' },

      // Allow localhost for development
      { protocol: 'http', hostname: 'localhost', port: '3001' },
      { protocol: 'https', hostname: 'localhost', port: '3001' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3001' },
      { protocol: 'http', hostname: 'localhost', port: '3002' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3002' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },

      // Allow backend server
      { protocol: 'https', hostname: 'electronics-shop-backend-rfs4.onrender.com' },

      // Allow common image CDNs and hosting services
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cloudinary.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'source.unsplash.com' },

      // Allow any HTTPS image source (for maximum compatibility on Vercel)
      { protocol: 'https', hostname: '**' },
    ],
    // Allow unoptimized images for base64 data URLs
    unoptimized: false, // Keep optimization for regular images
    // Optimize image caching
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion'],
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
      // Cache static assets aggressively
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
