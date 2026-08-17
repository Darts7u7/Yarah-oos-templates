/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.apps.yarah.dev' },
      { protocol: 'https', hostname: '**.yarah.dev' },
    ],
  },
};

module.exports = nextConfig;
