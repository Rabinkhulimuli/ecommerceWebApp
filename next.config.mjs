// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    // Allows production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows production builds to complete despite TypeScript errors
    ignoreBuildErrors: true,
  },
  images: {
    // Modern approach: use remotePatterns instead of deprecated domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lottie.host',
      },
      {
        protocol: 'https',
        hostname: '**', // Allows images from any domain
      },
    ],
    // Disable image optimization if needed
    unoptimized: true,
  },
};

export default nextConfig;
