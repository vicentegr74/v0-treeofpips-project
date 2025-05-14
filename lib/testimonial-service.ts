"use client"

import { db } from "./firebase"
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"
import type { Testimonial } from "@/types/testimonial"

// Colección de testimonios en Firestore
const TESTIMONIALS_COLLECTION = "testimonials"

// Obtener testimonios aprobados para mostrar en la página de inicio
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonialsQuery = query(collection(db, TESTIMONIALS_COLLECTION), where("approved", "==", true))

    const snapshot = await getDocs(testimonialsQuery)

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Testimonial,
    )
  } catch (error) {
    console.error("Error al obtener testimonios:", error)
    return []
  }
}

// Enviar un nuevo testimonio (para usuarios)
export async function submitTestimonial(
  testimonial: Omit<Testimonial, "id" | "approved" | "createdAt">,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLLECTION), {
      ...testimonial,
      approved: false, // Los testimonios requieren aprobación antes de mostrarse
      createdAt: serverTimestamp(),
    })

    return docRef.id
  } catch (error) {
    console.error("Error al enviar testimonio:", error)
    throw error
  }
}

// Aprobar un testimonio (para administradores)
export async function approveTestimonial(id: string): Promise<void> {
  try {
    const testimonialRef = doc(db, TESTIMONIALS_COLLECTION, id)
    await updateDoc(testimonialRef, {
      approved: true,
    })
  } catch (error) {
    console.error("Error al aprobar testimonio:", error)
    throw error
  }
}

// Eliminar un testimonio (para administradores)
export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const testimonialRef = doc(db, TESTIMONIALS_COLLECTION, id)
    await deleteDoc(testimonialRef)
  } catch (error) {
    console.error("Error al eliminar testimonio:", error)
    throw error
  }
}

// Obtener todos los testimonios (para administradores)
export async function getAllTestimonials(): Promise<Testimonial[]> {
  try {
    const snapshot = await getDocs(collection(db, TESTIMONIALS_COLLECTION))

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Testimonial,
    )
  } catch (error) {
    console.error("Error al obtener todos los testimonios:", error)
    return []
  }
}
