/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
