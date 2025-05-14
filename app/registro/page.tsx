"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Eye, EyeOff, ArrowRight, Mail, Loader2 } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { register, loginWithGoogle, checkEmail } = useAuth()
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingEmail, setCheckingEmail] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState(1) // 1: Email, 2: Formulario completo
  const [emailVerified, setEmailVerified] = useState(false) // Para rastrear si el email ha sido verificado
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

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !email.includes("@")) {
      setError("Por favor, introduce un email válido")
      return
    }

    try {
      setCheckingEmail(true)
      const exists = await checkEmail(email)

      if (exists) {
        // Si el email ya existe, redirigir a la página de inicio de sesión
        router.push(`/login?email=${encodeURIComponent(email)}&registered=true`)
      } else {
        // Si el email no existe, avanzar al siguiente paso
        setEmailVerified(true) // Marcar el email como verificado
        setStep(2)
      }
    } catch (error) {
      console.error("Error al verificar email:", error)
      setError("Error al verificar el email. Por favor, inténtalo de nuevo.")
    } finally {
      setCheckingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Verificar que el email ha sido verificado
    if (!emailVerified) {
      setError("Por favor, verifica primero tu email")
      setStep(1)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      setLoading(true)

      // Verificar nuevamente el email antes de intentar registrar
      const exists = await checkEmail(email)
      if (exists) {
        router.push(`/login?email=${encodeURIComponent(email)}&registered=true`)
        return
      }

      const result = await register(nombre, email, password)

      if (!result.success) {
        setError(result.error || "Error al registrar usuario")

        if (result.isEmailInUse) {
          // Si el email ya está en uso, redirigir a la página de inicio de sesión
          router.push(`/login?email=${encodeURIComponent(email)}&registered=true`)
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)

        // Si el mensaje de error indica que el email ya está registrado
        if (error.message.includes("ya está registrado")) {
          setTimeout(() => {
            router.push(`/login?email=${encodeURIComponent(email)}&registered=true`)
          }, 2000) // Dar tiempo para que el usuario vea el mensaje de error
        }
      } else {
        setError("Error al registrar usuario")
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

  // Si el usuario cambia el email después de verificarlo, reiniciar la verificación
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    if (emailVerified) {
      setEmailVerified(false)
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
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Cultiva tu éxito financiero</h2>

            <p className="text-gray-700 dark:text-gray-300">
              Así como un árbol crece con cuidado y paciencia, tu cuenta de trading florecerá con cada operación
              exitosa. Visualiza tu progreso, celebra tus logros y observa cómo tus metas financieras se hacen realidad.
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              Con Tree of Pips, cada paso en tu camino queda registrado en el árbol de tus logros, transformando números
              en una experiencia visual motivadora.
            </p>
          </div>
        </div>
      </div>

      {/* Columna derecha - Formulario */}
      <div className="w-full md:w-1/2 bg-green-50 dark:bg-gray-800 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md border border-green-100 dark:border-green-900">
            <h2 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">
              {step === 1 ? "Comienza tu registro" : "Completa tu registro"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {step === 1 ? "Introduce tu email para comenzar" : "Completa tus datos para crear tu cuenta"}
            </p>

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            {step === 1 ? (
              // Paso 1: Verificación de email
              <form onSubmit={handleCheckEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="tu@email.com"
                    required
                    className="border-green-200 dark:border-green-900 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={checkingEmail}
                  className="w-full bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2"
                >
                  {checkingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

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
                  Registrarse con Google
                </Button>
              </form>
            ) : (
              // Paso 2: Formulario completo
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-display">Email</Label>
                  <div className="flex items-center border border-green-200 dark:border-green-900 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-800">
                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre"
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    required
                    className="border-green-200 dark:border-green-900 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Atrás
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creando...
                      </span>
                    ) : (
                      "Crear cuenta"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-green-700 dark:text-green-400 hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
