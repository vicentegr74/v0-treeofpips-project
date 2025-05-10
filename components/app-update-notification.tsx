"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function AppUpdateNotification() {
  const [showUpdateToast, setShowUpdateToast] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Registrar el service worker
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        // Verificar actualizaciones cada hora
        setInterval(
          () => {
            reg.update()
          },
          60 * 60 * 1000,
        )

        // Detectar cuando hay una nueva versión disponible
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker)
                setShowUpdateToast(true)
              }
            })
          }
        })
      })

      // Escuchar mensajes del service worker
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "UPDATE_AVAILABLE") {
          setShowUpdateToast(true)
        }
      })
    }
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" })
    }
    window.location.reload()
  }

  return (
    <ToastProvider>
      {showUpdateToast && (
        <Toast>
          <div className="grid gap-1">
            <ToastTitle>Actualización disponible</ToastTitle>
            <ToastDescription>Hay una nueva versión de la aplicación disponible.</ToastDescription>
          </div>
          <ToastAction asChild altText="Actualizar ahora">
            <Button size="sm" onClick={handleUpdate} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
          </ToastAction>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
