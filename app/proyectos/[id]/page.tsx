"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useProjects } from "@/context/projects-context"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import { AnimatedTree } from "@/components/animated-tree"
import { ProjectJournal } from "@/components/project-journal"
import { sendNotification } from "@/lib/notifications"
import { toast } from "@/components/ui/use-toast"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { MilestoneTimeline } from "@/components/milestone-timeline"
import { DailyGoalIndicator } from "@/components/daily-goal-indicator"
import { DailyGoalTrendChart } from "@/components/daily-goal-trend-chart"
import { ProjectSuggestions } from "@/components/project-suggestions"
import { CapitalEvolutionChart } from "@/components/capital-evolution-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectDetailPage({ params }) {
  const router = useRouter()
  const projectId = params.id as string
  const { getProject, deleteProject, updateProjectProgress } = useProjects()
  const [dailyProgress, setDailyProgress] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const { isOpen, itemToDelete, openConfirmation, closeConfirmation } = useDeleteConfirmation()
  const [progressStatus, setProgressStatus] = useState({
    isAhead: false,
    isBehind: false,
    expectedProgress: 0,
    progressDifference: 0,
  })

  // Verificar si estamos en una ruta especial que debería redirigir
  useEffect(() => {
    if (projectId === "nuevo" || projectId === "crear") {
      // Redirigir directamente sin usar setTimeout
      router.replace("/proyectos/crear")
    }
  }, [projectId, router])

  // Si estamos en una ruta especial, no renderizar el resto del componente
  if (projectId === "nuevo" || projectId === "crear") {
    return null // No renderizar nada mientras se redirige
  }

  const project = getProject(projectId)

  if (!project) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">Proyecto no encontrado</h3>
        <p className="text-muted-foreground mt-2">El proyecto que buscas no existe o ha sido eliminado.</p>
        <Link href="/proyectos" className="mt-4 inline-block">
          <Button variant="outline">Volver a proyectos</Button>
        </Link>
      </div>
    )
  }

  const handleDeleteClick = () => {
    openConfirmation(project.id, project.title)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteProject(itemToDelete.id)
      toast({
        title: "Proyecto eliminado",
        description: `El proyecto "${itemToDelete.title}" ha sido eliminado correctamente.`,
        variant: "success",
      })
      closeConfirmation()
      router.push("/proyectos")
    }
  }

  const handleAddProgress = () => {
    if (!dailyProgress || isNaN(Number(dailyProgress))) return

    const progressValue = Number(dailyProgress)
    updateProjectProgress(project.id, progressValue)
    setDailyProgress("")
    setShowConfetti(true)

    // Mostrar notificación de logro
    if (project.progressPercentage < 25 && project.progressPercentage + progressValue >= 25) {
      sendNotification("¡Logro desbloqueado!", `Has alcanzado el 25% de tu objetivo en ${project.title}`)
    } else if (project.progressPercentage < 50 && project.progressPercentage + progressValue >= 50) {
      sendNotification("¡Logro desbloqueado!", `Has alcanzado el 50% de tu objetivo en ${project.title}`)
    } else if (project.progressPercentage < 75 && project.progressPercentage + progressValue >= 75) {
      sendNotification("¡Logro desbloqueado!", `Has alcanzado el 75% de tu objetivo en ${project.title}`)
    } else if (project.progressPercentage < 100 && project.progressPercentage + progressValue >= 100) {
      sendNotification("¡Felicidades!", `Has completado tu objetivo en ${project.title}`)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  const handleTreeGrow = () => {
    // Reproducir sonido de crecimiento solo si el archivo existe
    try {
      const audio = new Audio("/sounds/growth.mp3")

      // Añadir manejador de error para evitar promesas rechazadas sin manejar
      audio.addEventListener("error", (e) => {
        console.log("Error al cargar el audio:", e)
      })

      // Intentar reproducir con manejo de errores
      audio.play().catch((err) => {
        console.log("No se pudo reproducir el audio:", err)
      })
    } catch (error) {
      console.log("Error al inicializar el audio:", error)
    }
  }

  // Calcular días restantes
  const today = new Date()
  const targetDate = new Date(project.targetDate)
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Calcular meta diaria necesaria para cumplir a tiempo
  const remainingAmount = project.targetAmount - (project.currentBalance - project.initialCapital)
  const dailyGoalNeeded = daysRemaining > 0 ? remainingAmount / daysRemaining : remainingAmount

  // Calcular el progreso diario promedio
  const startDate = new Date(project.startDate)
  const daysPassed = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const totalProgress = project.currentBalance - project.initialCapital
  const averageDailyProgress = totalProgress / daysPassed

  // Calcular progreso esperado basado en tiempo transcurrido
  const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassed / totalDays) * 100)) : 0
  const progressDifference = project.progressPercentage - expectedProgress
  const isAhead = progressDifference > 0
  const isBehind = progressDifference < 0

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/proyectos">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-green-700">Detalle del Proyecto</h1>
        </div>
        <div className="flex space-x-2">
          <Link href={`/proyectos/${project.id}/editar`}>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="text-destructive" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Añadir sugerencias personalizadas */}
      <ProjectSuggestions
        dailyGoalNeeded={dailyGoalNeeded}
        averageDailyProgress={averageDailyProgress}
        daysActive={daysPassed}
        daysRemaining={daysRemaining}
        progressPercentage={project.progressPercentage}
        expectedProgress={expectedProgress}
        progressHistory={project.progressHistory}
      />

      <Card className="overflow-hidden">
        <CardHeader className="bg-green-50 dark:bg-green-900/20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-green-700 dark:text-green-400">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            </div>

            {/* Añadir indicador de días restantes */}
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                daysRemaining <= 0
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  : daysRemaining <= 7
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {daysRemaining <= 0
                ? "¡Plazo vencido!"
                : `${daysRemaining} ${daysRemaining === 1 ? "día" : "días"} restantes`}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="evolution">Evolución del Capital</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Capital inicial</p>
                      <p className="text-lg font-semibold">{formatCurrency(project.initialCapital)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo actual</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(project.currentBalance)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Meta</p>
                      <p className="text-lg font-semibold">{formatCurrency(project.targetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total a alcanzar</p>
                      <p className="text-lg font-semibold">{formatCurrency(project.totalTarget)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Saldo pendiente</p>
                      <p className="text-lg font-semibold text-amber-600">
                        {formatCurrency(project.targetAmount - (project.currentBalance - project.initialCapital))}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-muted-foreground">Meta diaria necesaria</p>
                        <DailyGoalIndicator
                          dailyGoalNeeded={dailyGoalNeeded}
                          averageDailyProgress={averageDailyProgress}
                          daysActive={daysPassed}
                        />
                      </div>
                      <p className="text-lg font-semibold text-blue-600">{formatCurrency(dailyGoalNeeded)}</p>
                    </div>
                  </div>

                  {/* Gráfico de tendencia con las propiedades correctas */}
                  <DailyGoalTrendChart
                    dailyGoalNeeded={dailyGoalNeeded}
                    averageDailyProgress={averageDailyProgress}
                    daysActive={daysPassed}
                    className="mt-4"
                    currentProgress={totalProgress}
                    totalTarget={project.targetAmount}
                    progressHistory={project.progressHistory}
                  />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso: {project.progressPercentage}%</span>
                      <span>
                        {formatCurrency(project.currentBalance - project.initialCapital)} /{" "}
                        {formatCurrency(project.targetAmount)}
                      </span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                      <Progress value={project.progressPercentage} className="h-2" />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Fecha inicio</p>
                      <p>{formatDate(project.startDate)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Fecha objetivo</p>
                      <p className={daysRemaining <= 0 ? "text-red-500" : ""}>{formatDate(project.targetDate)}</p>
                    </div>
                  </div>

                  {/* Añadir la línea de tiempo de hitos */}
                  <MilestoneTimeline
                    milestones={project.milestones}
                    targetDate={project.targetDate}
                    progressPercentage={project.progressPercentage}
                    targetAmount={project.targetAmount}
                  />

                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="Añadir progreso diario"
                      value={dailyProgress}
                      onChange={(e) => setDailyProgress(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddProgress}
                      className="bg-green-600 hover:bg-green-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Añadir
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <AnimatedTree progressPercentage={project.progressPercentage} onGrow={handleTreeGrow} />
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="evolution" className="mt-0">
              <CapitalEvolutionChart
                projectId={project.id}
                initialCapital={project.initialCapital}
                progressHistory={project.progressHistory}
                className="mb-6"
              />

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Historial de operaciones</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium">Fecha</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Operación</th>
                        <th className="px-4 py-2 text-right text-sm font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.progressHistory.length > 0 ? (
                        [...project.progressHistory]
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((entry) => (
                            <tr key={entry.id} className="border-t">
                              <td className="px-4 py-2 text-sm">
                                {new Date(entry.date).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </td>
                              <td
                                className={`px-4 py-2 text-right text-sm font-medium ${entry.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {entry.amount >= 0 ? "+" : ""}
                                {formatCurrency(entry.amount)}
                              </td>
                              <td className="px-4 py-2 text-right text-sm font-medium">
                                {formatCurrency(entry.balance)}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-sm text-muted-foreground">
                            No hay operaciones registradas
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <Input
                  type="number"
                  placeholder="Añadir operación"
                  value={dailyProgress}
                  onChange={(e) => setDailyProgress(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddProgress} className="bg-green-600 hover:bg-green-700">
                  Añadir
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <ProjectJournal projectId={project.id} />
        </CardContent>
      </Card>

      {/* Confeti cuando se añade progreso */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: [
                  "#22c55e",
                  "#4ade80",
                  "#86efac",
                  "#bbf7d0",
                  "#dcfce7",
                  "#f0fdf4",
                  "#15803d",
                  "#166534",
                  "#14532d",
                ][Math.floor(Math.random() * 9)],
                top: `-5%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: ["0vh", `${100 + Math.random() * 20}vh`],
                x: [0, (Math.random() - 0.5) * 200],
                rotate: [0, Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                ease: [0.1, 0.25, 0.3, 1],
                delay: Math.random() * 0.5,
              }}
              onAnimationComplete={() => {
                if (i === 0) setShowConfetti(false)
              }}
            />
          ))}
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Confirmar eliminación"
        message={
          itemToDelete
            ? `¿Estás seguro de que deseas eliminar el proyecto "${itemToDelete.title}"? Esta acción no se puede deshacer.`
            : "¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer."
        }
      />
    </motion.div>
  )
}
