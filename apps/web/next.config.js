// Prevent Next.js from attempting online lockfile patching during sandboxed builds
process.env.NEXT_IGNORE_INCORRECT_LOCKFILE = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@parshuram/shared'],
  images: {
    domains: ['images.unsplash.com', 'img.youtube.com']
  },
  webpack(config) {
    // Expo uses React 18.2 in this workspace; pin the web bundle's React
    // imports (including styled-jsx) to the version paired with Next's renderer.
    config.resolve.alias = {
      ...config.resolve.alias,
      'react$': require.resolve('react'),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      'react-dom$': require.resolve('react-dom')
    };
    return config;
  }
};

module.exports = nextConfig;
