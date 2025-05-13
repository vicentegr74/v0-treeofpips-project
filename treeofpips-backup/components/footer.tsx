"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp } from "lucide-react"

export function Footer() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mover el event listener de scroll dentro de un useEffect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }

    // Añadir el event listener
    window.addEventListener("scroll", handleScroll)

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const logoSrc =
    mounted && theme === "dark" ? "/images/treeofpips-horizontal-oscuro.png" : "/images/treeofpips-horizontal-claro.png"

  return (
    <footer className="bg-green-50 dark:bg-gray-900 border-t border-green-100 dark:border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <div className="relative h-12 w-48 mb-4">
              {mounted && (
                <Image src={logoSrc || "/placeholder.svg"} alt="Tree of Pips" fill className="object-contain" />
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Visualiza tu crecimiento financiero como un árbol que florece con cada operación exitosa.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-span-1">
            <h3 className="text-green-800 dark:text-green-400 font-medium mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/proyectos"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Proyectos
                </Link>
              </li>
              <li>
                <Link
                  href="/estadisticas"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Estadísticas
                </Link>
              </li>
              <li>
                <Link
                  href="/perfil"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Mi perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div className="col-span-1">
            <h3 className="text-green-800 dark:text-green-400 font-medium mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 text-sm"
                >
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-green-800 dark:text-green-400 font-medium mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@treeofpips.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+34 123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>Madrid, España</span>
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-gray-500 hover:text-green-700 dark:hover:text-green-400">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-700 dark:hover:text-green-400">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-700 dark:hover:text-green-400">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-700 dark:hover:text-green-400">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-green-100 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Tree of Pips. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Términos y condiciones
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Política de privacidad
            </Link>
            <Link
              href="#"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Botón para volver arriba */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all"
          aria-label="Volver arriba"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  )
}
