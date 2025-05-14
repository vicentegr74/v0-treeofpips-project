import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "./firebase"

// Función para verificar si un email ya está registrado
export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email)
    // Si hay métodos de inicio de sesión disponibles, el email ya está registrado
    return methods.length > 0
  } catch (error) {
    console.error("Error al verificar email:", error)
    // En caso de error, asumimos que el email no existe para permitir continuar
    return false
  }
}

// Función para iniciar sesión con Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    return userCredential.user
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error)
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
    // Verificar primero si el email ya existe
    const emailExists = await checkEmailExists(email)
    if (emailExists) {
      const error = new Error("Este email ya está registrado. Por favor, inicia sesión.")
      ;(error as any).code = "auth/email-already-in-use"
      throw error
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, {
      displayName: nombre,
    })
    return userCredential.user
  } catch (error) {
    console.error("Error al registrar usuario:", error)

    // Verificar si es un error de Firebase y si el email ya está en uso
    if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
      // Crear un nuevo error con un mensaje personalizado
      const customError = new Error("Este email ya está registrado. Por favor, inicia sesión.")
      // Añadir la propiedad code al error para poder identificarlo después
      ;(customError as any).code = "auth/email-already-in-use"
      throw customError
    }

    throw error
  }
}

// Función para enviar email de recuperación de contraseña
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return true
  } catch (error) {
    console.error("Error al enviar email de recuperación:", error)
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
