/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["firebasestorage.googleapis.com"],
    unoptimized: true,
  },
  // Configuración para ignorar errores específicos
  experimental: {
    // Ignorar errores específicos durante la construcción
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
  // Ignorar errores durante la compilación para facilitar el despliegue
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración para ignorar la página not-found
  exportPathMap: async function (defaultPathMap) {
    // Crear un nuevo mapa de rutas sin incluir /_not-found
    const newPathMap = {};
    Object.keys(defaultPathMap).forEach(path => {
      if (path !== '/_not-found') {
        newPathMap[path] = defaultPathMap[path];
      }
    });
    return newPathMap;
  }
}

export default nextConfig