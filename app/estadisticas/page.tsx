"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  LineChart,
  PieChart,
  Filter,
  SlidersHorizontal,
  Calendar,
  TrendingUp,
  ArrowUpDown,
  Layers,
  ChevronDown,
} from "lucide-react"
import { useProjects } from "@/context/projects-context"
import { formatCurrency } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StatisticsCard } from "@/components/statistics-card"
import { ProjectPerformanceChart } from "@/components/project-performance-chart"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { StatisticsFilterPanel } from "@/components/statistics-filter-panel"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
  Brush,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts"

export default function StatisticsPage() {
  // Get project data from context
  const { projects = [], completedProjects = [], getStreak, getMonthlyData, getProjectTypeDistribution } = useProjects()

  // Initialize state
  const [stats, setStats] = useState({
    projectsStarted: 0,
    projectsCompleted: 0,
    averageCompletion: 0,
    streak: 0,
    totalProfit: 0,
    averageROI: 0,
    bestPerformer: { title: "", roi: 0 },
  })

  // State for interactive features
  const [timeRange, setTimeRange] = useState("6m") // 1m, 3m, 6m, 1y, all
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [showGoalLines, setShowGoalLines] = useState(true)
  const [chartType, setChartType] = useState("line") // line, bar, area, composed
  const [sortBy, setSortBy] = useState("performance") // performance, alphabetical, date
  const [filterType, setFilterType] = useState<string[]>([]) // forex, crypto, stocks, other

  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [projectData, setProjectData] = useState<any[]>([])
  const [projectPerformance, setProjectPerformance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [showFilters, setShowFilters] = useState(false)

  // Define getProject function
  const getProject = (id: string) => {
    return projects.find((p) => p.id === id) || completedProjects.find((p) => p.id === id)
  }

  // Calculate statistics based on projects data
  useEffect(() => {
    if (!Array.isArray(projects) || !Array.isArray(completedProjects)) {
      setIsLoading(false)
      return
    }

    try {
      // Basic stats
      const totalProjects = projects.length + completedProjects.length
      const avgCompletion =
        totalProjects > 0
          ? Math.round(
              (projects.reduce((sum, p) => sum + (p.progressPercentage || 0), 0) + completedProjects.length * 100) /
                totalProjects,
            )
          : 0

      // Calculate total profit
      const totalProfit = [...projects, ...completedProjects].reduce(
        (sum, p) => sum + ((p.currentBalance || 0) - (p.initialCapital || 0)),
        0,
      )

      // Calculate average ROI
      const totalROI = [...projects, ...completedProjects].reduce((sum, p) => {
        if (!p.initialCapital || p.initialCapital === 0) return sum
        return sum + (((p.currentBalance || 0) - (p.initialCapital || 0)) / p.initialCapital) * 100
      }, 0)
      const avgROI = totalProjects > 0 ? totalROI / totalProjects : 0

      // Find best performing project
      const allProjects = [...projects, ...completedProjects]
      let bestProject = { title: "Ninguno", roi: 0 }

      if (allProjects.length > 0) {
        const projectROIs = allProjects.map((p) => {
          if (!p.initialCapital || p.initialCapital === 0) return { title: p.title, roi: 0 }
          return {
            title: p.title,
            roi: (((p.currentBalance || 0) - (p.initialCapital || 0)) / p.initialCapital) * 100,
          }
        })

        bestProject = projectROIs.reduce((best, current) => (current.roi > best.roi ? current : best), {
          title: "Ninguno",
          roi: 0,
        })
      }

      // Obtener racha actual
      const currentStreak = typeof getStreak === "function" ? getStreak() : 0

      setStats({
        projectsStarted: totalProjects,
        projectsCompleted: completedProjects.length,
        averageCompletion: avgCompletion,
        streak: currentStreak,
        totalProfit,
        averageROI: avgROI,
        bestPerformer: bestProject,
      })

      // Set initial selected projects
      if (selectedProjects.length === 0 && allProjects.length > 0) {
        setSelectedProjects(allProjects.slice(0, Math.min(3, allProjects.length)).map((p) => p.id))
      }

      // Prepare project performance data
      const performanceData = prepareProjectPerformanceData(allProjects)
      setProjectPerformance(performanceData)

      // Obtener datos mensuales para gráficos
      const monthData = typeof getMonthlyData === "function" ? getMonthlyData() : []
      setMonthlyData(applyTimeRangeFilter(monthData, timeRange))

      // Obtener distribución de proyectos por tipo
      const typeDistribution = typeof getProjectTypeDistribution === "function" ? getProjectTypeDistribution() : []
      setProjectData(typeDistribution)
    } catch (error) {
      console.error("Error calculating statistics:", error)
    }

    setIsLoading(false)
  }, [projects, completedProjects, getStreak, getMonthlyData, getProjectTypeDistribution, timeRange, selectedProjects])

  // Function to prepare project performance data
  const prepareProjectPerformanceData = (projects) => {
    if (!Array.isArray(projects)) return []

    // Create a timeline of all project progress entries
    const allEntries = []

    projects.forEach((project) => {
      if (
        project &&
        project.progressHistory &&
        Array.isArray(project.progressHistory) &&
        project.progressHistory.length > 0
      ) {
        const entries = project.progressHistory.map((entry) => ({
          projectId: project.id,
          projectTitle: project.title,
          projectType: project.type,
          date: entry.date,
          amount: entry.amount || 0,
          balance: entry.balance || 0,
          initialCapital: project.initialCapital || 0,
          roi: project.initialCapital
            ? (((entry.balance || 0) - project.initialCapital) / project.initialCapital) * 100
            : 0,
        }))

        allEntries.push(...entries)
      }
    })

    // Sort by date
    allEntries.sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } catch (e) {
        return 0
      }
    })

    return allEntries
  }

  // Function to apply time range filter
  const applyTimeRangeFilter = (data, range) => {
    if (!Array.isArray(data) || data.length === 0) return []

    const now = new Date()
    const cutoffDate = new Date()

    switch (range) {
      case "1m":
        cutoffDate.setMonth(now.getMonth() - 1)
        break
      case "3m":
        cutoffDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        cutoffDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        cutoffDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
      default:
        return data
    }

    // For monthly data, filter by month key
    if (data[0] && data[0].month) {
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

      return data.filter((item) => {
        const monthIndex = monthNames.indexOf(item.month)
        if (monthIndex === -1) return true

        // Assuming the data is from the current year
        const itemDate = new Date(now.getFullYear(), monthIndex, 1)
        return itemDate >= cutoffDate
      })
    }

    // For daily data, filter by date
    return data.filter((item) => {
      if (!item.date) return true
      try {
        return new Date(item.date) >= cutoffDate
      } catch (e) {
        return true
      }
    })
  }

  // Filter project performance data based on selected projects and time range
  const filteredPerformanceData = useMemo(() => {
    if (!Array.isArray(projectPerformance) || projectPerformance.length === 0) return []

    let filtered = projectPerformance

    // Filter by selected projects
    if (Array.isArray(selectedProjects) && selectedProjects.length > 0) {
      filtered = filtered.filter((entry) => selectedProjects.includes(entry.projectId))
    }

    // Filter by project type
    if (Array.isArray(filterType) && filterType.length > 0) {
      filtered = filtered.filter((entry) => filterType.includes(entry.projectType))
    }

    // Apply time range filter
    filtered = applyTimeRangeFilter(filtered, timeRange)

    return filtered
  }, [projectPerformance, selectedProjects, filterType, timeRange])

  // Prepare data for the performance chart
  const performanceChartData = useMemo(() => {
    if (!Array.isArray(filteredPerformanceData) || filteredPerformanceData.length === 0) return []

    // Group data by date and project
    const groupedByDate = {}

    filteredPerformanceData.forEach((entry) => {
      if (!entry || !entry.date) return

      if (!groupedByDate[entry.date]) {
        groupedByDate[entry.date] = { date: entry.date }
      }

      // Store both balance and ROI for each project
      if (entry.projectId) {
        groupedByDate[entry.date][`balance_${entry.projectId}`] = entry.balance || 0
        groupedByDate[entry.date][`roi_${entry.projectId}`] = entry.roi || 0
        groupedByDate[entry.date][`project_${entry.projectId}`] = entry.projectTitle || ""
      }
    })

    // Convert to array and sort by date
    return Object.values(groupedByDate).sort((a, b) => {
      try {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } catch (e) {
        return 0
      }
    })
  }, [filteredPerformanceData])

  // Get all available projects for selection
  const availableProjects = useMemo(() => {
    if (!Array.isArray(projects) || !Array.isArray(completedProjects)) return []

    return [...projects, ...completedProjects].map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
    }))
  }, [projects, completedProjects])

  // Colors for charts
  const COLORS = [
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#15803d",
    "#0ea5e9",
    "#0284c7",
    "#0369a1",
    "#f59e0b",
    "#d97706",
    "#b45309",
  ]
  const TYPE_COLORS = {
    forex: "#22c55e",
    criptomonedas: "#0ea5e9",
    acciones: "#f59e0b",
    otros: "#a855f7",
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p>Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-green-700">Estadísticas Avanzadas</h1>

        <div className="flex flex-wrap items-center gap-2">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Filtros
            <Badge variant="secondary" className="ml-1">
              {filterType.length || selectedProjects.length ? filterType.length + selectedProjects.length : "Todos"}
            </Badge>
          </Button>
        </div>
      </div>

      {showFilters && (
        <StatisticsFilterPanel
          availableProjects={availableProjects}
          selectedProjects={selectedProjects}
          setSelectedProjects={setSelectedProjects}
          filterType={filterType}
          setFilterType={setFilterType}
          onClose={() => setShowFilters(false)}
        />
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Layers className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="profits">
            <LineChart className="h-4 w-4 mr-2" />
            Ganancias
          </TabsTrigger>
          <TabsTrigger value="projects">
            <BarChart className="h-4 w-4 mr-2" />
            Proyectos
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChart className="h-4 w-4 mr-2" />
            Distribución
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <motion.div variants={item}>
              <StatisticsCard
                title="Proyectos Iniciados"
                value={stats.projectsStarted}
                icon={<Calendar className="h-4 w-4 text-blue-500" />}
              />
            </motion.div>
            <motion.div variants={item}>
              <StatisticsCard
                title="Proyectos Completados"
                value={stats.projectsCompleted}
                icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              />
            </motion.div>
            <motion.div variants={item}>
              <StatisticsCard
                title="Ganancia Total"
                value={formatCurrency(stats.totalProfit)}
                icon={<ArrowUpDown className="h-4 w-4 text-amber-500" />}
              />
            </motion.div>
            <motion.div variants={item}>
              <StatisticsCard
                title="Racha Actual"
                value={`${stats.streak} días`}
                icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
              />
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento General</CardTitle>
                  <CardDescription>Métricas clave de rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">ROI Promedio</span>
                      <span className="font-bold text-green-600">{stats.averageROI.toFixed(2)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(0, stats.averageROI))}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cumplimiento Medio</span>
                      <span className="font-bold text-blue-600">{stats.averageCompletion}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${stats.averageCompletion}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mejor Proyecto</span>
                      <span className="font-bold text-amber-600">
                        {stats.bestPerformer.title} ({stats.bestPerformer.roi.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                  <CardDescription>Capital invertido por tipo de mercado</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {projectData && projectData.length > 0 && (
                    <div className="h-[250px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={projectData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              name && percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                            }
                            animationDuration={1500}
                            animationBegin={300}
                          >
                            {projectData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={TYPE_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${formatCurrency(value)}`, "Capital invertido"]} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Profits Tab */}
        <TabsContent value="profits" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="profits-chart"
            className="space-y-6"
          >
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Ganancias vs. Objetivos</CardTitle>
                  <CardDescription>Comparación de ganancias reales contra objetivos</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <SlidersHorizontal className="h-4 w-4" />
                        Opciones
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="p-2">
                        <div className="flex items-center space-x-2 mb-3">
                          <Switch id="show-goals" checked={showGoalLines} onCheckedChange={setShowGoalLines} />
                          <Label htmlFor="show-goals">Mostrar objetivos</Label>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="chart-type">Tipo de gráfico</Label>
                          <Select value={chartType} onValueChange={setChartType}>
                            <SelectTrigger id="chart-type">
                              <SelectValue placeholder="Tipo de gráfico" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="line">Línea</SelectItem>
                              <SelectItem value="bar">Barras</SelectItem>
                              <SelectItem value="area">Área</SelectItem>
                              <SelectItem value="composed">Compuesto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {monthlyData && monthlyData.length > 0 && (
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "line" && (
                        <RechartsLineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                            name="Ganancias"
                          />
                          {showGoalLines && (
                            <Line
                              type="monotone"
                              dataKey="goal"
                              stroke="#4ade80"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              dot={{ r: 4 }}
                              animationDuration={1500}
                              animationBegin={300}
                              name="Objetivo"
                            />
                          )}
                          <Brush dataKey="month" height={30} stroke="#8884d8" />
                        </RechartsLineChart>
                      )}

                      {chartType === "bar" && (
                        <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="profit" fill="#16a34a" radius={4} animationDuration={1500} name="Ganancias" />
                          {showGoalLines && (
                            <Bar dataKey="goal" fill="#4ade80" radius={4} animationDuration={1500} name="Objetivo" />
                          )}
                          <Brush dataKey="month" height={30} stroke="#8884d8" />
                        </RechartsBarChart>
                      )}

                      {chartType === "area" && (
                        <RechartsLineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#16a34a"
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            name="Ganancias"
                          />
                          {showGoalLines && (
                            <Area
                              type="monotone"
                              dataKey="goal"
                              stroke="#4ade80"
                              fillOpacity={1}
                              fill="url(#colorGoal)"
                              name="Objetivo"
                            />
                          )}
                          <Brush dataKey="month" height={30} stroke="#8884d8" />
                        </RechartsLineChart>
                      )}

                      {chartType === "composed" && (
                        <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="profit" fill="#16a34a" radius={4} name="Ganancias" />
                          {showGoalLines && (
                            <Line
                              type="monotone"
                              dataKey="goal"
                              stroke="#4ade80"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Objetivo"
                            />
                          )}
                          <Brush dataKey="month" height={30} stroke="#8884d8" />
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Datos para el período:{" "}
                  {timeRange === "1m"
                    ? "Último mes"
                    : timeRange === "3m"
                      ? "Últimos 3 meses"
                      : timeRange === "6m"
                        ? "Últimos 6 meses"
                        : timeRange === "1y"
                          ? "Último año"
                          : "Todo el tiempo"}
                </p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Proyecto</CardTitle>
                <CardDescription>Comparativa de rendimiento entre proyectos seleccionados</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ProjectPerformanceChart
                  data={performanceChartData}
                  selectedProjects={selectedProjects}
                  availableProjects={availableProjects}
                  colors={COLORS}
                />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Selecciona proyectos específicos en el panel de filtros para una comparación detallada
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="projects-chart"
            className="space-y-6"
          >
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Análisis de Proyectos</CardTitle>
                  <CardDescription>Rendimiento detallado por proyecto</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Rendimiento</SelectItem>
                      <SelectItem value="alphabetical">Alfabético</SelectItem>
                      <SelectItem value="date">Fecha de inicio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {availableProjects
                    .filter((p) => !filterType.length || filterType.includes(p.type))
                    .sort((a, b) => {
                      if (sortBy === "alphabetical") {
                        return a.title.localeCompare(b.title)
                      } else if (sortBy === "date") {
                        const projectA = getProject(a.id)
                        const projectB = getProject(b.id)
                        if (!projectA || !projectB) return 0
                        return new Date(projectA.startDate).getTime() - new Date(projectB.startDate).getTime()
                      }
                      // Default: performance
                      const projectA = getProject(a.id)
                      const projectB = getProject(b.id)
                      if (!projectA || !projectB) return 0

                      // Handle null or zero initialCapital values
                      if (!projectA.initialCapital || projectA.initialCapital === 0) return 1
                      if (!projectB.initialCapital || projectB.initialCapital === 0) return -1

                      const roiA = ((projectA.currentBalance - projectA.initialCapital) / projectA.initialCapital) * 100
                      const roiB = ((projectB.currentBalance - projectB.initialCapital) / projectB.initialCapital) * 100
                      return roiB - roiA
                    })
                    .map((project) => {
                      const fullProject = getProject(project.id)
                      if (!fullProject) return null

                      // Handle null or zero initialCapital values
                      const initialCapital = fullProject.initialCapital || 0
                      const currentBalance = fullProject.currentBalance || 0
                      const roi = initialCapital > 0 ? ((currentBalance - initialCapital) / initialCapital) * 100 : 0
                      const profit = currentBalance - initialCapital

                      return (
                        <div
                          key={project.id}
                          className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{fullProject.title}</h3>
                                <Badge variant="outline" className="capitalize">
                                  {fullProject.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{fullProject.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">ROI</p>
                                <p className={`font-bold ${roi >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {roi.toFixed(2)}%
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Ganancia</p>
                                <p className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  {formatCurrency(profit)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-muted-foreground">Progreso</p>
                                <p className="font-bold text-blue-600">{fullProject.progressPercentage || 0}%</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                              <div
                                className={`h-2.5 rounded-full ${roi >= 0 ? "bg-green-600" : "bg-red-600"}`}
                                style={{ width: `${Math.min(100, Math.max(0, fullProject.progressPercentage || 0))}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                            <span>Inicio: {new Date(fullProject.startDate).toLocaleDateString()}</span>
                            <span>Objetivo: {new Date(fullProject.targetDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Tendencias</CardTitle>
                <CardDescription>Evolución del rendimiento a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        fill="#4ade80"
                        stroke="#16a34a"
                        fillOpacity={0.3}
                        name="Ganancias"
                      />
                      <Line type="monotone" dataKey="goal" stroke="#0ea5e9" strokeWidth={2} name="Objetivo" />
                      <ReferenceLine y={0} stroke="#666" />
                      <Brush dataKey="month" height={30} stroke="#8884d8" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="mt-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key="distribution-chart"
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo</CardTitle>
                  <CardDescription>Capital invertido por tipo de mercado</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {projectData && projectData.length > 0 && (
                    <div className="h-[300px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={projectData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              name && percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                            }
                            animationDuration={1500}
                            animationBegin={300}
                          >
                            {projectData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={TYPE_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${formatCurrency(value)}`, "Capital invertido"]} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Rendimiento</CardTitle>
                  <CardDescription>ROI por tipo de mercado</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          ...Object.entries(TYPE_COLORS)
                            .map(([type, color]) => {
                              const typeProjects = [...projects, ...completedProjects].filter((p) => p.type === type)
                              if (!typeProjects.length) return null

                              const totalROI = typeProjects.reduce((sum, p) => {
                                if (!p.initialCapital || p.initialCapital === 0) return sum
                                const roi = ((p.currentBalance - p.initialCapital) / p.initialCapital) * 100
                                return sum + roi
                              }, 0)

                              const avgROI = typeProjects.length > 0 ? totalROI / typeProjects.length : 0

                              return {
                                name: type.charAt(0).toUpperCase() + type.slice(1),
                                roi: avgROI,
                                fill: color,
                              }
                            })
                            .filter(Boolean),
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "ROI Promedio"]} />
                        <Bar dataKey="roi" name="ROI Promedio">
                          {Object.entries(TYPE_COLORS).map(([type, color], index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Bar>
                        <ReferenceLine y={0} stroke="#666" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Análisis de Distribución Temporal</CardTitle>
                <CardDescription>Evolución de la distribución de inversiones a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="profit" stackId="a" name="Ganancias" fill="#4ade80" />
                      <Bar dataKey="goal" stackId="a" name="Objetivo" fill="#0ea5e9" />
                      <Brush dataKey="month" height={30} stroke="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
