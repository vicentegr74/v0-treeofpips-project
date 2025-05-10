"use client"

import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface MilestoneMedalProps {
  percentage: string
  milestone: {
    date: string
    achieved: boolean
    achievedDate: string | null
    icon?: any
    color?: string
    bgColor?: string
    borderColor?: string
  }
  targetAmount: number
  currentProgress: number
  size?: "small" | "normal"
}

export function MilestoneMedal({
  percentage,
  milestone,
  targetAmount,
  currentProgress,
  size = "normal",
}: MilestoneMedalProps) {
  // Calcular el valor monetario del hito
  const percentageValue = Number.parseInt(percentage) / 100
  const milestoneAmount = targetAmount * percentageValue

  // Determinar si el hito está alcanzado
  const isAchieved = milestone.achieved

  // Calcular el progreso hacia este hito específico (0-100%)
  const progressTowardsMilestone = Math.min(100, (currentProgress / milestoneAmount) * 100)

  // Determinar el icono y colores basados en el estado
  const Icon = milestone.icon || (isAchieved ? CheckCircle : milestone.achievedDate ? AlertTriangle : Clock)
  const textColor = milestone.color || (isAchieved ? "text-green-500" : "text-gray-500")
  const bgColor = milestone.bgColor || (isAchieved ? "bg-green-100" : "bg-gray-100")
  const borderColor = milestone.borderColor || (isAchieved ? "border-green-200" : "border-gray-200")

  // Determinar el tamaño basado en la prop size
  const medalSize = size === "small" ? "h-14 w-14" : "h-20 w-20"
  const iconSize = size === "small" ? "h-4 w-4" : "h-5 w-5"
  const fontSize = size === "small" ? "text-xs" : "text-sm"

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return "No establecido"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center">
            <motion.div
              className={`relative ${medalSize} rounded-full ${bgColor} ${borderColor} border-2 flex items-center justify-center ${textColor} mb-1`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: Number.parseInt(percentage) / 400 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Círculo de progreso */}
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="289.27"
                  strokeDashoffset={289.27 - (289.27 * progressTowardsMilestone) / 100}
                  strokeLinecap="round"
                  opacity="0.3"
                  transform="rotate(-90 50 50)"
                />
              </svg>

              {/* Contenido de la medalla */}
              <div className="z-10 flex flex-col items-center justify-center">
                <Icon className={iconSize} />
                <span className={`font-bold ${fontSize} mt-0.5`}>{percentage}</span>
              </div>
            </motion.div>

            {/* Valor monetario debajo de la medalla */}
            <span className={`${fontSize} font-medium ${textColor}`}>{formatCurrency(milestoneAmount)}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 p-1">
            <p className="font-medium">Hito: {percentage}</p>
            <p>Valor: {formatCurrency(milestoneAmount)}</p>
            <p>Progreso: {progressTowardsMilestone.toFixed(1)}%</p>
            {isAchieved ? (
              <p className="text-green-500">Logrado el {formatDate(milestone.achievedDate!)}</p>
            ) : (
              <p>Fecha estimada: {formatDate(milestone.date)}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
