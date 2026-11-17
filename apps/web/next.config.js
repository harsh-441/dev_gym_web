// Prevent Next.js from attempting online lockfile patching during sandboxed builds
process.env.NEXT_DISABLE_SWC_REINSTALL = '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@parshuram/shared'],
  images: {
    domains: ['images.unsplash.com', 'img.youtube.com']
  }
};

module.exports = nextConfig;
