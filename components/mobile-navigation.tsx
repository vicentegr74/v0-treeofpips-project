"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BarChart2, PieChart, User, Plus, Trophy } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Si no está autenticado y está en la página de inicio, no mostrar esta navegación
  if (!isAuthenticated && pathname === "/") {
    return null
  }

  // Si está en la página de inicio o login o registro y no está autenticado, no mostrar
  if (!isAuthenticated && (pathname === "/" || pathname === "/login" || pathname === "/registro")) {
    return null
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  // Determinar si una ruta está activa
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  // Determinar la ruta de inicio según el estado de autenticación
  const homeRoute = isAuthenticated ? "/dashboard" : "/"

  return (
    <>
      {/* Botón de menú */}
      <button
        onClick={toggleMenu}
        className="fixed bottom-6 left-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors md:hidden"
        aria-label="Menú"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay oscuro cuando el menú está abierto */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMenu} aria-hidden="true"></div>
      )}

      {/* Menú lateral */}
      <div
        className={`fixed bottom-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-900 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex-1 py-8">
            <nav className="space-y-6">
              <Link
                href={homeRoute}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                  isActive(homeRoute)
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={closeMenu}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium">{isAuthenticated ? "Dashboard" : "Inicio"}</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/proyectos"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive("/proyectos")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <PieChart className="h-5 w-5" />
                    <span className="font-medium">Proyectos</span>
                  </Link>

                  <Link
                    href="/estadisticas"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive("/estadisticas")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <BarChart2 className="h-5 w-5" />
                    <span className="font-medium">Estadísticas</span>
                  </Link>

                  <Link
                    href="/ranking"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive("/ranking")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <Trophy className="h-5 w-5" />
                    <span className="font-medium">Ranking</span>
                  </Link>

                  <Link
                    href="/perfil"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive("/perfil")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Mi Perfil</span>
                  </Link>

                  <Link
                    href="/proyectos/crear"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    onClick={closeMenu}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Nuevo Proyecto</span>
                  </Link>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Link
                    href="/login"
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg ${
                      isActive("/login")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={closeMenu}
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Iniciar Sesión</span>
                  </Link>

                  <Link
                    href="/registro"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    onClick={closeMenu}
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Registrarse</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
