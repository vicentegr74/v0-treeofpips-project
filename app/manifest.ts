import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tree of Pips - Árbol de Logros del Trading",
    short_name: "Tree of Pips",
    description: "Visualiza y celebra tus logros en trading con un árbol que crece con tu éxito",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      {
        src: "/images/treeofpips-logo-cuadrado-claro.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/treeofpips-logo-cuadrado-claro.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

// Añadir esta línea para forzar la generación estática
export const dynamic = "force-static"
