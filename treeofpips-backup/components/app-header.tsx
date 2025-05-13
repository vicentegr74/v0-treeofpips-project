"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import { useTheme } from "next-themes"

export function AppHeader() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc =
    mounted && theme === "dark" ? "/images/treeofpips-horizontal-oscuro.png" : "/images/treeofpips-horizontal-claro.png"

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container flex h-20 items-center justify-between py-4">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <div className="relative h-16 w-64 sm:w-80">
              <Image src={logoSrc || "/placeholder.svg"} alt="Tree of Pips" fill className="object-contain" priority />
            </div>
          </Link>
        </div>

        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
