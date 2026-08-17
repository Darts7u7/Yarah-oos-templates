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
        hostname: 'txvtce5i.us-west.apps.yarah.dev',
      },
      {
        protocol: 'https',
        hostname: 'cdn.yarah.dev',
      },
    ],
  },
};

module.exports = nextConfig;
