/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignorer les fichiers json dans /public/animations
    config.module.rules.push({
      test: /public\/animations\/.*\.json$/,
      use: 'ignore-loader'
    });
    return config;
  },
  // Ajouter d'autres configurations Next.js si nécessaire
  reactStrictMode: true,
  // Ignorer les avertissements ESLint pendant la construction (optionnel)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable static optimization for dynamic routes
  output: 'standalone',
  experimental: {
    serverActions: true
  }
};

export default nextConfig;