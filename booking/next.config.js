/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.apps.yarah.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yarah.dev',
      },
    ],
  },
};

module.exports = nextConfig;
