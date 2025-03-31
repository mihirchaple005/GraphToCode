/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add webpack configuration to handle caching issues
  webpack: (config, { dev, isServer }) => {
    // Disable caching in development to prevent file system errors
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;