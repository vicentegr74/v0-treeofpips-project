/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["firebasestorage.googleapis.com"],
    unoptimized: true,
  },
  // Estas opciones ahora están en el nivel principal, no dentro de experimental
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Ignorar errores durante la compilación para facilitar el despliegue
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración para manejar rutas específicas
  async rewrites() {
    return [
      {
        // Redirigir cualquier intento de acceder a /_not-found a /404
        source: '/_not-found',
        destination: '/404',
      }
    ];
  }
}

export default nextConfig