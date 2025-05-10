"use client"

import { motion } from "framer-motion"
import { MilestoneMedal } from "@/components/milestone-medal"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"

interface MilestoneMedalsRowProps {
  milestones: {
    "25%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
    "50%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
    "75%": {
      date: string
      achieved: boolean
      achievedDate: string | null
    }
  }
  targetDate: string
  progressPercentage: number
  targetAmount: number
  currentProgress: number
}

export function MilestoneMedalsRow({
  milestones,
  targetDate,
  progressPercentage,
  targetAmount,
  currentProgress,
}: MilestoneMedalsRowProps) {
  const isDatePassed = (dateString: string) => {
    const today = new Date()
    const date = new Date(dateString)
    return date < today
  }

  const getMilestoneStatus = (milestone: { date: string; achieved: boolean; achievedDate: string | null }) => {
    if (milestone.achieved) {
      return {
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        borderColor: "border-green-200 dark:border-green-800",
      }
    } else if (isDatePassed(milestone.date)) {
      return {
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        borderColor: "border-red-200 dark:border-red-800",
      }
    } else {
      return {
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        borderColor: "border-amber-200 dark:border-amber-800",
      }
    }
  }

  const milestone100Status =
    progressPercentage >= 100
      ? {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          borderColor: "border-green-200 dark:border-green-800",
          date: "",
          achieved: true,
          achievedDate: new Date().toISOString(),
        }
      : isDatePassed(targetDate)
        ? {
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            borderColor: "border-red-200 dark:border-red-800",
            date: targetDate,
            achieved: false,
            achievedDate: null,
          }
        : {
            icon: Clock,
            color: "text-blue-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            borderColor: "border-blue-200 dark:border-blue-800",
            date: targetDate,
            achieved: false,
            achievedDate: null,
          }

  // Calcular el porcentaje actual para la barra de progreso
  const progressBarPercentage = Math.min(100, progressPercentage)

  return (
    <div className="py-2">
      <h3 className="text-sm font-medium mb-3">Hitos del proyecto</h3>

      {/* Barra de progreso animada */}
      <AnimatedProgressBar value={progressBarPercentage} className="h-2 mb-4" />

      <motion.div
        className="grid grid-cols-4 gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Medallas de hitos más pequeñas */}
        <MilestoneMedal
          percentage="25%"
          milestone={milestones["25%"]}
          targetAmount={targetAmount}
          currentProgress={currentProgress}
          size="small"
        />

        <MilestoneMedal
          percentage="50%"
          milestone={milestones["50%"]}
          targetAmount={targetAmount}
          currentProgress={currentProgress}
          size="small"
        />

        <MilestoneMedal
          percentage="75%"
          milestone={milestones["75%"]}
          targetAmount={targetAmount}
          currentProgress={currentProgress}
          size="small"
        />

        <MilestoneMedal
          percentage="100%"
          milestone={milestone100Status}
          targetAmount={targetAmount}
          currentProgress={currentProgress}
          size="small"
        />
      </motion.div>
    </div>
  )
}
