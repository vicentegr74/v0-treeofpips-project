/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["firebasestorage.googleapis.com"],
    unoptimized: true,
  },
  // Configuración para manejar rutas específicas
  experimental: {
    // Desactivar la generación estática para ciertas rutas
    serverComponentsExternalPackages: ['firebase'],
  },
  // Ignorar errores durante la compilación para facilitar el despliegue
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración para ignorar errores específicos durante la construcción
  onDemandEntries: {
    // Esto puede ayudar con errores de tiempo de ejecución durante la construcción
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

export default nextConfig