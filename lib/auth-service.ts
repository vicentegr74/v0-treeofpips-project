import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { auth } from "./firebase"

// Función para generar un ID único
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Función para simular el inicio de sesión con Google
export const simulateGoogleSignIn = async () => {
  try {
    // Generar un email único para evitar colisiones
    const uniqueId = generateUniqueId()
    const email = `google-user-${uniqueId}@example.com`
    const password = `Password123!${uniqueId}`

    try {
      // Intentar crear un nuevo usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizar el perfil con datos simulados de Google
      await updateProfile(userCredential.user, {
        displayName: "Usuario de Google (Simulado)",
        photoURL: "https://via.placeholder.com/150",
      })

      return userCredential.user
    } catch (error: any) {
      // Si el usuario ya existe (aunque es poco probable con IDs únicos)
      if (error.code === "auth/email-already-in-use") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
      }
      throw error
    }
  } catch (error) {
    console.error("Error al simular inicio de sesión con Google:", error)
    throw error
  }
}

// Función para iniciar sesión con email y contraseña
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error al iniciar sesión con email:", error)
    throw error
  }
}

// Función para registrar un nuevo usuario
export const registerUser = async (nombre: string, email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: nombre,
    })
    return userCredential.user
  } catch (error) {
    console.error("Error al registrar usuario:", error)
    throw error
  }
}

// Función para cerrar sesión
export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    throw error
  }
}
