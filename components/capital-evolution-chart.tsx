"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from "recharts"
import { formatCurrency, formatNumberValue } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CapitalEvolutionChartProps {
  projectId: string
  initialCapital: number
  progressHistory: Array<{
    id: string
    date: string
    amount: number
    balance: number
    progressPercentage: number
  }>
  className?: string
  data?: Array<{
    name: string
    capital: number
  }>
}

type TimeFilter = "today" | "week" | "month" | "custom"

export function CapitalEvolutionChart({
  projectId,
  initialCapital,
  progressHistory,
  className = "",
  data,
}: CapitalEvolutionChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [profitPercentage, setProfitPercentage] = useState<number>(0)
  const [currentEquity, setCurrentEquity] = useState<number>(initialCapital)
  const [minValue, setMinValue] = useState<number>(0)
  const [maxValue, setMaxValue] = useState<number>(0)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today")
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null)
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null)
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)

  // Si se proporciona data directamente, usarla
  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data)

      // Calcular valores para las estadísticas
      const firstValue = data[0]?.capital || initialCapital
      const lastValue = data[data.length - 1]?.capital || initialCapital

      setCurrentEquity(lastValue)

      const profit = lastValue - firstValue
      const profitPercent = firstValue > 0 ? (profit / firstValue) * 100 : 0
      setProfitPercentage(profitPercent)

      // Calcular valores mínimos y máximos para el eje Y
      const values = data.map((item) => item.capital)
      const min = Math.min(...values)
      const max = Math.max(...values)
      const padding = (max - min) * 0.1

      setMinValue(Math.floor((min - padding) / 50) * 50)
      setMaxValue(Math.ceil((max + padding) / 50) * 50)

      return
    }

    // Procesar el historial de progreso para incluir el punto inicial
    const processedHistory = processHistory()

    // Filtrar datos según el filtro de tiempo seleccionado
    const filteredData = filterDataByTime(processedHistory)

    // Actualizar datos del gráfico
    updateChartData(filteredData)
  }, [data, progressHistory, initialCapital, timeFilter, customStartDate, customEndDate])

  // Procesar el historial de progreso para incluir el punto inicial
  const processHistory = () => {
    if (!progressHistory || progressHistory.length === 0) {
      return [
        {
          id: "initial",
          date: new Date().toISOString(),
          amount: 0,
          balance: initialCapital,
          progressPercentage: 0,
        },
      ]
    }

    // Ordenar el historial por fecha
    const sortedHistory = [...progressHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Añadir el punto inicial
    return [
      {
        id: "initial",
        date: sortedHistory[0]?.date || new Date().toISOString(),
        amount: 0,
        balance: initialCapital,
        progressPercentage: 0,
      },
      ...sortedHistory,
    ]
  }

  // Filtrar datos según el filtro de tiempo seleccionado
  const filterDataByTime = (data: any[]) => {
    const now = new Date()
    let startDate: Date

    switch (timeFilter) {
      case "today":
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
        break
      case "week":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "custom":
        if (customStartDate && customEndDate) {
          return data.filter((entry) => {
            const entryDate = new Date(entry.date)
            return entryDate >= customStartDate && entryDate <= customEndDate
          })
        }
        return data
      default:
        startDate = new Date(now)
        startDate.setHours(0, 0, 0, 0)
    }

    return data.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= startDate
    })
  }

  // Actualizar datos del gráfico
  const updateChartData = (filteredData: any[]) => {
    if (filteredData.length === 0) {
      // Si no hay datos filtrados, mostrar solo el capital inicial
      const initialData = [
        {
          date: new Date().toISOString(),
          balance: initialCapital,
          amount: 0,
        },
      ]
      setChartData(formatChartData(initialData))
      setCurrentEquity(initialCapital)
      setProfitPercentage(0)
      setMinValue(initialCapital * 0.95)
      setMaxValue(initialCapital * 1.05)
      return
    }

    // Formatear los datos para el gráfico
    const formattedData = formatChartData(filteredData)
    setChartData(formattedData)

    // Calcular el capital actual y el porcentaje de beneficio/pérdida
    const firstBalance = filteredData[0]?.balance || initialCapital
    const lastBalance = filteredData[filteredData.length - 1]?.balance || initialCapital
    setCurrentEquity(lastBalance)

    const profit = lastBalance - firstBalance
    const profitPercent = firstBalance > 0 ? (profit / firstBalance) * 100 : 0
    setProfitPercentage(profitPercent)

    // Calcular valores mínimos y máximos para el eje Y
    const balances = filteredData.map((entry) => entry.balance)
    const min = Math.min(...balances)
    const max = Math.max(...balances)
    const padding = (max - min) * 0.1 // 10% de padding

    setMinValue(Math.floor((min - padding) / 50) * 50) // Redondear a la cincuentena inferior
    setMaxValue(Math.ceil((max + padding) / 50) * 50) // Redondear a la cincuentena superior
  }

  // Formatear los datos para el gráfico
  const formatChartData = (data: any[]) => {
    return data.map((entry) => ({
      date: formatDate(entry.date),
      timestamp: new Date(entry.date).getTime(),
      balance: entry.balance,
      amount: entry.amount,
    }))
  }

  // Formatear fecha para el eje X
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  }

  // Formatear tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const isPositive = data.amount >= 0

      return (
        <div className="bg-[#1e1e1e] border border-[#333] rounded-md shadow-md p-3 text-white">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            Balance: <span className="font-semibold">{formatCurrency(data.balance)}</span>
          </p>
          <p className="text-sm">
            Operación:{" "}
            <span className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? "+" : ""}
              {formatCurrency(data.amount)}
            </span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className={`overflow-hidden bg-[#1e1e1e] text-white border-[#333] ${className}`}>
      <CardHeader className="p-4 bg-[#1e1e1e] border-b border-[#333]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-white">Account Balance</CardTitle>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-base text-white font-semibold">{formatCurrency(currentEquity)}</div>
            <div className="flex items-center">
              <span className="text-sm mr-1 text-gray-300">Equity: </span>
              <span className="text-sm font-semibold text-white">{formatCurrency(currentEquity)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-1 text-gray-300">Profit:</span>
              <span
                className={`text-sm font-semibold flex items-center ${
                  profitPercentage >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {profitPercentage >= 0 ? (
                  <>
                    +{formatNumberValue(profitPercentage, 2)}% <ArrowUpRight className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    {formatNumberValue(profitPercentage, 2)}% <ArrowDownRight className="h-3 w-3 ml-1" />
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] w-full bg-[#1e1e1e]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#888" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                domain={[minValue, maxValue]}
                tick={{ fontSize: 10, fill: "#888" }}
                tickLine={false}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickFormatter={(value) => {
                  if (typeof value !== "number") return ""
                  return value.toString()
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBalance)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-2 flex justify-center border-t border-[#333]">
          <div className="flex space-x-1 bg-[#111] rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded-md text-sm ${
                timeFilter === "today" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setTimeFilter("today")}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded-md text-sm ${
                timeFilter === "week" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setTimeFilter("week")}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded-md text-sm ${
                timeFilter === "month" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => setTimeFilter("month")}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1 rounded-md text-sm ${
                timeFilter === "custom" ? "bg-blue-600 text-white" : "bg-transparent text-gray-300 hover:text-white"
              }`}
              onClick={() => {
                setTimeFilter("custom")
                setShowCustomDatePicker(true)
              }}
            >
              Custom
            </Button>
          </div>
        </div>
        {showCustomDatePicker && (
          <div className="p-4 border-t border-[#333]">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">Fecha inicio</label>
                <input
                  type="date"
                  className="w-full bg-[#333] text-white border border-[#444] rounded-md px-3 py-2 text-sm"
                  onChange={(e) => setCustomStartDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-300 mb-1">Fecha fin</label>
                <input
                  type="date"
                  className="w-full bg-[#333] text-white border border-[#444] rounded-md px-3 py-2 text-sm"
                  onChange={(e) => setCustomEndDate(e.target.value ? new Date(e.target.value) : null)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowCustomDatePicker(false)}
                >
                  Aplicar
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
