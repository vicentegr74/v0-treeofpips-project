"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/auth-context"
import { migrateLocalDataToFirestore } from "@/lib/data-migration"
import { Loader2 } from "lucide-react"

export function DataMigrationPrompt() {
  const { user } = useAuth()
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [migrated, setMigrated] = useState(false)

  // Verificar si hay datos en localStorage
  const hasLocalData =
    typeof window !== "undefined" &&
    (localStorage.getItem("tradingProjects") ||
      localStorage.getItem("tradingCompletedProjects") ||
      localStorage.getItem("tradingJournalEntries"))

  // Si no hay usuario o no hay datos locales, no mostrar el diálogo
  if (!user || !hasLocalData || migrated) {
    return null
  }

  const handleMigrate = async () => {
    if (!user) return

    setLoading(true)
    try {
      await migrateLocalDataToFirestore(user.uid)
      setMigrated(true)
      setOpen(false)
    } catch (error) {
      console.error("Error al migrar datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¿Deseas importar tus datos existentes?</DialogTitle>
          <DialogDescription>
            Hemos detectado que tienes datos guardados localmente. ¿Quieres importarlos a tu cuenta para acceder a ellos
            desde cualquier dispositivo?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={handleSkip} disabled={loading}>
            Omitir
          </Button>
          <Button onClick={handleMigrate} disabled={loading} className="bg-green-700 hover:bg-green-800">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importando...
              </>
            ) : (
              "Importar datos"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
