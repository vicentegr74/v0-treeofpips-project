"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, PlusCircle, User, Menu, FolderKanban } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function MobileNavigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar")
      if (sidebar && !sidebar.contains(event.target as Node) && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Cerrar el menú cuando cambia la ruta
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/proyectos", label: "Mis Proyectos", icon: FolderKanban },
    { href: "/estadisticas", label: "Estadísticas", icon: BarChart2 },
    { href: "/proyectos/crear", label: "Nuevo Proyecto", icon: PlusCircle },
    { href: "/perfil", label: "Perfil", icon: User },
  ]

  const logoSrc =
    mounted && theme === "dark" ? "/images/treeofpips-horizontal-oscuro.png" : "/images/treeofpips-horizontal-claro.png"

  return (
    <>
      {/* Botón de hamburguesa fijo en la esquina superior izquierda */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 shadow-md"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Overlay oscuro cuando el menú está abierto */}
      {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu} />}

      {/* Menú lateral */}
      <div
        id="mobile-sidebar"
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-green-100 dark:border-green-900">
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc || "/placeholder.svg"}
              alt="Tree of Pips"
              width={150}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        <div className="py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 mx-2 rounded-lg",
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800",
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
