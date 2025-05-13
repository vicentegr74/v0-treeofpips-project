"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface AnimatedProgressBarProps {
  value: number
  expectedProgress?: number
  className?: string
  showMarkers?: boolean
}

export function AnimatedProgressBar({
  value,
  expectedProgress,
  className = "h-2",
  showMarkers = true,
}: AnimatedProgressBarProps) {
  const [prevValue, setPrevValue] = useState(value)
  const [isIncreasing, setIsIncreasing] = useState(false)

  useEffect(() => {
    // Detectar si el valor está aumentando
    if (value > prevValue) {
      setIsIncreasing(true)
      // Resetear el estado después de un tiempo
      const timer = setTimeout(() => {
        setIsIncreasing(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
    setPrevValue(value)
  }, [value, prevValue])

  return (
    <div className={`relative bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
      {/* Barra de progreso animada */}
      <motion.div
        className={`absolute h-full ${isIncreasing ? "bg-green-400" : "bg-green-500"} rounded-full`}
        initial={{ width: `${prevValue}%` }}
        animate={{ width: `${value}%` }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1,
        }}
      />

      {/* Efecto de brillo cuando aumenta */}
      {isIncreasing && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      )}

      {/* Marcadores de hitos */}
      {showMarkers && (
        <>
          <div
            className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500 top-1/2 -translate-y-1/2"
            style={{ left: "25%" }}
          />
          <div
            className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500 top-1/2 -translate-y-1/2"
            style={{ left: "50%" }}
          />
          <div
            className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500 top-1/2 -translate-y-1/2"
            style={{ left: "75%" }}
          />
          <div
            className="absolute h-3 w-0.5 bg-gray-400 dark:bg-gray-500 top-1/2 -translate-y-1/2"
            style={{ left: "100%" }}
          />
        </>
      )}

      {/* Indicador de progreso esperado */}
      {expectedProgress !== undefined && (
        <div
          className="absolute h-full w-0.5 bg-blue-700 dark:bg-blue-500 z-10"
          style={{ left: `${expectedProgress}%` }}
        />
      )}
    </div>
  )
}
