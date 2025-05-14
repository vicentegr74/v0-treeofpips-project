"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts"
import { formatCurrency, formatNumberValue } from "@/lib/utils"
import { AlertTriangle, TrendingUp, Clock } from "lucide-react"
import { sendNotification } from "@/lib/notifications"

interface DailyGoalTrendChartProps {
  dailyGoalNeeded: number
  averageDailyProgress: number
  daysActive: number
  className?: string
  currentProgress?: number
  totalTarget?: number
  targetAmount?: number
  initialCapital?: number
  projectTitle?: string
  progressHistory?: Array<{
    id: string
    date: string
    amount: number
    balance: number
    progressPercentage: number
  }>
  data?: Array<{
    date: string
    goal: number
    achieved: number
  }>
}

export function DailyGoalTrendChart({
  dailyGoalNeeded,
  averageDailyProgress,
  daysActive,
  className = "",
  currentProgress = 0,
  totalTarget = 0,
  targetAmount = 0,
  initialCapital = 0,
  projectTitle = "",
  progressHistory = [],
  data = [],
}: DailyGoalTrendChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [isProgressTooFast, setIsProgressTooFast] = useState(false)
  const [progressRate, setProgressRate] = useState(0)
  const [goalReached, setGoalReached] = useState(false)
  const [currentProgressPercentage, setCurrentProgressPercentage] = useState(0)

  useEffect(() => {
    // Calcular el porcentaje de progreso actual
    const progressPercentage = targetAmount > 0 ? (currentProgress / targetAmount) * 100 : 0
    setCurrentProgressPercentage(progressPercentage)

    // Calcular si el progreso es demasiado rápido
    const progressRateValue =
      averageDailyProgress > 0 && dailyGoalNeeded > 0 ? averageDailyProgress / dailyGoalNeeded : 0

    setProgressRate(progressRateValue)
    setIsProgressTooFast(progressRateValue > 1.5) // Si es más de un 50% más rápido que lo necesario

    // Verificar si se ha alcanzado la meta
    const hasReachedGoal = currentProgress >= targetAmount

    // Si se alcanzó la meta y no se había notificado antes
    if (hasReachedGoal && !goalReached) {
      setGoalReached(true)
      // Enviar notificación
      if (projectTitle) {
        sendNotification(
          "¡Meta alcanzada!",
          `Tu proyecto "${projectTitle}" ha alcanzado su meta financiera.`,
          "/icons/icon-192x192.png",
        )
      }
    }

    // Preparar datos para el gráfico
    if (data && data.length > 0) {
      setChartData(data)
    } else if (progressHistory && progressHistory.length > 0) {
      // Ordenar por fecha
      const sortedHistory = [...progressHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Calcular el progreso acumulado (suma de todas las operaciones)
      let accumulatedProgress = 0

      // Crear datos para el gráfico con cada transacción
      const chartData = sortedHistory.map((entry) => {
        // Extraer la fecha y hora para el formato del eje X
        const date = new Date(entry.date)
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`

        // Acumular el progreso (suma de las operaciones)
        accumulatedProgress += entry.amount

        // Calcular el porcentaje de progreso (0-100%)
        const progressPercentage = targetAmount > 0 ? (accumulatedProgress / targetAmount) * 100 : 0

        return {
          name: formattedDate,
          balance: entry.balance, // Mantener el saldo para referencia
          amount: entry.amount, // Valor de la operación individual
          accumulatedProgress: accumulatedProgress, // Progreso acumulado (suma de operaciones)
          date: entry.date,
          percentage: progressPercentage,
        }
      })

      setChartData(chartData)
    } else {
      setChartData([])
    }
  }, [
    dailyGoalNeeded,
    averageDailyProgress,
    daysActive,
    currentProgress,
    totalTarget,
    progressHistory,
    targetAmount,
    initialCapital,
    projectTitle,
    goalReached,
    data,
  ])

  // Componente personalizado para el tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const date = new Date(data.date)
      const formattedDateTime = `${date.toLocaleDateString()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-md shadow-md">
          <p className="text-sm font-medium">{formattedDateTime}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Progreso acumulado: {formatCurrency(data.accumulatedProgress)}
          </p>
          <p className="text-sm font-medium mt-1">
            Operación: {data.amount >= 0 ? "+" : ""}
            {formatCurrency(data.amount)}
          </p>
          <p className="text-sm font-medium">
            Progreso: {typeof data.percentage === "number" ? formatNumberValue(data.percentage, 2) : data.percentage}%
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Saldo total: {formatCurrency(data.balance)}</p>
        </div>
      )
    }
    return null
  }

  // Determinar el icono y color para el indicador de ritmo
  const getRateIndicator = () => {
    if (isProgressTooFast) {
      return {
        icon: AlertTriangle,
        color: "text-amber-500",
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        text: `Ritmo acelerado (${formatNumberValue(progressRate * 100, 0)}% de lo necesario)`,
      }
    } else if (progressRate > 0.9) {
      return {
        icon: TrendingUp,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        text: `Ritmo óptimo (${formatNumberValue(progressRate * 100, 0)}% de lo necesario)`,
      }
    } else {
      return {
        icon: Clock,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        text: `Ritmo moderado (${formatNumberValue(progressRate * 100, 0)}% de lo necesario)`,
      }
    }
  }

  const rateIndicator = getRateIndicator()
  const Icon = rateIndicator.icon

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Progreso Financiero</h3>

          <div
            className={`flex items-center ${rateIndicator.color} text-xs font-medium px-2 py-1 rounded-full ${rateIndicator.bgColor}`}
          >
            <Icon className="h-3 w-3 mr-1" />
            {rateIndicator.text}
          </div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#e0e0e0" }}
                label={{ value: "Fechas", position: "insideBottom", offset: -15, fontSize: 10 }}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#e0e0e0" }}
                tickFormatter={(value) => formatCurrency(value, false)}
                label={{ value: "Progreso (€)", angle: -90, position: "insideLeft", offset: 10, fontSize: 10 }}
                domain={[0, targetAmount > 0 ? targetAmount : "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Línea de progreso acumulado (suma de operaciones) */}
              <Line
                type="monotoneX"
                dataKey="accumulatedProgress"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4, fill: "#22c55e", stroke: "#fff", strokeWidth: 1 }}
                activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff", strokeWidth: 2 }}
                name="Progreso acumulado"
              />

              {/* Línea de referencia para la meta (100%) */}
              {targetAmount > 0 && (
                <ReferenceLine y={targetAmount} stroke="#3b82f6" strokeDasharray="5 5" strokeWidth={2}>
                  <Label value="Meta (100%)" position="insideTopRight" fill="#3b82f6" fontSize={10} />
                </ReferenceLine>
              )}

              {/* Línea de referencia para 50% de progreso */}
              {targetAmount > 0 && (
                <ReferenceLine y={targetAmount * 0.5} stroke="#64748b" strokeDasharray="3 3" strokeWidth={1}>
                  <Label value="50%" position="insideRight" fill="#64748b" fontSize={10} />
                </ReferenceLine>
              )}

              {/* Línea de referencia para 25% de progreso */}
              {targetAmount > 0 && (
                <ReferenceLine y={targetAmount * 0.25} stroke="#64748b" strokeDasharray="3 3" strokeWidth={1}>
                  <Label value="25%" position="insideRight" fill="#64748b" fontSize={10} />
                </ReferenceLine>
              )}

              {/* Línea de referencia para 75% de progreso */}
              {targetAmount > 0 && (
                <ReferenceLine y={targetAmount * 0.75} stroke="#64748b" strokeDasharray="3 3" strokeWidth={1}>
                  <Label value="75%" position="insideRight" fill="#64748b" fontSize={10} />
                </ReferenceLine>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div>Meta diaria: {formatCurrency(dailyGoalNeeded)}</div>
          <div>
            Progreso acumulado: {formatCurrency(currentProgress)} / {formatCurrency(targetAmount)} (
            {formatNumberValue(currentProgressPercentage, 2)}%)
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
