/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para producción
  output: 'standalone', // Optimiza para despliegues en plataformas como Vercel
  poweredByHeader: false, // Elimina el header X-Powered-By por seguridad
  compress: true, // Habilita la compresión
  
  // Configuración de imágenes
  images: {
    domains: ['firebasestorage.googleapis.com'], // Añade los dominios de tus imágenes
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
  
  // Mantén estas configuraciones que ya tenías
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Estas opciones deben estar fuera de experimental
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  
  // Configuración experimental para manejar errores
  experimental: {
    // Otras opciones experimentales pueden ir aquí
  }
}

export default nextConfig
