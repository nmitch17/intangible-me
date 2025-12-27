/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure WASM files are properly handled in serverless environment
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Copy WASM file to server output for serverless functions
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name][ext]',
        },
      });
    }
    return config;
  },
};

export default nextConfig;
