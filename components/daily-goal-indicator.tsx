import { Check, AlertTriangle, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatCurrency } from "@/lib/utils"

interface DailyGoalIndicatorProps {
  dailyGoalNeeded: number
  averageDailyProgress: number
  daysActive: number
}

export function DailyGoalIndicator({ dailyGoalNeeded, averageDailyProgress, daysActive }: DailyGoalIndicatorProps) {
  // Calcular el porcentaje de cumplimiento
  const fulfillmentPercentage = dailyGoalNeeded > 0 ? (averageDailyProgress / dailyGoalNeeded) * 100 : 100

  // Determinar el estado basado en el porcentaje
  let status: "success" | "warning" | "danger" = "success"
  if (fulfillmentPercentage < 80) {
    status = "danger"
  } else if (fulfillmentPercentage < 100) {
    status = "warning"
  }

  // Si el proyecto acaba de comenzar (menos de 3 días), mostrar un estado neutral
  const isNewProject = daysActive < 3

  // Configurar clases y mensajes según el estado
  const statusConfig = {
    success: {
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-700 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      icon: <Check className="h-4 w-4" />,
      message: "¡Excelente! Estás superando tu meta diaria necesaria.",
    },
    warning: {
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      textColor: "text-amber-700 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-800",
      icon: <AlertTriangle className="h-4 w-4" />,
      message: "Estás cerca de tu meta diaria, pero necesitas aumentar tu ritmo.",
    },
    danger: {
      bgColor: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-red-700 dark:text-red-400",
      borderColor: "border-red-200 dark:border-red-800",
      icon: <X className="h-4 w-4" />,
      message: "Estás significativamente por debajo de tu meta diaria necesaria.",
    },
  }

  const config = statusConfig[status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${config.bgColor} ${config.textColor} border ${config.borderColor} cursor-help`}
          >
            {config.icon}
            <span className="text-sm font-medium">
              {isNewProject ? "Proyecto reciente" : `${Math.round(fulfillmentPercentage)}% de meta diaria`}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          {isNewProject ? (
            <p>El proyecto es muy reciente para evaluar el cumplimiento de la meta diaria.</p>
          ) : (
            <>
              <p className="font-medium">{config.message}</p>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Meta diaria necesaria:</span>
                  <span className="font-medium">{formatCurrency(dailyGoalNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Progreso diario promedio:</span>
                  <span className="font-medium">{formatCurrency(averageDailyProgress)}</span>
                </div>
              </div>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
