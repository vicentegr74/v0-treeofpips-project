"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { simulateGoogleSignIn, signInWithEmail, registerUser, signOut } from "@/lib/auth-service"

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
  register: (nombre: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
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

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)
      throw new Error(error.message || "Credenciales incorrectas")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Usar nuestra función de simulación de inicio de sesión con Google
      await simulateGoogleSignIn()
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
    } catch (error: any) {
      console.error("Error al registrar:", error)
      throw new Error(error.message || "Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut()
      router.push("/login")
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
