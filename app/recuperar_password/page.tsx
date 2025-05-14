"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function RecuperarPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  // Asegurarse de que el componente está montado antes de acceder al tema
  useEffect(() => {
    setMounted(true)
  }, [])

  // Seleccionar el logo adecuado según el tema
  const logoSrc = mounted
    ? theme === "dark"
      ? "/images/treeofpips-horizontal-oscuro.png"
      : "/images/treeofpips-horizontal-claro.png"
    : "/images/treeofpips-horizontal-claro.png" // Logo por defecto mientras se monta

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!email || !email.includes("@")) {
      setError("Por favor, introduce un email válido")
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      setSuccess(true)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Error al enviar el email de recuperación")
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
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Recupera el acceso a tu cuenta</h2>

            <p className="text-gray-700 dark:text-gray-300">
              No te preocupes, todos olvidamos nuestras contraseñas de vez en cuando. Te enviaremos un enlace para que
              puedas crear una nueva contraseña y volver a acceder a tu cuenta.
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha - Formulario */}
      <div className="w-full md:w-1/2 bg-green-50 dark:bg-gray-800 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-green-100 dark:border-green-900">
            <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Recuperar contraseña</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Introduce tu email y te enviaremos instrucciones para restablecer tu contraseña
            </p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {success ? (
              <div className="space-y-6">
                <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-md flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="text-green-700 dark:text-green-400">
                    <p className="font-medium">Email enviado correctamente</p>
                    <p className="mt-1 text-sm">
                      Hemos enviado un enlace de recuperación a <strong>{email}</strong>. Por favor, revisa tu bandeja
                      de entrada y sigue las instrucciones.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button
                    type="button"
                    onClick={() => {
                      setEmail("")
                      setSuccess(false)
                    }}
                    className="w-full bg-green-700 hover:bg-green-800 text-white"
                  >
                    Enviar a otro email
                  </Button>
                  <Link href="/login">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-green-200 dark:border-green-900 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      Volver a inicio de sesión
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
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

                <Button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-800 text-white">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar instrucciones"
                  )}
                </Button>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-green-700 dark:text-green-400 hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver a inicio de sesión
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
