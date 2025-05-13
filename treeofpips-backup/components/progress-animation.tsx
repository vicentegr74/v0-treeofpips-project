"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { CheckCircle, TrendingUp, Award } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface ProgressAnimationProps {
  previousProgress: number
  currentProgress: number
  targetAmount: number
  milestones: {
    "25%": { achieved: boolean }
    "50%": { achieved: boolean }
    "75%": { achieved: boolean }
  }
  previousMilestones: {
    "25%": { achieved: boolean }
    "50%": { achieved: boolean }
    "75%": { achieved: boolean }
  }
}

export function ProgressAnimation({
  previousProgress,
  currentProgress,
  targetAmount,
  milestones,
  previousMilestones,
}: ProgressAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState<
    "progress" | "milestone25" | "milestone50" | "milestone75" | "complete"
  >("progress")
  const [animationAmount, setAnimationAmount] = useState(0)

  useEffect(() => {
    // Solo mostrar animación si hay un cambio positivo en el progreso
    if (currentProgress > previousProgress) {
      const progressDifference = currentProgress - previousProgress
      setAnimationAmount(progressDifference)

      // Determinar el tipo de animación basado en los hitos alcanzados
      if (currentProgress >= targetAmount && previousProgress < targetAmount) {
        setAnimationType("complete")
        // Lanzar confeti para celebrar la finalización
        launchConfetti("completion")
      } else if (milestones["75%"].achieved && !previousMilestones["75%"].achieved) {
        setAnimationType("milestone75")
        // Lanzar confeti para el hito del 75%
        launchConfetti("milestone")
      } else if (milestones["50%"].achieved && !previousMilestones["50%"].achieved) {
        setAnimationType("milestone50")
        // Lanzar confeti para el hito del 50%
        launchConfetti("milestone")
      } else if (milestones["25%"].achieved && !previousMilestones["25%"].achieved) {
        setAnimationType("milestone25")
        // Lanzar confeti para el hito del 25%
        launchConfetti("milestone")
      } else {
        setAnimationType("progress")
      }

      setShowAnimation(true)

      // Ocultar la animación después de un tiempo
      const timer = setTimeout(() => {
        setShowAnimation(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentProgress, previousProgress, milestones, previousMilestones, targetAmount])

  // Función para lanzar confeti
  const launchConfetti = (type: "milestone" | "completion") => {
    const duration = type === "completion" ? 5000 : 3000
    const particleCount = type === "completion" ? 200 : 100

    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", "#FF9800"],
      disableForReducedMotion: true,
      zIndex: 1000,
      scalar: 1.2,
      gravity: 1.2,
      drift: 0,
      ticks: 300,
    })

    if (type === "completion") {
      // Para la finalización, añadir más efectos
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#4CAF50", "#8BC34A", "#CDDC39"],
        })
      }, 500)

      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FFC107", "#FF9800", "#FF5722"],
        })
      }, 1000)
    }
  }

  // Determinar el mensaje y el icono basado en el tipo de animación
  const getAnimationContent = () => {
    switch (animationType) {
      case "milestone25":
        return {
          icon: <Award className="h-6 w-6 text-amber-500" />,
          message: "¡Hito del 25% alcanzado!",
          color: "bg-amber-500",
        }
      case "milestone50":
        return {
          icon: <Award className="h-6 w-6 text-blue-500" />,
          message: "¡Hito del 50% alcanzado!",
          color: "bg-blue-500",
        }
      case "milestone75":
        return {
          icon: <Award className="h-6 w-6 text-purple-500" />,
          message: "¡Hito del 75% alcanzado!",
          color: "bg-purple-500",
        }
      case "complete":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          message: "¡Meta completada!",
          color: "bg-green-500",
        }
      default:
        return {
          icon: <TrendingUp className="h-6 w-6 text-green-500" />,
          message: "¡Progreso añadido!",
          color: "bg-green-500",
        }
    }
  }

  const content = getAnimationContent()

  return (
    <AnimatePresence>
      {showAnimation && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className={`p-2 rounded-full ${content.color} bg-opacity-20 dark:bg-opacity-30`}>{content.icon}</div>
          <div>
            <p className="font-medium">{content.message}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">+{formatCurrency(animationAmount)}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
