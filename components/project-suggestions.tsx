"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Modificar la interfaz para hacer las propiedades opcionales
interface ProjectSuggestionsProps {
  dailyGoalNeeded?: number
  averageDailyProgress?: number
  daysActive?: number
  daysRemaining?: number
  progressPercentage?: number
  className?: string
}

// Añadir valores predeterminados en la desestructuración de props
export function ProjectSuggestions({
  dailyGoalNeeded = 10,
  averageDailyProgress = 8,
  daysActive = 14,
  daysRemaining = 30,
  progressPercentage = 35,
  className,
}: ProjectSuggestionsProps) {
  // Calcular el porcentaje de cumplimiento de la meta diaria
  const fulfillmentPercentage = dailyGoalNeeded > 0 ? (averageDailyProgress / dailyGoalNeeded) * 100 : 100

  // Determinar si el proyecto es nuevo (menos de 3 días)
  const isNewProject = daysActive < 3

  // Generar sugerencias basadas en el rendimiento
  const generateSuggestions = () => {
    const suggestions = []

    // Para proyectos nuevos
    if (isNewProject) {
      suggestions.push({
        priority: "info",
        icon: Clock,
        title: "Proyecto reciente",
        description: "Continúa registrando tu progreso diario para obtener sugerencias más precisas.",
      })
      return suggestions
    }

    // Sugerencia basada en el cumplimiento de la meta diaria
    if (fulfillmentPercentage < 70) {
      suggestions.push({
        priority: "high",
        icon: AlertTriangle,
        title: "Aumenta tu progreso diario",
        description: `Tu progreso diario (${averageDailyProgress.toFixed(
          2,
        )}€) está significativamente por debajo de lo necesario (${dailyGoalNeeded.toFixed(2)}€).`,
      })
    } else if (fulfillmentPercentage < 90) {
      suggestions.push({
        priority: "medium",
        icon: TrendingUp,
        title: "Ajusta ligeramente tu ritmo",
        description: `Estás cerca de tu meta diaria, pero necesitas aumentar un poco tu progreso para mantenerte en camino.`,
      })
    } else if (fulfillmentPercentage > 150) {
      suggestions.push({
        priority: "low",
        icon: CheckCircle,
        title: "Considera ajustar tus metas",
        description: `Estás superando significativamente tu meta diaria. Podrías aumentar tu objetivo o reducir el tiempo del proyecto.`,
      })
    } else if (fulfillmentPercentage >= 90 && fulfillmentPercentage <= 110) {
      suggestions.push({
        priority: "low",
        icon: CheckCircle,
        title: "Buen ritmo de progreso",
        description: `Estás manteniendo un ritmo óptimo para alcanzar tu meta en el tiempo previsto.`,
      })
    }

    // Sugerencia basada en el progreso vs tiempo transcurrido
    const expectedProgress = (daysActive / (daysActive + daysRemaining)) * 100
    const progressDifference = progressPercentage - expectedProgress

    if (progressDifference < -15) {
      suggestions.push({
        priority: "high",
        icon: TrendingDown,
        title: "Progreso por debajo de lo esperado",
        description: `Tu progreso (${progressPercentage.toFixed(0)}%) está por debajo de lo esperado (${expectedProgress.toFixed(
          0,
        )}%) para este punto del proyecto.`,
      })
    } else if (progressDifference < -5) {
      suggestions.push({
        priority: "medium",
        icon: TrendingDown,
        title: "Ligeramente por debajo del ritmo",
        description: `Estás un poco por debajo del progreso esperado para este punto del proyecto.`,
      })
    } else if (progressDifference > 15) {
      suggestions.push({
        priority: "low",
        icon: TrendingUp,
        title: "Progreso por encima de lo esperado",
        description: `¡Excelente! Estás avanzando más rápido de lo previsto en tu proyecto.`,
      })
    }

    return suggestions
  }

  const suggestions = generateSuggestions()

  if (suggestions.length === 0) return null

  return (
    <Card className={className}>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm">Sugerencias para tu proyecto</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-0.5 p-1.5 rounded-full",
                suggestion.priority === "high"
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : suggestion.priority === "medium"
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    : suggestion.priority === "info"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
              )}
            >
              <suggestion.icon className="h-4 w-4" />
            </div>
            <div>
              <h4
                className={cn(
                  "text-sm font-medium",
                  suggestion.priority === "high"
                    ? "text-red-600 dark:text-red-400"
                    : suggestion.priority === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : suggestion.priority === "info"
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-green-600 dark:text-green-400",
                )}
              >
                {suggestion.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{suggestion.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
