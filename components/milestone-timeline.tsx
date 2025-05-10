"use client"

import { CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface MilestoneTimelineProps {
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
}

export function MilestoneTimeline({
  milestones,
  targetDate,
  progressPercentage,
  targetAmount,
}: MilestoneTimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }

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
        message: `Logrado el ${formatDate(milestone.achievedDate || "")}`,
      }
    } else if (isDatePassed(milestone.date)) {
      return {
        icon: AlertTriangle,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        borderColor: "border-red-200 dark:border-red-800",
        message: `Fecha límite pasada (${formatDate(milestone.date)})`,
      }
    } else {
      return {
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        borderColor: "border-amber-200 dark:border-amber-800",
        message: `Esperado para ${formatDate(milestone.date)}`,
      }
    }
  }

  const milestone25Status = getMilestoneStatus(milestones["25%"])
  const milestone50Status = getMilestoneStatus(milestones["50%"])
  const milestone75Status = getMilestoneStatus(milestones["75%"])
  const milestone100Status =
    progressPercentage >= 100
      ? {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          borderColor: "border-green-200 dark:border-green-800",
          message: "¡Meta completada!",
        }
      : isDatePassed(targetDate)
        ? {
            icon: AlertTriangle,
            color: "text-red-500",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            borderColor: "border-red-200 dark:border-red-800",
            message: `Fecha límite pasada (${formatDate(targetDate)})`,
          }
        : {
            icon: Clock,
            color: "text-blue-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            borderColor: "border-blue-200 dark:border-blue-800",
            message: `Meta final para ${formatDate(targetDate)}`,
          }

  return (
    <div className="py-4">
      <h3 className="text-lg font-medium mb-4">Línea de tiempo de hitos</h3>

      <div className="relative">
        {/* Línea de progreso */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Indicador de progreso actual */}
        <div
          className="absolute left-4 top-0 w-0.5 bg-green-500"
          style={{ height: `${Math.min(100, progressPercentage)}%` }}
        />

        {/* Hitos */}
        <div className="space-y-8 relative">
          <motion.div
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full ${milestone25Status.bgColor} ${milestone25Status.borderColor} border-2 flex items-center justify-center z-10`}
            >
              <milestone25Status.icon className={`h-4 w-4 ${milestone25Status.color}`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium flex items-center">
                Hito 25%
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {formatCurrency(targetAmount * 0.25)}
                </span>
              </h4>
              <p className={`text-xs ${milestone25Status.color}`}>{milestone25Status.message}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full ${milestone50Status.bgColor} ${milestone50Status.borderColor} border-2 flex items-center justify-center z-10`}
            >
              <milestone50Status.icon className={`h-4 w-4 ${milestone50Status.color}`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium flex items-center">
                Hito 50%
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {formatCurrency(targetAmount * 0.5)}
                </span>
              </h4>
              <p className={`text-xs ${milestone50Status.color}`}>{milestone50Status.message}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full ${milestone75Status.bgColor} ${milestone75Status.borderColor} border-2 flex items-center justify-center z-10`}
            >
              <milestone75Status.icon className={`h-4 w-4 ${milestone75Status.color}`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium flex items-center">
                Hito 75%
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {formatCurrency(targetAmount * 0.75)}
                </span>
              </h4>
              <p className={`text-xs ${milestone75Status.color}`}>{milestone75Status.message}</p>
            </div>
          </motion.div>

          <motion.div
            className="flex items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full ${milestone100Status.bgColor} ${milestone100Status.borderColor} border-2 flex items-center justify-center z-10`}
            >
              <milestone100Status.icon className={`h-4 w-4 ${milestone100Status.color}`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium flex items-center">
                Meta Final
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {formatCurrency(targetAmount)}
                </span>
              </h4>
              <p className={`text-xs ${milestone100Status.color}`}>{milestone100Status.message}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
