"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumberValue } from "@/lib/utils"
import { StatisticsFilterPanel } from "@/components/statistics-filter-panel"
import { TimeRangeSelector } from "@/components/time-range-selector"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Interfaces para los componentes
interface ChartProps {
  data: any[]
  className?: string
}

// Componente para el gráfico de rendimiento del proyecto
const ProjectPerformanceChart = ({ data, className }: ChartProps) => (
  <ResponsiveContainer width="100%" height="100%" className={className}>
    <RechartsBarChart
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip formatter={(value) => [`${formatNumberValue(value, 2)}%`, "ROI"]} />
      <Legend />
      <Bar dataKey="roi" fill="#8884d8" />
    </RechartsBarChart>
  </ResponsiveContainer>
)

// Componente para el gráfico de evolución del capital
const CapitalEvolutionChart = ({ data, className }: ChartProps) => (
  <ResponsiveContainer width="100%" height="100%" className={className}>
    <RechartsBarChart
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip formatter={(value) => [formatCurrency(value), "Capital"]} />
      <Legend />
      <Bar dataKey="capital" fill="#82ca9d" />
    </RechartsBarChart>
  </ResponsiveContainer>
)

// Componente para el gráfico de tendencia de objetivos diarios
const DailyGoalTrendChart = ({ data, className }: ChartProps) => (
  <ResponsiveContainer width="100%" height="100%" className={className}>
    <RechartsBarChart
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip
        formatter={(value) => [`${formatNumberValue(value, 2)}%`, value === data[0]?.goal ? "Meta" : "Logrado"]}
      />
      <Legend />
      <Bar dataKey="goal" fill="#8884d8" name="Meta" />
      <Bar dataKey="achieved" fill="#82ca9d" name="Logrado" />
    </RechartsBarChart>
  </ResponsiveContainer>
)

// Datos de ejemplo para las gráficas
const performanceData = [
  { name: "Ene", roi: 3.2 },
  { name: "Feb", roi: 2.8 },
  { name: "Mar", roi: 4.1 },
  { name: "Abr", roi: 3.5 },
  { name: "May", roi: 5.2 },
  { name: "Jun", roi: 4.8 },
]

const capitalData = [
  { name: "Ene", capital: 10000 },
  { name: "Feb", capital: 10280 },
  { name: "Mar", capital: 10702 },
  { name: "Abr", capital: 11080 },
  { name: "May", capital: 11656 },
  { name: "Jun", capital: 12216 },
]

const goalData = [
  { date: "01/06", goal: 0.5, achieved: 0.6 },
  { date: "02/06", goal: 0.5, achieved: 0.4 },
  { date: "03/06", goal: 0.5, achieved: 0.7 },
  { date: "04/06", goal: 0.5, achieved: 0.5 },
  { date: "05/06", goal: 0.5, achieved: 0.8 },
  { date: "06/06", goal: 0.5, achieved: 0.3 },
  { date: "07/06", goal: 0.5, achieved: 0.6 },
]

const projectTypeData = [
  { name: "Scalping", value: 35 },
  { name: "Day Trading", value: 25 },
  { name: "Swing", value: 20 },
  { name: "Position", value: 15 },
  { name: "Algorítmico", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const instrumentData = [
  { name: "EUR/USD", value: 40 },
  { name: "GBP/USD", value: 20 },
  { name: "USD/JPY", value: 15 },
  { name: "BTC/USD", value: 15 },
  { name: "Otros", value: 10 },
]

const INSTRUMENT_COLORS = ["#8884D8", "#82CA9D", "#FFBB28", "#FF8042", "#0088FE"]

const timeframeData = [
  { name: "M5", value: 10 },
  { name: "M15", value: 25 },
  { name: "H1", value: 35 },
  { name: "H4", value: 20 },
  { name: "D1", value: 10 },
]

const TIMEFRAME_COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8"]

const roiByProjectData = [
  { name: "Proyecto A", roi: 5.2 },
  { name: "Proyecto B", roi: 4.8 },
  { name: "Proyecto C", roi: 3.9 },
  { name: "Proyecto D", roi: 3.5 },
  { name: "Proyecto E", roi: 3.2 },
]

export default function StatisticsPage() {
  // Añadimos un estado para controlar si estamos en el cliente o en el servidor
  const [isClient, setIsClient] = useState(false)

  // Usamos useEffect para actualizar el estado cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("month")
  const [filters, setFilters] = useState({
    projectTypes: [],
    instruments: [],
    timeframes: [],
  })

  // Estadísticas generales
  const stats = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    averageROI: 3.9,
    totalProfits: 2216,
    winRate: 68,
    bestProject: {
      name: "Scalping EUR/USD",
      roi: 5.2,
    },
    worstProject: {
      name: "Position BTC/USD",
      roi: 2.1,
    },
  }

  // Estadísticas de rendimiento
  const performanceStats = {
    averageDailyROI: 0.18,
    bestDay: {
      date: "15/06/2023",
      roi: 0.8,
    },
    worstDay: {
      date: "03/06/2023",
      roi: -0.3,
    },
    volatility: 0.25,
    sharpeRatio: 1.8,
    maxDrawdown: 2.5,
    recoveryFactor: 1.5,
  }

  // Estadísticas de objetivos
  const goalStats = {
    dailyGoalAchievement: 85,
    weeklyGoalAchievement: 92,
    monthlyGoalAchievement: 88,
    consistencyScore: 76,
  }

  // Estadísticas de distribución
  const distributionStats = {
    topProjectType: "Scalping",
    topInstrument: "EUR/USD",
    topTimeframe: "H1",
    projectTypeDistribution: {
      scalping: 35,
      dayTrading: 25,
      swing: 20,
      position: 15,
      algorithmic: 5,
    },
    instrumentDistribution: {
      eurUsd: 40,
      gbpUsd: 20,
      usdJpy: 15,
      btcUsd: 15,
      others: 10,
    },
    timeframeDistribution: {
      m5: 10,
      m15: 25,
      h1: 35,
      h4: 20,
      d1: 10,
    },
  }

  // Si no estamos en el cliente, renderizamos un esqueleto o nada
  if (!isClient) {
    return <div className="container mx-auto px-4 py-8">Cargando estadísticas...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Estadísticas de Trading</h1>

      <div className="mb-6">
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div className="mb-8">
        <StatisticsFilterPanel filters={filters} onChange={setFilters} />
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Proyectos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeProjects} activos, {stats.completedProjects} completados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">ROI Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageROI}%</div>
                <p className="text-xs text-muted-foreground">Último mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Beneficios Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalProfits)}</div>
                <p className="text-xs text-muted-foreground">Último mes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.winRate}%</div>
                <p className="text-xs text-muted-foreground">De todas las operaciones</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Visión General</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="goals">Objetivos</TabsTrigger>
            <TabsTrigger value="distribution">Distribución</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Proyecto</CardTitle>
                  <CardDescription>ROI por proyecto en el último mes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <ProjectPerformanceChart data={performanceData} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del Capital</CardTitle>
                  <CardDescription>Crecimiento del capital en el último mes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <CapitalEvolutionChart data={capitalData} />
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Tendencia de Objetivos Diarios</CardTitle>
                  <CardDescription>Comparación entre objetivos y resultados</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <DailyGoalTrendChart data={goalData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ROI Diario Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.averageDailyROI}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mejor Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.bestDay.roi}%</div>
                  <p className="text-xs text-muted-foreground">{performanceStats.bestDay.date}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Peor Día</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.worstDay.roi}%</div>
                  <p className="text-xs text-muted-foreground">{performanceStats.worstDay.date}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Volatilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.volatility}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Ratio de Sharpe</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.sharpeRatio}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Drawdown Máximo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.maxDrawdown}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Factor de Recuperación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceStats.recoveryFactor}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento por Proyecto</CardTitle>
                  <CardDescription>ROI por proyecto en el último mes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <ProjectPerformanceChart data={performanceData} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Evolución del Capital</CardTitle>
                  <CardDescription>Crecimiento del capital en el último mes</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <CapitalEvolutionChart data={capitalData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Objetivos Diarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{goalStats.dailyGoalAchievement}%</div>
                  <p className="text-xs text-muted-foreground">Tasa de cumplimiento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Objetivos Semanales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{goalStats.weeklyGoalAchievement}%</div>
                  <p className="text-xs text-muted-foreground">Tasa de cumplimiento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Objetivos Mensuales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{goalStats.monthlyGoalAchievement}%</div>
                  <p className="text-xs text-muted-foreground">Tasa de cumplimiento</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Consistencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{goalStats.consistencyScore}/100</div>
                  <p className="text-xs text-muted-foreground">Puntuación de consistencia</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tendencia de Objetivos Diarios</CardTitle>
                <CardDescription>Comparación entre objetivos y resultados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px]">
                  <DailyGoalTrendChart data={goalData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="mt-4">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Tipo de Proyecto</CardTitle>
                      <CardDescription>Porcentaje de proyectos por tipo</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={projectTypeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {projectTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Instrumento</CardTitle>
                      <CardDescription>Porcentaje de proyectos por instrumento</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={instrumentData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {instrumentData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={INSTRUMENT_COLORS[index % INSTRUMENT_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Timeframe</CardTitle>
                      <CardDescription>Porcentaje de proyectos por timeframe</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={timeframeData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {timeframeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={TIMEFRAME_COLORS[index % TIMEFRAME_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>ROI por Proyecto</CardTitle>
                      <CardDescription>Rendimiento de cada proyecto</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={roiByProjectData}
                            layout="vertical"
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip
                              formatter={(value) => {
                                return [`${formatNumberValue(value, 2)}%`, "ROI Promedio"]
                              }}
                            />
                            <Legend />
                            <Bar dataKey="roi" fill="#8884d8">
                              {roiByProjectData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
