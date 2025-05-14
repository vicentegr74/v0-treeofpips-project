"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedTreeProps {
  progressPercentage: number
  onGrow?: () => void
}

export function AnimatedTree({ progressPercentage = 0, onGrow }: AnimatedTreeProps) {
  // Usar useRef para mantener una referencia estable al valor anterior
  const prevPercentageRef = useRef<number>(progressPercentage)
  const [isGrowing, setIsGrowing] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Determinar qué imagen de árbol mostrar basado en el porcentaje
  const getTreeImage = (percentage: number): string => {
    // Asegurar que el porcentaje es un número válido
    const validPercentage = Number.isFinite(percentage) ? percentage : 0
    const roundedPercentage = Math.floor(validPercentage / 10) * 10
    return `/trees/tree-${roundedPercentage}.png`
  }

  // Detectar cambios en el progreso para animar
  useEffect(() => {
    // Validar que progressPercentage es un número
    if (!Number.isFinite(progressPercentage)) {
      return
    }

    // Comparar con el valor anterior
    if (progressPercentage > prevPercentageRef.current) {
      setIsGrowing(true)
      setShowParticles(true)

      // Notificar que el árbol está creciendo
      if (typeof onGrow === "function") {
        onGrow()
      }

      // Ocultar partículas después de la animación
      const timer = setTimeout(() => {
        setShowParticles(false)
      }, 2000)

      return () => clearTimeout(timer)
    }

    // Actualizar la referencia al valor anterior
    prevPercentageRef.current = progressPercentage
  }, [progressPercentage, onGrow])

  // Mensaje basado en el progreso con mensajes específicos para cada etapa
  const getProgressMessage = (): string => {
    // Asegurar que el porcentaje es un número válido
    const validPercentage = Number.isFinite(progressPercentage) ? progressPercentage : 0
    const roundedPercentage = Math.floor(validPercentage / 10) * 10

    switch (roundedPercentage) {
      case 0:
        return "Tu proyecto está comenzando. La semilla ha sido plantada."
      case 10:
        return "Los primeros brotes están apareciendo. Mantén un ritmo constante y disciplinado."
      case 20:
        return "Tu plántula está creciendo. Recuerda seguir tu plan sin apresurarte."
      case 30:
        return "Tu plántula se fortalece. La paciencia es clave en el trading."
      case 40:
        return "Tu árbol joven está desarrollándose. Mantén la disciplina en tu estrategia."
      case 50:
        return "Tu árbol está creciendo de manera constante. Estás en el camino correcto."
      case 60:
        return "Tu árbol se está volviendo más robusto. Continúa con tu estrategia."
      case 70:
        return "Tu árbol está casi maduro. Mantén la disciplina hasta el final."
      case 80:
        return "Tu árbol está casi en su esplendor. La consistencia es la clave del éxito."
      case 90:
        return "Tu árbol está a punto de florecer completamente. ¡La meta está cerca!"
      case 100:
        return "¡Felicidades! Tu árbol ha florecido completamente. Has completado tu proyecto con éxito."
      default:
        return "Tu árbol está creciendo. Continúa con tu estrategia."
    }
  }

  // Obtener una descripción más detallada para el texto alternativo
  const getTreeAltText = (percentage: number): string => {
    // Asegurar que el porcentaje es un número válido
    const validPercentage = Number.isFinite(percentage) ? percentage : 0
    const roundedPercentage = Math.floor(validPercentage / 10) * 10

    switch (roundedPercentage) {
      case 0:
        return `Semilla plantada - ${validPercentage}% de progreso`
      case 10:
        return `Primeros brotes - ${validPercentage}% de progreso`
      case 20:
        return `Plántula pequeña - ${validPercentage}% de progreso`
      case 30:
        return `Plántula en crecimiento - ${validPercentage}% de progreso`
      case 40:
        return `Árbol joven pequeño - ${validPercentage}% de progreso`
      case 50:
        return `Árbol joven en desarrollo - ${validPercentage}% de progreso`
      case 60:
        return `Árbol adolescente - ${validPercentage}% de progreso`
      case 70:
        return `Árbol casi maduro - ${validPercentage}% de progreso`
      case 80:
        return `Árbol maduro - ${validPercentage}% de progreso`
      case 90:
        return `Árbol adulto - ${validPercentage}% de progreso`
      case 100:
        return `Árbol floreciente - ${validPercentage}% de progreso`
      default:
        return `Árbol de progreso al ${validPercentage}%`
    }
  }

  // Validar que progressPercentage es un número
  const validProgressPercentage = Number.isFinite(progressPercentage) ? progressPercentage : 0

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={getTreeImage(validProgressPercentage)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: isGrowing ? [0.9, 1.05, 1] : 1,
              y: isGrowing ? [0, -10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: isGrowing ? 1 : 0.5,
              ease: "easeInOut",
            }}
            onAnimationComplete={() => setIsGrowing(false)}
            className="absolute inset-0"
          >
            <Image
              src={
                imageError ? "/placeholder.svg?height=400&width=400&query=tree" : getTreeImage(validProgressPercentage)
              }
              alt={getTreeAltText(validProgressPercentage)}
              width={400}
              height={400}
              className="object-contain"
              onError={() => setImageError(true)}
              priority={true}
            />
          </motion.div>
        </AnimatePresence>

        {/* Partículas de crecimiento */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-green-400"
                initial={{
                  x: "50%",
                  y: "60%",
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${35 + Math.random() * 30}%`,
                  y: `${20 + Math.random() * 60}%`,
                  opacity: [1, 0.8, 0],
                  scale: [0, 1, 0.5],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        )}

        {/* Indicador de progreso circular */}
        <motion.div
          className="absolute bottom-0 right-0 bg-green-100 dark:bg-green-900/30 rounded-full p-2 shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <svg width="50" height="50" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#e6e6e6" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * validProgressPercentage) / 100}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * validProgressPercentage) / 100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#22c55e">
              {validProgressPercentage}%
            </text>
          </svg>
        </motion.div>
      </div>

      <motion.p
        className="text-sm text-center text-muted-foreground mt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {getProgressMessage()}
      </motion.p>
    </div>
  )
}
