import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.currentconnected.com' }], unoptimized: true },
};

export default nextConfig;
