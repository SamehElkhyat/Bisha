/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cnn-arabic-images.cnn.io'],
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