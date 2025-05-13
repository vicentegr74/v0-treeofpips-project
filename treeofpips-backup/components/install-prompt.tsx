"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Detectar si la app puede ser instalada
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevenir que Chrome muestre la instalación automáticamente
      e.preventDefault()
      // Guardar el evento para usarlo después
      setDeferredPrompt(e)
      // Mostrar nuestro propio prompt
      setShowPrompt(true)
    })

    // Detectar si la app ya está instalada
    window.addEventListener("appinstalled", () => {
      // Limpiar el prompt
      setShowPrompt(false)
      setDeferredPrompt(null)
      // Registrar que la app fue instalada
      console.log("App instalada")
    })

    // Verificar si ya está en modo standalone (ya instalada)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar el prompt de instalación
    deferredPrompt.prompt()

    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice

    // Limpiar el prompt
    setDeferredPrompt(null)
    setShowPrompt(false)

    console.log(`Usuario eligió: ${outcome}`)
  }

  if (!showPrompt) return null

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Instalar la aplicación</DialogTitle>
          <DialogDescription>
            Instala "El Árbol de los Logros del Trading" en tu dispositivo para acceder más rápido y usarla sin
            conexión.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <img src="/placeholder.svg?height=120&width=120" alt="Logo de la aplicación" className="h-30 w-30" />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Ahora no
          </Button>
          <Button onClick={handleInstallClick} className="bg-green-600 hover:bg-green-700 mt-2 sm:mt-0">
            <Download className="mr-2 h-4 w-4" />
            Instalar aplicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
