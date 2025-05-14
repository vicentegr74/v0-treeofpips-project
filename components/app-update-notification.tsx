"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function AppUpdateNotification() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

    // Función para registrar el service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("Service Worker registrado con éxito:", registration)

        // Detectar actualizaciones
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing
          if (!newWorker) return

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // Hay una nueva versión disponible
              setShowUpdateNotification(true)
              setWaitingWorker(newWorker)
            }
          })
        })

        // Verificar si hay una actualización al cargar la página
        if (registration.waiting) {
          setShowUpdateNotification(true)
          setWaitingWorker(registration.waiting)
        }
      } catch (error) {
        console.error("Error al registrar el Service Worker:", error)
      }
    }

    // Registrar el service worker cuando la página se carga
    window.addEventListener("load", registerServiceWorker)

    return () => {
      window.removeEventListener("load", registerServiceWorker)
    }
  }, [])

  const handleUpdate = () => {
    if (!waitingWorker) return

    // Enviar mensaje al service worker para activar la nueva versión
    waitingWorker.postMessage({ type: "SKIP_WAITING" })

    // Recargar la página para usar la nueva versión
    window.location.reload()
  }

  if (!showUpdateNotification) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between">
      <p className="text-sm">¡Hay una nueva versión disponible!</p>
      <Button
        onClick={handleUpdate}
        variant="outline"
        className="bg-white text-green-600 hover:bg-green-50 flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Actualizar</span>
      </Button>
    </div>
  )
}
