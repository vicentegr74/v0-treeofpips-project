"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, type PanInfo, useAnimation } from "framer-motion"
import { Edit, Trash2, ArrowLeft } from "lucide-react"

interface SwipeableCardProps {
  children: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
  id: string
}

export function SwipeableCard({ children, onEdit, onDelete, id }: SwipeableCardProps) {
  const controls = useAnimation()
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState(0)

  // Actualizar el ancho de la tarjeta cuando cambia el tamaño de la ventana
  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth)
    }

    const handleResize = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const threshold = cardWidth * 0.4 // 40% del ancho de la tarjeta

    if (info.offset.x < -threshold) {
      // Deslizado a la izquierda (eliminar)
      controls.start({
        x: -cardWidth,
        transition: { duration: 0.2 },
      })
      if (onDelete) {
        setTimeout(onDelete, 300)
      }
    } else if (info.offset.x > threshold) {
      // Deslizado a la derecha (editar)
      controls.start({
        x: cardWidth,
        transition: { duration: 0.2 },
      })
      if (onEdit) {
        setTimeout(onEdit, 300)
      }
    } else {
      // No alcanzó el umbral, volver a la posición inicial
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 500, damping: 30 },
      })
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg" ref={cardRef}>
      {/* Fondo para acciones */}
      <div className="absolute inset-0 flex justify-between items-center px-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 h-full flex items-center justify-center px-6 rounded-l-lg">
          <Edit className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="bg-red-100 dark:bg-red-900/30 h-full flex items-center justify-center px-6 rounded-r-lg">
          <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
      </div>

      {/* Tarjeta deslizable */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-card z-10 touch-pan-y"
        whileTap={{ scale: isDragging ? 1 : 0.98 }}
        data-swipeable-id={id}
      >
        {children}
      </motion.div>

      {/* Indicadores de deslizamiento */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-muted/50 rounded-full px-3 py-1 text-xs flex items-center space-x-1 opacity-70">
          <ArrowLeft className="h-3 w-3 rotate-180" />
          <span>Desliza para acciones</span>
          <ArrowLeft className="h-3 w-3" />
        </div>
      </div>
    </div>
  )
}
