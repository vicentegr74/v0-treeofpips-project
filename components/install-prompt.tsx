"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya ha instalado la app o ha descartado el prompt
    const hasInstalled = localStorage.getItem("appInstalled") === "true"
    const hasDismissed = localStorage.getItem("installPromptDismissed") === "true"

    if (hasInstalled || hasDismissed) {
      setShowPrompt(false)
      return
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault()
      // Guardar el evento para usarlo más tarde
      setDeferredPrompt(e)
      // Mostrar nuestro prompt personalizado
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Verificar si la app ya está instalada
    if (window.matchMedia("(display-mode: standalone)").matches) {
      localStorage.setItem("appInstalled", "true")
      setShowPrompt(false)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Mostrar el prompt de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda al prompt
    const choiceResult = await deferredPrompt.userChoice

    // Resetear el deferredPrompt después de usarlo
    setDeferredPrompt(null)

    if (choiceResult.outcome === "accepted") {
      console.log("Usuario aceptó la instalación")
      localStorage.setItem("appInstalled", "true")
    } else {
      console.log("Usuario rechazó la instalación")
    }

    // Ocultar nuestro prompt personalizado
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem("installPromptDismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <Card className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Download className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
          <div>
            <p className="text-green-800 dark:text-green-300 font-medium">Instala Tree of Pips</p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Accede rápidamente y úsalo sin conexión como una app
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
          >
            <X className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:ml-2">No, gracias</span>
          </Button>
          <Button
            size="sm"
            onClick={handleInstall}
            className="bg-green-700 hover:bg-green-800 text-white flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Instalar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
