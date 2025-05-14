"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut, Menu, X, ChevronDown, Trophy } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export function AppHeader() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false)
  const [homeRoute, setHomeRoute] = useState("/dashboard")
  const [homeText, setHomeText] = useState("Dashboard")
  const [logoSrc, setLogoSrc] = useState("/images/treeofpips-horizontal-claro.png")

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Actualizar homeRoute y homeText basado en isAuthenticated
  useEffect(() => {
    setHomeRoute(isAuthenticated ? "/dashboard" : "/")
    setHomeText(isAuthenticated ? "Dashboard" : "Inicio")
    setLogoSrc(
      theme === "dark" ? "/images/treeofpips-horizontal-oscuro.png" : "/images/treeofpips-horizontal-claro.png",
    )
  }, [isAuthenticated, theme])

  // Efecto para la notificación de subida de nivel
  useEffect(() => {
    // Solo mostrar la notificación si el usuario está autenticado
    if (isAuthenticated) {
      // Esto es solo para demostración, en una implementación real
      // se activaría cuando el usuario realmente sube de nivel
      const timer = setTimeout(() => {
        setShowLevelUpNotification(true)

        // Ocultar la notificación después de 5 segundos
        const hideTimer = setTimeout(() => {
          setShowLevelUpNotification(false)
        }, 5000)

        return () => clearTimeout(hideTimer)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated])

  // Determinar si una ruta está activa
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const handleNewProject = () => {
    router.push("/proyectos/nuevo")
  }

  const handleLogout = async () => {
    await logout()
    // La redirección ahora se maneja en la función logout del contexto
  }

  // Determinar si estamos en la página de inicio
  const isHomePage = pathname === "/"

  // Si estamos en la página de inicio, mostrar una versión simplificada del header
  if (isHomePage) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-6">
                {mounted && (
                  <div className="relative h-8 w-32 sm:w-40">
                    <Image
                      src={
                        theme === "dark"
                          ? "/images/treeofpips-horizontal-oscuro.png"
                          : "/images/treeofpips-horizontal-claro.png"
                      }
                      alt="Tree of Pips"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                )}
              </Link>

              {/* Navegación de escritorio para página de inicio */}
              <nav className="hidden md:flex items-center space-x-4">
                <button
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                >
                  Características
                </button>
                <button
                  onClick={() => document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                >
                  Testimonios
                </button>
                <button
                  onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                >
                  FAQ
                </button>
              </nav>
            </div>

            {/* Acciones */}
            <div className="flex items-center space-x-4">
              {/* Botón de tema */}
              <ThemeToggle />

              {/* Botones de inicio de sesión y registro */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button className="bg-green-700 hover:bg-green-800 text-white" size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>

              {/* Botón de menú móvil */}
              <button
                className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Menú móvil desplegable */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <nav className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Características
                </button>
                <button
                  onClick={() => {
                    document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Testimonios
                </button>
                <button
                  onClick={() => {
                    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
                    setIsMobileMenuOpen(false)
                  }}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  FAQ
                </button>
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    )
  }

  // Para el resto de páginas, mostrar el header completo
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y navegación principal */}
          <div className="flex items-center">
            <Link href={homeRoute} className="flex items-center mr-6">
              {mounted && (
                <div className="relative h-8 w-32 sm:w-40">
                  <Image
                    src={logoSrc || "/placeholder.svg"}
                    alt="Tree of Pips"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </Link>

            {/* Navegación de escritorio */}
            <nav className="hidden md:flex items-center space-x-4">
              <Link
                href={homeRoute}
                className={`text-sm font-medium ${
                  isActive(homeRoute)
                    ? "text-green-700 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                }`}
              >
                {homeText}
              </Link>

              {isAuthenticated ? (
                // Enlaces para usuarios autenticados
                <>
                  <Link
                    href="/proyectos"
                    className={`text-sm font-medium ${
                      isActive("/proyectos")
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                    }`}
                  >
                    Proyectos
                  </Link>
                  <Link
                    href="/estadisticas"
                    className={`text-sm font-medium ${
                      isActive("/estadisticas")
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                    }`}
                  >
                    Estadísticas
                  </Link>
                  <Link
                    href="/informacion"
                    className={`text-sm font-medium ${
                      isActive("/informacion")
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                    }`}
                  >
                    Información
                  </Link>
                </>
              ) : (
                // Enlaces para usuarios no autenticados
                <>
                  <Link
                    href="/login"
                    className={`text-sm font-medium ${
                      isActive("/login")
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400"
                    }`}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/registro"
                    className={`text-sm font-medium ${
                      isActive("/registro")
                        ? "text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:text-green-400"
                    }`}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Acciones y perfil de usuario */}
          <div className="flex items-center space-x-4">
            {/* Botón de nuevo proyecto (visible en pantallas medianas y grandes para usuarios autenticados) */}
            {isAuthenticated && (
              <div className="hidden md:block">
                <Button onClick={handleNewProject} size="sm" className="bg-green-700 hover:bg-green-800 text-white">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Proyecto
                </Button>
              </div>
            )}

            {/* Botón de tema */}
            <ThemeToggle />

            {/* Menú de usuario (solo para usuarios autenticados) */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 flex items-center gap-2 text-sm font-medium">
                    <span className="hidden sm:inline-block">Hola, {user.nombre || user.email?.split("@")[0]}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil" className="cursor-pointer">
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/proyectos" className="cursor-pointer">
                      Mis proyectos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Botones de inicio de sesión y registro para usuarios no autenticados (visible en pantallas medianas y grandes) */}
            {!isAuthenticated && (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button className="bg-green-700 hover:bg-green-800 text-white" size="sm" asChild>
                  <Link href="/registro">Registrarse</Link>
                </Button>
              </div>
            )}

            {/* Botón de menú móvil (visible solo en pantallas pequeñas) */}
            <button
              className="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {showLevelUpNotification && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-green-100 dark:bg-green-900/70 p-4 rounded-lg shadow-lg border border-green-200 dark:border-green-800 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-300">¡Has subido de nivel!</h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Felicidades, ahora eres un <span className="font-medium">Árbol Joven</span> en el Bosque de
                  Excelencia.
                </p>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-green-500 text-green-700 dark:text-green-400"
                    onClick={() => router.push("/ranking")}
                  >
                    Ver mi ranking
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 absolute top-2 right-2"
                onClick={() => setShowLevelUpNotification(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-3">
              <Link
                href={homeRoute}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(homeRoute)
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {homeText}
              </Link>

              {isAuthenticated ? (
                // Enlaces para usuarios autenticados (móvil)
                <>
                  <Link
                    href="/proyectos"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/proyectos")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Proyectos
                  </Link>
                  <Link
                    href="/estadisticas"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/estadisticas")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Estadísticas
                  </Link>
                  <Link
                    href="/informacion"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/informacion")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Información
                  </Link>
                  <Link
                    href="/perfil"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/perfil")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                  <div className="px-3 py-2">
                    <Button
                      onClick={() => {
                        handleNewProject()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nuevo Proyecto
                    </Button>
                  </div>
                  <div className="px-3 py-2">
                    <Button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </div>
                </>
              ) : (
                // Enlaces para usuarios no autenticados (móvil)
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/login")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/registro"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive("/registro")
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
