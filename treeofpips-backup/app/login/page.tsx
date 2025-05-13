"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Asegurarse de que el componente está montado antes de acceder al tema
  useEffect(() => {
    setMounted(true)
  }, [])

  // Seleccionar el logo adecuado según el tema (corregido)
  const logoSrc = mounted
    ? theme === "dark"
      ? "/images/treeofpips-horizontal-oscuro.png"
      : "/images/treeofpips-horizontal-claro.png"
    : "/images/treeofpips-horizontal-claro.png" // Logo por defecto mientras se monta

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)
      await login(email, password)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await loginWithGoogle()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error al iniciar sesión con Google")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Columna izquierda - Branding y motivación */}
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-900 p-8 flex flex-col justify-center items-center">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="relative w-72 h-32 mx-auto">
            <Image src={logoSrc || "/placeholder.svg"} alt="Tree of Pips" fill className="object-contain" priority />
          </div>

          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400">El árbol de los Logros del Trading</h1>

          <div className="space-y-4 text-left">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Bienvenido de nuevo</h2>

            <p className="text-gray-700 dark:text-gray-300">
              Continúa cultivando tu éxito financiero. Tu árbol de logros te espera para seguir creciendo con cada
              operación exitosa.
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              Inicia sesión para visualizar tu progreso, celebrar tus logros y seguir transformando tus metas
              financieras en realidad.
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha - Formulario */}
      <div className="w-full md:w-1/2 bg-green-50 dark:bg-gray-800 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-green-100 dark:border-green-900">
            <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Iniciar sesión</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Accede a tu cuenta para continuar</p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="border-green-200 dark:border-green-900 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                    className="border-green-200 dark:border-green-900 focus:border-green-500 focus:ring-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white">
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">O continúa con</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              Iniciar sesión con Google
            </Button>

            <div className="mt-6 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/registro" className="text-green-700 dark:text-green-400 hover:underline">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
