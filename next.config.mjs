/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // Configuración de imágenes
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // Ignorar errores durante la construcción
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configuración para el tiempo de generación de páginas estáticas
  staticPageGenerationTimeout: 120,
}

export default nextConfig
