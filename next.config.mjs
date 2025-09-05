/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cnn-arabic-images.cnn.io', 'bisha.runasp.net', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bisha.runasp.net',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cnn-arabic-images.cnn.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    });
    return config;
  },
};

export default nextConfig;