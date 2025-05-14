"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  collection,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
  onSnapshot,
} from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { useAuthState } from "react-firebase-hooks/auth"

// Importar el servicio de sincronización offline
import { setupOfflineSync } from "@/lib/offline-sync"

// Define project type
// Actualizar la interfaz Project para incluir el nuevo formato de hitos
export interface Project {
  id: string
  title: string
  description: string
  initialCapital: number
  currentBalance: number
  targetAmount: number
  totalTarget: number
  startDate: string
  targetDate: string
  milestones: {
    "25%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
    "50%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
    "75%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
  }
  progressPercentage: number
  goalFrequency?: string
  goalAmount?: number
  type: "forex" | "criptomonedas" | "acciones" | "otros" // Tipo de proyecto
  progressHistory: ProgressEntry[] // Historial de progreso
  lastUpdated: string // Última actualización
}

// Entrada de progreso
export interface ProgressEntry {
  id: string
  date: string
  amount: number
  balance: number
  progressPercentage: number
}

// Entrada de diario
export interface JournalEntry {
  id: string
  projectId: string
  content: string
  date: string
}

// Actualizar los datos iniciales para que sean compatibles con el nuevo formato de hitos
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Inversión en Forex",
    description: "Estrategia de trading en pares EUR/USD",
    initialCapital: 1000,
    currentBalance: 1250,
    targetAmount: 500,
    totalTarget: 1500,
    startDate: "2023-01-15",
    targetDate: "2023-07-15",
    milestones: {
      "25%": {
        date: "2023-03-01",
        achieved: true,
        achievedDate: "2023-02-05",
      },
      "50%": {
        date: "2023-04-15",
        achieved: true,
        achievedDate: "2023-03-10",
      },
      "75%": {
        date: "2023-06-01",
        achieved: false,
        achievedDate: null,
      },
    },
    progressPercentage: 50,
    goalFrequency: "daily",
    goalAmount: 10,
    type: "forex",
    progressHistory: [
      {
        id: "p1-1",
        date: "2023-01-20",
        amount: 50,
        balance: 1050,
        progressPercentage: 10,
      },
      {
        id: "p1-2",
        date: "2023-02-05",
        amount: 75,
        balance: 1125,
        progressPercentage: 25,
      },
      {
        id: "p1-3",
        date: "2023-03-10",
        amount: 125,
        balance: 1250,
        progressPercentage: 50,
      },
    ],
    lastUpdated: "2023-03-10",
  },
  {
    id: "2",
    title: "Trading de Criptomonedas",
    description: "Inversión en Bitcoin y Ethereum",
    initialCapital: 2000,
    currentBalance: 2300,
    targetAmount: 1000,
    totalTarget: 3000,
    startDate: "2023-02-10",
    targetDate: "2023-08-10",
    milestones: {
      "25%": {
        date: "2023-03-25",
        achieved: true,
        achievedDate: "2023-03-01",
      },
      "50%": {
        date: "2023-05-10",
        achieved: false,
        achievedDate: null,
      },
      "75%": {
        date: "2023-06-25",
        achieved: false,
        achievedDate: null,
      },
    },
    progressPercentage: 30,
    goalFrequency: "weekly",
    goalAmount: 50,
    type: "criptomonedas",
    progressHistory: [
      {
        id: "p2-1",
        date: "2023-02-15",
        amount: 100,
        balance: 2100,
        progressPercentage: 10,
      },
      {
        id: "p2-2",
        date: "2023-03-01",
        amount: 200,
        balance: 2300,
        progressPercentage: 30,
      },
    ],
    lastUpdated: "2023-03-01",
  },
]

const completedProjectsData: Project[] = [
  {
    id: "3",
    title: "Swing Trading Acciones",
    description: "Estrategia de swing trading en el mercado de valores",
    initialCapital: 5000,
    currentBalance: 6500,
    targetAmount: 1000,
    totalTarget: 6000,
    startDate: "2022-10-05",
    targetDate: "2023-01-05",
    milestones: {
      "25%": {
        date: "2022-10-20",
        achieved: true,
        achievedDate: "2022-10-15",
      },
      "50%": {
        date: "2022-11-15",
        achieved: true,
        achievedDate: "2022-11-10",
      },
      "75%": {
        date: "2022-12-10",
        achieved: true,
        achievedDate: "2022-12-10",
      },
    },
    progressPercentage: 100,
    goalFrequency: "monthly",
    goalAmount: 200,
    type: "acciones",
    progressHistory: [
      {
        id: "p3-1",
        date: "2022-10-15",
        amount: 200,
        balance: 5200,
        progressPercentage: 20,
      },
      {
        id: "p3-2",
        date: "2022-11-10",
        amount: 500,
        balance: 5700,
        progressPercentage: 70,
      },
      {
        id: "p3-3",
        date: "2022-12-20",
        amount: 800,
        balance: 6500,
        progressPercentage: 100,
      },
    ],
    lastUpdated: "2022-12-20",
  },
]

// Datos iniciales de entradas de diario
const initialJournalEntries: JournalEntry[] = [
  {
    id: "j1",
    projectId: "1",
    content: "Hoy apliqué la estrategia de cruce de medias móviles y obtuve buenos resultados.",
    date: "2023-03-10",
  },
  {
    id: "j2",
    projectId: "2",
    content: "El mercado de criptomonedas está volátil. Mantendré posiciones conservadoras.",
    date: "2023-03-01",
  },
  {
    id: "j3",
    projectId: "3",
    content: "Cerré todas las posiciones con beneficio. Proyecto completado exitosamente.",
    date: "2022-12-20",
  },
]

interface ProjectsContextType {
  projects: Project[]
  completedProjects: Project[]
  journalEntries: JournalEntry[]
  loading: boolean
  getProject: (id: string) => Project | undefined
  getProjectJournalEntries: (projectId: string) => JournalEntry[]
  addProject: (
    project: Omit<
      Project,
      "id" | "totalTarget" | "progressPercentage" | "milestones" | "progressHistory" | "lastUpdated"
    >,
  ) => Promise<string>
  updateProject: (project: Project) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  updateProjectProgress: (id: string, progressAmount: number) => Promise<void>
  addJournalEntry: (projectId: string, content: string) => Promise<void>
  getStreak: () => number
  getMonthlyData: () => any[]
  getProjectTypeDistribution: () => any[]
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [user, userLoading] = useAuthState(auth)
  const [projects, setProjects] = useState<Project[]>([])
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  // Dentro de ProjectsProvider, añadir:
  const [offlineSync, setOfflineSync] = useState<any>(null)

  // Load projects from Firestore or localStorage on initial render
  // En el primer useEffect, después de setLoading(true):
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      // Configurar sincronización offline
      const syncService = setupOfflineSync()
      setOfflineSync(syncService)

      // Si el usuario está cargando, esperar
      if (userLoading) {
        return
      }

      // Si no hay usuario autenticado, cargar desde localStorage
      if (!user) {
        const storedProjects = localStorage.getItem("tradingProjects")
        const storedCompletedProjects = localStorage.getItem("tradingCompletedProjects")
        const storedJournalEntries = localStorage.getItem("tradingJournalEntries")

        if (storedProjects) {
          setProjects(JSON.parse(storedProjects))
        } else {
          setProjects(initialProjects)
        }

        if (storedCompletedProjects) {
          setCompletedProjects(JSON.parse(storedCompletedProjects))
        } else {
          setCompletedProjects(completedProjectsData)
        }

        if (storedJournalEntries) {
          setJournalEntries(JSON.parse(storedJournalEntries))
        } else {
          setJournalEntries(initialJournalEntries)
        }

        setLoading(false)
        return
      }

      // Si hay usuario, cargar desde Firestore
      try {
        // Configurar listeners para proyectos activos
        const activeProjectsRef = collection(db, `users/${user.uid}/projects`)
        const activeProjectsQuery = query(activeProjectsRef, where("progressPercentage", "<", 100))

        const unsubscribeActive = onSnapshot(activeProjectsQuery, async (snapshot) => {
          const activeProjects: Project[] = []

          for (const docSnapshot of snapshot.docs) {
            const projectData = docSnapshot.data() as Omit<Project, "id" | "progressHistory">

            // Cargar historial de progreso
            const historyRef = collection(db, `users/${user.uid}/projects/${docSnapshot.id}/progressHistory`)
            const historyQuery = query(historyRef, orderBy("date", "asc"))
            const historySnapshot = await getDocs(historyQuery)

            const progressHistory = historySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              date:
                doc.data().date instanceof Timestamp
                  ? doc.data().date.toDate().toISOString().split("T")[0]
                  : doc.data().date,
            })) as ProgressEntry[]

            activeProjects.push({
              id: docSnapshot.id,
              ...projectData,
              progressHistory,
            })
          }

          setProjects(activeProjects)
          setLoading(false)
        })

        // Configurar listeners para proyectos completados
        const completedProjectsRef = collection(db, `users/${user.uid}/projects`)
        const completedProjectsQuery = query(completedProjectsRef, where("progressPercentage", ">=", 100))

        const unsubscribeCompleted = onSnapshot(completedProjectsQuery, async (snapshot) => {
          const completedProjects: Project[] = []

          for (const docSnapshot of snapshot.docs) {
            const projectData = docSnapshot.data() as Omit<Project, "id" | "progressHistory">

            // Cargar historial de progreso
            const historyRef = collection(db, `users/${user.uid}/projects/${docSnapshot.id}/progressHistory`)
            const historyQuery = query(historyRef, orderBy("date", "asc"))
            const historySnapshot = await getDocs(historyQuery)

            const progressHistory = historySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              date:
                doc.data().date instanceof Timestamp
                  ? doc.data().date.toDate().toISOString().split("T")[0]
                  : doc.data().date,
            })) as ProgressEntry[]

            completedProjects.push({
              id: docSnapshot.id,
              ...projectData,
              progressHistory,
            })
          }

          setCompletedProjects(completedProjects)
        })

        // Configurar listener para entradas de diario
        const journalRef = collection(db, `users/${user.uid}/journalEntries`)
        const journalQuery = query(journalRef, orderBy("date", "desc"))

        const unsubscribeJournal = onSnapshot(journalQuery, (snapshot) => {
          const entries = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date:
              doc.data().date instanceof Timestamp
                ? doc.data().date.toDate().toISOString().split("T")[0]
                : doc.data().date,
          })) as JournalEntry[]

          setJournalEntries(entries)
        })

        // Limpiar listeners cuando el componente se desmonte
        return () => {
          unsubscribeActive()
          unsubscribeCompleted()
          unsubscribeJournal()
        }
      } catch (error) {
        console.error("Error loading data from Firestore:", error)
        setLoading(false)

        // Fallback a localStorage en caso de error
        const storedProjects = localStorage.getItem("tradingProjects")
        const storedCompletedProjects = localStorage.getItem("tradingCompletedProjects")
        const storedJournalEntries = localStorage.getItem("tradingJournalEntries")

        if (storedProjects) setProjects(JSON.parse(storedProjects))
        if (storedCompletedProjects) setCompletedProjects(JSON.parse(storedCompletedProjects))
        if (storedJournalEntries) setJournalEntries(JSON.parse(storedJournalEntries))
      }
    }

    loadData()
  }, [user, userLoading])

  // Save projects to localStorage whenever they change (como respaldo)
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("tradingProjects", JSON.stringify(projects))
    }
    if (completedProjects.length > 0) {
      localStorage.setItem("tradingCompletedProjects", JSON.stringify(completedProjects))
    }
    if (journalEntries.length > 0) {
      localStorage.setItem("tradingJournalEntries", JSON.stringify(journalEntries))
    }
  }, [projects, completedProjects, journalEntries])

  // Get a specific project by ID
  const getProject = (id: string) => {
    return projects.find((p) => p.id === id) || completedProjects.find((p) => p.id === id)
  }

  // Get journal entries for a specific project
  const getProjectJournalEntries = (projectId: string) => {
    return journalEntries.filter((entry) => entry.projectId === projectId)
  }

  // Actualizar la función addProject para usar Firestore
  // Modificar la función addProject:
  const addProject = async (
    projectData: Omit<
      Project,
      "id" | "totalTarget" | "progressPercentage" | "milestones" | "progressHistory" | "lastUpdated"
    >,
  ) => {
    try {
      const today = new Date().toISOString().split("T")[0]

      // Asegurarse de que los valores numéricos sean números
      const initialCapital = Number(projectData.initialCapital)
      const currentBalance = Number(projectData.currentBalance)
      const targetAmount = Number(projectData.targetAmount)

      // Calcular el progreso inicial (debería ser 0 para un nuevo proyecto)
      const progressPercentage = 0

      // Calcular el total objetivo correctamente
      const totalTarget = initialCapital + targetAmount

      // Calcular hitos
      const milestones = calculateMilestones(projectData.startDate, projectData.targetDate)

      // Crear el objeto del proyecto
      const newProjectData = {
        ...projectData,
        initialCapital,
        currentBalance,
        targetAmount,
        totalTarget,
        progressPercentage,
        milestones,
        lastUpdated: today,
        createdAt: new Date().toISOString(), // Usar string en lugar de serverTimestamp para compatibilidad offline
      }

      let projectId: string

      if (user) {
        // Si hay usuario y conexión, guardar en Firestore
        if (navigator.onLine) {
          const projectRef = collection(db, `users/${user.uid}/projects`)
          const docRef = await addDoc(projectRef, newProjectData)
          projectId = docRef.id
        } else {
          // Si no hay conexión, generar ID local y registrar para sincronización futura
          projectId = `local_${Date.now()}`
          if (offlineSync) {
            offlineSync.registerPendingChange(`users/${user.uid}/projects/${projectId}`, newProjectData, "add")
          }
        }
      } else {
        // Si no hay usuario, guardar en localStorage
        projectId = `local_${Date.now()}`
      }

      // Crear el nuevo proyecto con todos los campos requeridos
      const newProject: Project = {
        ...newProjectData,
        id: projectId,
        progressHistory: [],
      }

      // Añadir el nuevo proyecto a la lista local
      setProjects((prev) => [...prev, newProject])

      // Registrar éxito en la consola para depuración
      console.log("Proyecto creado exitosamente:", newProject)

      return projectId
    } catch (error) {
      // Registrar error en la consola para depuración
      console.error("Error al crear proyecto:", error)
      throw error
    }
  }

  // Update an existing project
  const updateProject = async (updatedProject: Project) => {
    try {
      // Actualizar en Firestore si hay usuario
      if (user) {
        const projectRef = doc(db, `users/${user.uid}/projects`, updatedProject.id)

        // No incluir progressHistory en el documento principal
        const { progressHistory, ...projectWithoutHistory } = updatedProject

        await updateDoc(projectRef, projectWithoutHistory)
      }

      // Actualizar estado local
      if (projects.some((p) => p.id === updatedProject.id)) {
        setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
      } else if (completedProjects.some((p) => p.id === updatedProject.id)) {
        setCompletedProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)))
      }
    } catch (error) {
      console.error("Error al actualizar proyecto:", error)
      throw error
    }
  }

  // Delete a project
  const deleteProject = async (id: string) => {
    try {
      // Guardar el nombre del proyecto antes de eliminarlo para la notificación
      const projectToDelete = getProject(id)
      const projectName = projectToDelete?.title || "Proyecto"

      // Eliminar de Firestore si hay usuario
      if (user) {
        // Eliminar el proyecto
        await deleteDoc(doc(db, `users/${user.uid}/projects`, id))

        // Eliminar historial de progreso
        const historyRef = collection(db, `users/${user.uid}/projects/${id}/progressHistory`)
        const historySnapshot = await getDocs(historyRef)

        const deletePromises = historySnapshot.docs.map((doc) => deleteDoc(doc.ref))

        await Promise.all(deletePromises)

        // Eliminar entradas de diario asociadas
        const journalQuery = query(collection(db, `users/${user.uid}/journalEntries`), where("projectId", "==", id))

        const journalSnapshot = await getDocs(journalQuery)

        const deleteJournalPromises = journalSnapshot.docs.map((doc) => deleteDoc(doc.ref))

        await Promise.all(deleteJournalPromises)
      }

      // Actualizar estado local
      setProjects((prev) => prev.filter((p) => p.id !== id))
      setCompletedProjects((prev) => prev.filter((p) => p.id !== id))
      setJournalEntries((prev) => prev.filter((entry) => entry.projectId !== id))

      // Mostrar notificación
      try {
        if (typeof window !== "undefined") {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Proyecto eliminado", {
              body: `El proyecto "${projectName}" ha sido eliminado correctamente.`,
            })
          }
        }
      } catch (error) {
        console.error("Error al mostrar notificación:", error)
      }
    } catch (error) {
      console.error("Error al eliminar proyecto:", error)
      throw error
    }
  }

  // Modificar la función updateProjectProgress para usar Firestore
  const updateProjectProgress = async (id: string, progressAmount: number) => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const project = getProject(id)

      if (!project) {
        throw new Error("Proyecto no encontrado")
      }

      const newBalance = project.currentBalance + progressAmount
      const newProgressPercentage = Math.min(
        100,
        Math.round(((newBalance - project.initialCapital) / project.targetAmount) * 100),
      )

      // Crear nueva entrada de progreso
      const newProgressEntry: ProgressEntry = {
        id: `p${project.id}-${Date.now()}`,
        date: today,
        amount: progressAmount,
        balance: newBalance,
        progressPercentage: newProgressPercentage,
      }

      // Actualizar hitos basados en el progreso
      const updatedMilestones = { ...project.milestones }

      // Verificar si se han alcanzado nuevos hitos
      if (newProgressPercentage >= 25 && !project.milestones["25%"].achieved) {
        updatedMilestones["25%"] = {
          ...updatedMilestones["25%"],
          achieved: true,
          achievedDate: today,
        }
      }

      if (newProgressPercentage >= 50 && !project.milestones["50%"].achieved) {
        updatedMilestones["50%"] = {
          ...updatedMilestones["50%"],
          achieved: true,
          achievedDate: today,
        }
      }

      if (newProgressPercentage >= 75 && !project.milestones["75%"].achieved) {
        updatedMilestones["75%"] = {
          ...updatedMilestones["75%"],
          achieved: true,
          achievedDate: today,
        }
      }

      // Guardar en Firestore si hay usuario
      if (user) {
        // Guardar la entrada de progreso
        const progressRef = collection(db, `users/${user.uid}/projects/${id}/progressHistory`)
        await addDoc(progressRef, {
          ...newProgressEntry,
          date: today,
        })

        // Actualizar el proyecto
        const projectRef = doc(db, `users/${user.uid}/projects`, id)

        await updateDoc(projectRef, {
          currentBalance: newBalance,
          progressPercentage: newProgressPercentage,
          lastUpdated: today,
          milestones: updatedMilestones,
        })

        // Si el proyecto está completo, moverlo a completados
        if (newProgressPercentage >= 100) {
          await updateDoc(projectRef, {
            progressPercentage: 100,
          })
        }
      }

      // Actualizar estado local
      if (newProgressPercentage >= 100) {
        // Si proyecto está completo, moverlo a completados
        const completedProject = {
          ...project,
          currentBalance: newBalance,
          progressPercentage: 100,
          progressHistory: [...project.progressHistory, newProgressEntry],
          lastUpdated: today,
          milestones: updatedMilestones,
        }

        setCompletedProjects((prev) => [...prev, completedProject])
        setProjects((prev) => prev.filter((p) => p.id !== id))
      } else {
        // Actualizar proyecto existente
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === id) {
              return {
                ...p,
                currentBalance: newBalance,
                progressPercentage: newProgressPercentage,
                progressHistory: [...p.progressHistory, newProgressEntry],
                lastUpdated: today,
                milestones: updatedMilestones,
              }
            }
            return p
          }),
        )
      }
    } catch (error) {
      console.error("Error al actualizar progreso:", error)
      throw error
    }
  }

  // Añadir entrada de diario usando Firestore
  const addJournalEntry = async (projectId: string, content: string) => {
    try {
      const today = new Date().toISOString().split("T")[0]

      let entryId: string

      // Crear objeto de entrada
      const newEntryData = {
        projectId,
        content,
        date: today,
      }

      if (user) {
        // Guardar en Firestore
        const entryRef = collection(db, `users/${user.uid}/journalEntries`)
        const docRef = await addDoc(entryRef, newEntryData)
        entryId = docRef.id

        // Actualizar la fecha de última actualización del proyecto
        const projectRef = doc(db, `users/${user.uid}/projects`, projectId)
        await updateDoc(projectRef, {
          lastUpdated: today,
        })
      } else {
        // Guardar en localStorage
        entryId = Date.now().toString()
      }

      const newEntry: JournalEntry = {
        id: entryId,
        ...newEntryData,
      }

      // Actualizar estado local
      setJournalEntries((prev) => [newEntry, ...prev])

      // Actualizar la fecha de última actualización del proyecto en estado local
      const project = getProject(projectId)
      if (project) {
        const updatedProject = {
          ...project,
          lastUpdated: today,
        }

        // Solo actualizar estado local, Firestore ya se actualizó arriba
        if (projects.some((p) => p.id === projectId)) {
          setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
        } else if (completedProjects.some((p) => p.id === projectId)) {
          setCompletedProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)))
        }
      }
    } catch (error) {
      console.error("Error al añadir entrada de diario:", error)
      throw error
    }
  }

  // Calcular racha actual (sin cambios, usa datos locales)
  const getStreak = () => {
    // Ordenar todas las actualizaciones (progreso + diario) por fecha
    const allUpdates: { date: string }[] = [
      ...journalEntries,
      ...projects.flatMap((p) => p.progressHistory),
      ...completedProjects.flatMap((p) => p.progressHistory),
    ]

    if (allUpdates.length === 0) return 0

    // Ordenar por fecha descendente
    allUpdates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Obtener fechas únicas
    const uniqueDates = Array.from(new Set(allUpdates.map((update) => update.date)))

    // Si no hay actualizaciones recientes, no hay racha
    if (uniqueDates.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = 0
    const currentDate = new Date(today)

    // Verificar cada día hacia atrás
    while (true) {
      const dateString = currentDate.toISOString().split("T")[0]
      if (uniqueDates.includes(dateString)) {
        streak++
      } else {
        // Si falta un día, la racha se rompe
        break
      }

      // Retroceder un día
      currentDate.setDate(currentDate.getDate() - 1)

      // Limitar a 365 días para evitar bucles infinitos
      if (streak > 365) break
    }

    return streak
  }

  // Obtener datos mensuales para gráficos (sin cambios, usa datos locales)
  const getMonthlyData = () => {
    const allProjects = [...projects, ...completedProjects]
    const months: { [key: string]: { month: string; profit: number; goal: number } } = {}

    // Nombres de meses en español
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

    // Inicializar los últimos 6 meses
    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today)
      d.setMonth(d.getMonth() - i)
      const monthKey = `${d.getFullYear()}-${d.getMonth() + 1}`
      months[monthKey] = {
        month: monthNames[d.getMonth()],
        profit: 0,
        goal: 0,
      }
    }

    // Calcular ganancias reales por mes
    allProjects.forEach((project) => {
      project.progressHistory.forEach((entry) => {
        const entryDate = new Date(entry.date)
        const monthKey = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}`

        if (months[monthKey]) {
          months[monthKey].profit += entry.amount
        }
      })

      // Calcular objetivos mensuales basados en goalAmount y goalFrequency
      if (project.goalAmount && project.goalFrequency) {
        const startDate = new Date(project.startDate)
        const endDate = new Date(project.targetDate)

        // Solo considerar meses dentro del rango del proyecto
        for (const monthKey in months) {
          const [year, month] = monthKey.split("-").map(Number)
          const monthDate = new Date(year, month - 1, 15) // Mitad del mes

          if (monthDate >= startDate && monthDate <= endDate) {
            let monthlyGoal = 0

            switch (project.goalFrequency) {
              case "daily":
                // Días en el mes
                const daysInMonth = new Date(year, month, 0).getDate()
                monthlyGoal = project.goalAmount * daysInMonth
                break
              case "weekly":
                // Aproximadamente 4.33 semanas por mes
                monthlyGoal = project.goalAmount * 4.33
                break
              case "monthly":
                monthlyGoal = project.goalAmount
                break
            }

            months[monthKey].goal += monthlyGoal
          }
        }
      }
    })

    // Convertir a array y redondear valores
    return Object.values(months).map((month) => ({
      ...month,
      profit: Math.round(month.profit),
      goal: Math.round(month.goal),
    }))
  }

  // Obtener distribución de proyectos por tipo (sin cambios, usa datos locales)
  const getProjectTypeDistribution = () => {
    const allProjects = [...projects, ...completedProjects]
    const distribution: { [key: string]: { name: string; value: number } } = {
      forex: { name: "Forex", value: 0 },
      criptomonedas: { name: "Criptomonedas", value: 0 },
      acciones: { name: "Acciones", value: 0 },
      otros: { name: "Otros", value: 0 },
    }

    // Calcular distribución basada en capital invertido
    allProjects.forEach((project) => {
      distribution[project.type].value += project.initialCapital
    })

    // Convertir a array y filtrar tipos sin valor
    return Object.values(distribution).filter((item) => item.value > 0)
  }

  // Helper function to calculate milestone dates based on progress
  const calculateMilestones = (startDate: string, targetDate: string) => {
    try {
      const start = new Date(startDate)
      const end = new Date(targetDate)

      // Verificar que las fechas sean válidas
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Fechas inválidas")
      }

      const totalDays = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

      // Calculamos las fechas estimadas para alcanzar cada hito de progreso
      const milestone25 = new Date(start.getTime() + totalDays * 0.25 * 24 * 60 * 60 * 1000)
      const milestone50 = new Date(start.getTime() + totalDays * 0.5 * 24 * 60 * 60 * 1000)
      const milestone75 = new Date(start.getTime() + totalDays * 0.75 * 24 * 60 * 60 * 1000)

      return {
        "25%": {
          date: milestone25.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
        "50%": {
          date: milestone50.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
        "75%": {
          date: milestone75.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
      }
    } catch (error) {
      console.error("Error al calcular hitos:", error)

      // Devolver hitos predeterminados en caso de error
      const today = new Date()
      const oneMonth = new Date(today)
      oneMonth.setMonth(today.getMonth() + 1)

      const twoMonths = new Date(today)
      twoMonths.setMonth(today.getMonth() + 2)

      const threeMonths = new Date(today)
      threeMonths.setMonth(today.getMonth() + 3)

      return {
        "25%": {
          date: oneMonth.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
        "50%": {
          date: twoMonths.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
        "75%": {
          date: threeMonths.toISOString().split("T")[0],
          achieved: false,
          achievedDate: null,
        },
      }
    }
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        completedProjects,
        journalEntries,
        loading,
        getProject,
        getProjectJournalEntries,
        addProject,
        updateProject,
        deleteProject,
        updateProjectProgress,
        addJournalEntry,
        getStreak,
        getMonthlyData,
        getProjectTypeDistribution,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
