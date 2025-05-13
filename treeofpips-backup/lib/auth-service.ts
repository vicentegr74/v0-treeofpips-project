import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
} from "firebase/auth"
import { auth } from "./firebase"

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
