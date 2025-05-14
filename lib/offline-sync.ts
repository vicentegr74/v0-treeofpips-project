import { db } from "./firebase"
import { doc, setDoc, Timestamp } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"

// Función para sincronizar datos cuando la app vuelve a estar online
export function setupOfflineSync() {
  if (typeof window === "undefined") return

  // Estado de conexión
  let isOnline = navigator.onLine
  let pendingChanges: any[] = []

  // Cargar cambios pendientes del localStorage
  try {
    const storedChanges = localStorage.getItem("pendingChanges")
    if (storedChanges) {
      pendingChanges = JSON.parse(storedChanges)
    }
  } catch (error) {
    console.error("Error al cargar cambios pendientes:", error)
  }

  // Detectar cuando la app vuelve a estar online
  window.addEventListener("online", async () => {
    isOnline = true
    console.log("Conexión restablecida, sincronizando datos...")

    // Mostrar notificación al usuario
    showNotification("Conexión restablecida", "Sincronizando tus datos...")

    try {
      await syncPendingChanges()
      showNotification("Sincronización completada", "Todos tus datos están actualizados")
    } catch (error) {
      console.error("Error al sincronizar datos:", error)
      showNotification("Error de sincronización", "No se pudieron sincronizar todos los datos")
    }
  })

  // Detectar cuando la app pierde conexión
  window.addEventListener("offline", () => {
    isOnline = false
    console.log("Conexión perdida, los cambios se guardarán localmente")

    // Mostrar notificación al usuario
    showNotification(
      "Modo sin conexión activado",
      "Los cambios se guardarán localmente y se sincronizarán cuando vuelvas a estar online",
    )
  })

  // Verificar estado de conexión al iniciar
  if (!navigator.onLine) {
    isOnline = false
    console.log("Iniciando en modo sin conexión")
  }

  // Función para sincronizar cambios pendientes
  async function syncPendingChanges() {
    const auth = getAuth()

    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          console.log("No hay usuario autenticado para sincronizar")
          return resolve(null)
        }

        if (pendingChanges.length === 0) {
          console.log("No hay cambios pendientes para sincronizar")
          return resolve(null)
        }

        try {
          console.log(`Sincronizando ${pendingChanges.length} cambios pendientes...`)

          // Procesar cada cambio pendiente
          const promises = pendingChanges.map(async (change) => {
            try {
              const { path, data, operation, timestamp } = change

              if (operation === "add" || operation === "update") {
                // Convertir fechas string a Timestamp de Firestore
                const processedData = processDataForFirestore(data)
                await setDoc(doc(db, path), processedData, { merge: true })
              }
              // Aquí se pueden agregar más operaciones como delete, etc.

              return { success: true, change }
            } catch (error) {
              console.error(`Error al procesar cambio: ${JSON.stringify(change)}`, error)
              return { success: false, change, error }
            }
          })

          const results = await Promise.all(promises)
          const successfulChanges = results.filter((r) => r.success)
          const failedChanges = results.filter((r) => !r.success)

          console.log(
            `Sincronización completada: ${successfulChanges.length} exitosos, ${failedChanges.length} fallidos`,
          )

          // Actualizar la lista de cambios pendientes con solo los fallidos
          pendingChanges = failedChanges.map((r) => r.change)
          localStorage.setItem("pendingChanges", JSON.stringify(pendingChanges))

          resolve(results)
        } catch (error) {
          console.error("Error durante la sincronización:", error)
          reject(error)
        }
      })
    })
  }

  // Función para procesar datos antes de enviarlos a Firestore
  function processDataForFirestore(data: any): any {
    if (!data) return data

    // Si es un array, procesar cada elemento
    if (Array.isArray(data)) {
      return data.map((item) => processDataForFirestore(item))
    }

    // Si es un objeto, procesar cada propiedad
    if (typeof data === "object") {
      const result: any = {}

      for (const [key, value] of Object.entries(data)) {
        // Convertir fechas string a Timestamp
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value)) {
          try {
            result[key] = Timestamp.fromDate(new Date(value))
          } catch (e) {
            result[key] = value
          }
        }
        // Procesar objetos anidados
        else if (typeof value === "object" && value !== null) {
          result[key] = processDataForFirestore(value)
        }
        // Mantener otros valores sin cambios
        else {
          result[key] = value
        }
      }

      return result
    }

    return data
  }

  // Función para registrar cambios pendientes
  return {
    registerPendingChange: (path: string, data: any, operation: "add" | "update" | "delete") => {
      if (!isOnline) {
        const change = {
          path,
          data,
          operation,
          timestamp: new Date().toISOString(),
        }

        pendingChanges.push(change)
        localStorage.setItem("pendingChanges", JSON.stringify(pendingChanges))
        console.log(`Cambio registrado para sincronización futura: ${operation} en ${path}`)

        return false // Indica que el cambio se guardó localmente
      }

      return true // Indica que hay conexión y no es necesario guardar localmente
    },
  }
}

// Función para mostrar notificaciones
function showNotification(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/images/treeofpips-logo-cuadrado-claro.png",
      })
    }
  } catch (error) {
    console.error("Error al mostrar notificación:", error)
  }
}

// Función para solicitar permiso de notificaciones
export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission()
  }
}

// Función para guardar datos localmente
export function saveDataLocally(key: string, data: any) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error al guardar ${key} localmente:`, error)
    return false
  }
}

// Función para cargar datos locales
export function loadLocalData(key: string) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error al cargar ${key} desde almacenamiento local:`, error)
    return null
  }
}
