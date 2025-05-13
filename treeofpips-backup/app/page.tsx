"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Frases célebres de traders reconocidos
  const quotes = [
    {
      text: "El trading no se trata de tener razón o estar equivocado; se trata de ganar dinero.",
      author: "Bill Lipschutz",
    },
    {
      text: "Los mercados pueden mantener su irracionalidad más tiempo del que tú puedes mantener tu solvencia.",
      author: "John Maynard Keynes",
    },
    {
      text: "El riesgo viene de no saber lo que estás haciendo.",
      author: "Warren Buffett",
    },
    {
      text: "La paciencia es la clave para el éxito en el trading.",
      author: "Jesse Livermore",
    },
  ]

  // Seleccionar una frase aleatoria
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <div className="min-h-screen flex flex-col bg-green-50 dark:bg-gray-900">
      {/* Header simple */}
      <header className="w-full py-4 px-6 flex justify-between items-center">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium"
          >
            Iniciar sesión
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Logo - Aumentado de tamaño */}
          <div className="relative w-80 h-80 mx-auto">
            {mounted && (
              <>
                <Image
                  src="/images/treeofpips-comienza-ya-oscuro.png"
                  alt="Tree of Pips"
                  fill
                  className="object-contain hidden dark:block"
                  priority
                />
                <Image
                  src="/images/treeofpips-comienza-ya-claro.png"
                  alt="Tree of Pips"
                  fill
                  className="object-contain dark:hidden"
                  priority
                />
              </>
            )}
          </div>

          {/* Eslogan */}
          <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-400">
            El árbol de los Logros del Trading
          </h1>

          {/* Descripción */}
          <p className="text-lg text-green-700 dark:text-green-300 max-w-2xl mx-auto">
            Visualiza tu crecimiento financiero como un árbol que florece con cada operación exitosa. Establece metas,
            registra tu progreso y celebra tus logros.
          </p>

          {/* Cita */}
          <blockquote className="italic text-gray-600 dark:text-gray-400 max-w-xl mx-auto border-l-4 border-green-500 pl-4 py-2">
            "{randomQuote.text}"<footer className="text-right font-medium mt-1">— {randomQuote.author}</footer>
          </blockquote>

          {/* Botón principal */}
          <div className="mt-8">
            <Link href="/registro">
              <Button className="bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 h-auto rounded-full">
                Empieza ahora
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Tree of Pips. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
