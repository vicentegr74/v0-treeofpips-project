"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedTreeProps {
  progressPercentage: number
  onGrow?: () => void
}

export function AnimatedTree({ progressPercentage, onGrow }: AnimatedTreeProps) {
  const [prevPercentage, setPrevPercentage] = useState(progressPercentage)
  const [isGrowing, setIsGrowing] = useState(false)
  const [showParticles, setShowParticles] = useState(false)

  // Determinar qué imagen de árbol mostrar basado en el porcentaje
  const getTreeImage = (percentage: number) => {
    const roundedPercentage = Math.floor(percentage / 10) * 10
    return `/trees/tree-${roundedPercentage}.png`
  }

  // Detectar cambios en el progreso para animar
  useEffect(() => {
    if (progressPercentage > prevPercentage) {
      setIsGrowing(true)
      setShowParticles(true)

      // Notificar que el árbol está creciendo
      if (onGrow) {
        onGrow()
      }

      // Ocultar partículas después de la animación
      const timer = setTimeout(() => {
        setShowParticles(false)
      }, 2000)

      return () => clearTimeout(timer)
    }

    setPrevPercentage(progressPercentage)
  }, [progressPercentage, prevPercentage, onGrow])

  // Mensaje basado en el progreso
  const getProgressMessage = () => {
    if (progressPercentage < 25) {
      return "Tu árbol está comenzando a crecer. Mantén un ritmo constante y disciplinado."
    } else if (progressPercentage < 50) {
      return "Las primeras hojas están brotando. Recuerda seguir tu plan sin apresurarte."
    } else if (progressPercentage < 75) {
      return "Tu árbol está creciendo de manera constante. La paciencia es clave en el trading."
    } else if (progressPercentage < 100) {
      return "Tu árbol está casi en su esplendor. Mantén la disciplina y sigue tu estrategia hasta el final."
    } else {
      return "¡Felicidades! Tu árbol ha florecido completamente. Recuerda que el éxito en trading se basa en la consistencia y la disciplina."
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={getTreeImage(progressPercentage)}
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
              src={getTreeImage(progressPercentage) || "/placeholder.svg"}
              alt={`Árbol de progreso al ${progressPercentage}%`}
              width={400}
              height={400}
              className="object-contain"
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
              strokeDashoffset={251.2 - (251.2 * progressPercentage) / 100}
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * progressPercentage) / 100 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            <text x="50" y="55" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#22c55e">
              {progressPercentage}%
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
