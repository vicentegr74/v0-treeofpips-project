"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/router"
import { signInWithEmail, signInWithGoogle, registerUser, signOut } from "@/lib/auth-service"

interface AuthContextProps {
  user: any
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  register: (nombre: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for user session here (e.g., using localStorage or cookies)
    // and update the user state accordingly.
    // This is a placeholder; implement your actual session management logic.
  }, [])

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Usar la función real de inicio de sesión con Google
      await signInWithGoogle()
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error)
      throw new Error(error.message || "Error al iniciar sesión con Google")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error)
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
      console.error("Error al registrar usuario:", error)
      throw new Error(error.message || "Error al registrar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error)
      throw new Error(error.message || "Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextProps = {
    user,
    isLoading,
    loginWithGoogle,
    logout,
    register,
    login,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
