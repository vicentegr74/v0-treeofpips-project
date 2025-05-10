"use client"

import { useState } from "react"

export function useDeleteConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null)

  const openConfirmation = (id: string, title: string) => {
    setItemToDelete({ id, title })
    setIsOpen(true)
  }

  const closeConfirmation = () => {
    setIsOpen(false)
    setTimeout(() => setItemToDelete(null), 200) // Limpiar después de la animación
  }

  return {
    isOpen,
    itemToDelete,
    openConfirmation,
    closeConfirmation,
  }
}
