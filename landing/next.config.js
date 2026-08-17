/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.yarah.dev' },
    ],
  },
};

module.exports = nextConfig;
