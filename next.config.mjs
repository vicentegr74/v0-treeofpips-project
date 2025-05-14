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
  
  // Deshabilitar la generación estática para ciertas páginas
  unstable_excludeFiles: ['**/not-found.tsx', '**/not-found.js', '**/not-found.jsx'],
  
  // Configuración experimental para manejar errores
  experimental: {
    // Estas opciones pueden ayudar con problemas de renderizado
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  }
}

export default nextConfig
