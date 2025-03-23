/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Configuration pour traiter les fichiers JSON
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      resolve: { fullySpecified: false }
    });

    return config;
  },
  // Ajouter d'autres configurations Next.js si nécessaire
  reactStrictMode: true,
  // Ignorer les avertissements ESLint pendant la construction (optionnel)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;