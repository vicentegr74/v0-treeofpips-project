"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  signInWithEmail,
  signInWithGoogle,
  registerUser,
  signOut,
  checkEmailExists,
  sendPasswordReset,
} from "@/lib/auth-service"

type User = {
  uid: string
  nombre?: string
  email: string | null
  photoURL?: string | null
  registrado: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (
    nombre: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; isEmailInUse?: boolean }>
  checkEmail: (email: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Usuario autenticado
        setUser({
          uid: firebaseUser.uid,
          nombre: firebaseUser.displayName || undefined,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          registrado: true,
        })

        // Establecer cookie para el middleware
        document.cookie = "auth=true; path=/; max-age=86400" // 24 horas
      } else {
        // Usuario no autenticado
        setUser(null)
        document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }

      setIsLoading(false)
    })

    // Limpiar el listener cuando el componente se desmonte
    return () => unsubscribe()
  }, [])

  const checkEmail = async (email: string): Promise<boolean> => {
    return await checkEmailExists(email)
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)

      // Verificar si el error es porque el usuario no existe
      if (error.code === "auth/user-not-found") {
        throw new Error("No existe una cuenta con este email. Por favor, regístrate.")
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Contraseña incorrecta. Por favor, inténtalo de nuevo.")
      } else {
        throw new Error(error.message || "Credenciales incorrectas")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error)
      throw new Error(error.message || "Error al iniciar sesión con Google")
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (nombre: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await registerUser(nombre, email, password)
      router.push("/dashboard")
      return { success: true }
    } catch (error: any) {
      console.error("Error al registrar:", error)

      // Verificar si el error es porque el email ya está en uso
      if (
        error.code === "auth/email-already-in-use" ||
        (error.message && error.message.includes("ya está registrado"))
      ) {
        return {
          success: false,
          error: "Este email ya está registrado. Por favor, inicia sesión.",
          isEmailInUse: true,
        }
      } else {
        return {
          success: false,
          error: error.message || "Error al crear la cuenta",
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      return await sendPasswordReset(email)
    } catch (error) {
      console.error("Error al enviar email de recuperación:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut()
      // Redirigir a la página de inicio en lugar de la página de inicio de sesión
      router.push("/")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        checkEmail,
        resetPassword,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
