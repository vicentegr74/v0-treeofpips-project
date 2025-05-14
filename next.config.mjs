/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
  // Deshabilitar la generación estática para rutas dinámicas
  staticPageGenerationTimeout: 120,
  // Configurar rutas que no deben generarse estáticamente
  exportPathMap: async function() {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
    };
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
