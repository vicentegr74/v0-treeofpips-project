import { collection, doc, setDoc, getDocs, query } from "firebase/firestore"
import { db } from "./firebase"
import type { Project, JournalEntry } from "@/context/projects-context"

export async function migrateLocalDataToFirestore(userId: string) {
  try {
    // Verificar si el usuario ya tiene datos en Firestore
    const projectsRef = collection(db, `users/${userId}/projects`)
    const projectsSnapshot = await getDocs(query(projectsRef))

    // Si ya hay datos, no migrar para evitar duplicados
    if (!projectsSnapshot.empty) {
      console.log("El usuario ya tiene datos en Firestore, omitiendo migración")
      return false
    }

    // Obtener datos de localStorage
    const storedProjects = localStorage.getItem("tradingProjects")
    const storedCompletedProjects = localStorage.getItem("tradingCompletedProjects")
    const storedJournalEntries = localStorage.getItem("tradingJournalEntries")

    let hasData = false

    // Migrar proyectos activos
    if (storedProjects) {
      const projects = JSON.parse(storedProjects) as Project[]

      for (const project of projects) {
        // Guardar el proyecto principal
        await setDoc(doc(db, `users/${userId}/projects`, project.id), {
          ...project,
          progressHistory: [], // No guardar el historial en el documento principal
        })

        // Guardar el historial de progreso en subcolección
        for (const entry of project.progressHistory) {
          await setDoc(doc(db, `users/${userId}/projects/${project.id}/progressHistory`, entry.id), entry)
        }
      }

      hasData = true
    }

    // Migrar proyectos completados
    if (storedCompletedProjects) {
      const completedProjects = JSON.parse(storedCompletedProjects) as Project[]

      for (const project of completedProjects) {
        // Guardar el proyecto principal
        await setDoc(doc(db, `users/${userId}/projects`, project.id), {
          ...project,
          progressHistory: [], // No guardar el historial en el documento principal
        })

        // Guardar el historial de progreso en subcolección
        for (const entry of project.progressHistory) {
          await setDoc(doc(db, `users/${userId}/projects/${project.id}/progressHistory`, entry.id), entry)
        }
      }

      hasData = true
    }

    // Migrar entradas de diario
    if (storedJournalEntries) {
      const journalEntries = JSON.parse(storedJournalEntries) as JournalEntry[]

      for (const entry of journalEntries) {
        await setDoc(doc(db, `users/${userId}/journalEntries`, entry.id), entry)
      }

      hasData = true
    }

    console.log("Migración de datos completada con éxito")
    return hasData
  } catch (error) {
    console.error("Error al migrar datos:", error)
    return false
  }
}
