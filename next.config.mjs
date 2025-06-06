/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'your-image-domain.com',
    //     port: '',
    //     pathname: '/images/**',
    //   },
    // ],
    // For simpler domain whitelisting, use `domains` (deprecated in Next 14 for `remotePatterns` but simpler for single hosts like picsum)
    // If using Next 14+, prefer remotePatterns for more granular control.
    // For now, let's use `domains` for picsum.photos as it's widely supported and simpler for this case.
    domains: ['picsum.photos'],
  },
  webpack: (config, { isServer }) => {
    // Existing webpack config, if any, goes here
    // For example, to handle SVGs as components:
    // config.module.rules.push({
    //   test: /\.svg$/i,
    //   issuer: /\.[jt]sx?$/,
    //   use: ['@svgr/webpack'],
    // });

    return config;
  },
  // experimental: {
  //   serverActions: true, // If you plan to use Next.js Server Actions
  // },
};

export default nextConfig;
