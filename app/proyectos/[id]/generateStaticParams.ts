// Este archivo ayuda a Next.js a generar rutas estáticas para las páginas dinámicas
// durante la compilación, evitando errores de generación estática

export async function generateStaticParams() {
  // En un entorno de producción, podrías obtener los IDs de proyectos desde Firebase
  // Para la compilación estática, proporcionamos algunos IDs de ejemplo
  return [{ id: "ejemplo-1" }, { id: "ejemplo-2" }, { id: "ejemplo-3" }]
}
