"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

interface DeleteProjectDialogProps {
  projectId: string
  projectTitle: string
  onDelete: (id: string) => void
  variant?: "icon" | "button"
  size?: "default" | "sm" | "icon"
}

export function DeleteProjectDialog({
  projectId,
  projectTitle,
  onDelete,
  variant = "button",
  size = "default",
}: DeleteProjectDialogProps) {
  const handleDelete = () => {
    onDelete(projectId)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="outline"
            size={size === "icon" ? "icon" : size}
            className={size === "icon" ? "h-8 w-8 text-destructive" : "text-destructive"}
          >
            <Trash2 className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-2"} />
            {size !== "icon" && "Eliminar"}
          </Button>
        ) : (
          <Button variant="outline" size={size} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto "{projectTitle}" y todos sus
            datos asociados.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
