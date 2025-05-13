"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, TrendingDown, Clock, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { TreeVisualization } from "@/components/tree-visualization"
import { formatCurrency } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ProjectJournal } from "@/components/project-journal"
import type { Project } from "@/context/projects-context"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { Badge } from "@/components/ui/badge"
import { DailyGoalIndicator } from "@/components/daily-goal-indicator"
import { DailyGoalTrendChart } from "@/components/daily-goal-trend-chart"
import { ProjectSuggestions } from "@/components/project-suggestions"
import { MilestoneMedalsRow } from "@/components/milestone-medals-row"
import { ProgressAnimation } from "@/components/progress-animation"
import { AnimatedProgressBar } from "@/components/animated-progress-bar"
import { motion } from "framer-motion"

interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
  onUpdateProgress: (id: string, amount: number) => void
}

export function ProjectCard({ project, onDelete, onUpdateProgress }: ProjectCardProps) {
  const [dailyProgress, setDailyProgress] = useState("")
  const { isOpen, itemToDelete, openConfirmation, closeConfirmation } = useDeleteConfirmation()
  const [progressStatus, setProgressStatus] = useState<{
    isAhead: boolean
    isBehind: boolean
    expectedProgress: number
    progressDifference: number
    daysAheadOrBehind: number
  }>({
    isAhead: false,
    isBehind: false,
    expectedProgress: 0,
    progressDifference: 0,
    daysAheadOrBehind: 0,
  })

  const [dailyGoalNeeded, setDailyGoalNeeded] = useState(0)
  const [averageDailyProgress, setAverageDailyProgress] = useState(0)
  const [daysPassedCalc, setDaysPassedCalc] = useState(0)
  const [daysRemaining, setDaysRemaining] = useState(0)

  // Referencias para animaciones
  const prevProgressRef = useRef(project.progressPercentage)
  const prevMilestonesRef = useRef({ ...project.milestones })
  const [showInputAnimation, setShowInputAnimation] = useState(false)

  useEffect(() => {
    // Calcular progreso esperado basado en tiempo transcurrido
    const today = new Date()
    const startDate = new Date(project.startDate)
    const targetDate = new Date(project.targetDate)

    const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassedValue = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    setDaysPassedCalc(daysPassedValue)

    const daysRemainingValue = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    setDaysRemaining(daysRemainingValue)

    const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassedValue / totalDays) * 100)) : 0
    const progressDifference = project.progressPercentage - expectedProgress

    const isAhead = progressDifference > 0
    const isBehind = progressDifference < 0

    // Calcular días de ventaja o retraso
    const daysAheadOrBehind = totalDays > 0 ? Math.round((Math.abs(progressDifference) / 100) * totalDays) : 0

    // Calcular meta diaria necesaria
    const remainingAmount = project.targetAmount - (project.currentBalance - project.initialCapital)
    const calculatedDailyGoal = daysRemainingValue > 0 ? remainingAmount / daysRemainingValue : remainingAmount
    setDailyGoalNeeded(calculatedDailyGoal)

    // Calcular el progreso diario promedio
    const totalProgress = project.currentBalance - project.initialCapital
    const daysPassedForAverage = Math.max(1, daysPassedValue) // Evitar división por cero
    const calculatedAverageDailyProgress = totalProgress / daysPassedForAverage
    setAverageDailyProgress(calculatedAverageDailyProgress)

    setProgressStatus({
      isAhead,
      isBehind,
      expectedProgress,
      progressDifference,
      daysAheadOrBehind,
    })
  }, [project])

  const handleAddProgress = () => {
    if (!dailyProgress || isNaN(Number(dailyProgress))) return

    const progressValue = Number(dailyProgress)
    onUpdateProgress(project.id, progressValue)
    setDailyProgress("")

    // Activar animación del campo de entrada
    setShowInputAnimation(true)
    setTimeout(() => setShowInputAnimation(false), 1000)
  }

  const handleDeleteClick = () => {
    openConfirmation(project.id, project.title)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete.id)
      closeConfirmation()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  // Calcular el progreso total actual (suma de todas las operaciones)
  const totalProgress = project.currentBalance - project.initialCapital

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50 dark:bg-green-900/20">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-green-700 dark:text-green-400">{project.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </div>
          <div className="flex space-x-2">
            {/* Añadir badge de estado de progreso */}
            {progressStatus.isAhead && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
              >
                <Shield className="h-3 w-3 mr-1" />
                Ritmo acelerado ({Math.abs(progressStatus.progressDifference)}% más rápido)
              </Badge>
            )}
            {progressStatus.isBehind && (
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
              >
                <TrendingDown className="h-3 w-3 mr-1" />
                {progressStatus.daysAheadOrBehind} {progressStatus.daysAheadOrBehind === 1 ? "día" : "días"} atrasado
              </Badge>
            )}
            {!progressStatus.isAhead && !progressStatus.isBehind && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
              >
                <Clock className="h-3 w-3 mr-1" />
                Ritmo óptimo
              </Badge>
            )}
            <Link href={`/proyectos/${project.id}/editar`}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="h-8 w-8 text-destructive" onClick={handleDeleteClick}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Componente de animación de progreso */}
        <ProgressAnimation
          previousProgress={prevProgressRef.current}
          currentProgress={totalProgress}
          targetAmount={project.targetAmount}
          milestones={project.milestones}
          previousMilestones={prevMilestonesRef.current}
        />

        {/* Actualizar referencias para la próxima comparación */}
        {useEffect(() => {
          prevProgressRef.current = project.progressPercentage
          prevMilestonesRef.current = { ...project.milestones }
        }, [project.progressPercentage, project.milestones])}

        {/* Añadir sugerencias personalizadas */}
        <ProjectSuggestions
          dailyGoalNeeded={dailyGoalNeeded}
          averageDailyProgress={averageDailyProgress}
          daysActive={daysPassedCalc}
          daysRemaining={daysRemaining}
          progressPercentage={project.progressPercentage}
          expectedProgress={progressStatus.expectedProgress}
          progressHistory={project.progressHistory}
          className="mb-6"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [1, 1, 1],
                }}
                transition={{ duration: 0.5 }}
                key={`initial-${project.initialCapital}`}
              >
                <p className="text-sm font-medium text-muted-foreground">Capital inicial</p>
                <p className="text-lg font-semibold">{formatCurrency(project.initialCapital)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [1, 1, 1],
                }}
                transition={{ duration: 0.5 }}
                key={`current-${project.currentBalance}`}
              >
                <p className="text-sm font-medium text-muted-foreground">Saldo actual</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(project.currentBalance)}</p>
              </motion.div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Meta</p>
                <p className="text-lg font-semibold">{formatCurrency(project.targetAmount)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Total a alcanzar</p>
                <p className="text-lg font-semibold">{formatCurrency(project.totalTarget)}</p>
              </div>

              <motion.div
                initial={{ opacity: 1 }}
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [1, 1, 1],
                }}
                transition={{ duration: 0.5 }}
                key={`progress-${totalProgress}`}
              >
                <p className="text-sm font-medium text-muted-foreground">Progreso acumulado</p>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalProgress)}</p>
              </motion.div>

              <div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-muted-foreground">Meta diaria necesaria</p>
                  <DailyGoalIndicator
                    dailyGoalNeeded={dailyGoalNeeded}
                    averageDailyProgress={averageDailyProgress}
                    daysActive={daysPassedCalc}
                  />
                </div>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(dailyGoalNeeded)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Fecha inicio</p>
                <p>{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Fecha objetivo</p>
                <p>{formatDate(project.targetDate)}</p>
              </div>
            </div>

            {/* Mover la sección de añadir progreso más arriba con animación */}
            <motion.div
              className="flex space-x-2"
              animate={
                showInputAnimation
                  ? {
                      y: [0, -5, 0],
                      scale: [1, 1.02, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>

            {/* Reemplazar los hitos con medallas en disposición vertical */}
            <MilestoneMedalsRow
              milestones={project.milestones}
              targetDate={project.targetDate}
              progressPercentage={project.progressPercentage}
              targetAmount={project.targetAmount}
              currentProgress={totalProgress}
            />

            {/* Añadir el gráfico de tendencia con las propiedades correctas */}
            <DailyGoalTrendChart
              dailyGoalNeeded={dailyGoalNeeded}
              averageDailyProgress={averageDailyProgress}
              daysActive={daysPassedCalc}
              className="mt-4"
              currentProgress={totalProgress}
              totalTarget={project.totalTarget}
              targetAmount={project.targetAmount}
              initialCapital={project.initialCapital}
              projectTitle={project.title}
              progressHistory={project.progressHistory}
            />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso: {project.progressPercentage.toFixed(2)}%</span>
                <span>
                  {formatCurrency(totalProgress)} / {formatCurrency(project.targetAmount)}
                </span>
              </div>

              {/* Reemplazar la barra de progreso estática con la animada */}
              <AnimatedProgressBar
                value={project.progressPercentage}
                expectedProgress={progressStatus.expectedProgress}
                className="h-2"
              />

              {/* Añadir texto de comparación de progreso */}
              <div className="text-xs">
                {progressStatus.isAhead && (
                  <span className="text-blue-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {Math.abs(progressStatus.progressDifference)}% por delante del ritmo planeado. Considera mantener un
                    ritmo constante.
                  </span>
                )}
                {progressStatus.isBehind && (
                  <span className="text-amber-600 flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {Math.abs(progressStatus.progressDifference)}% por debajo del progreso esperado (
                    {progressStatus.expectedProgress}%)
                  </span>
                )}
                {!progressStatus.isAhead && !progressStatus.isBehind && (
                  <span className="text-green-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Progreso exactamente según lo planeado ({progressStatus.expectedProgress}%). ¡Ritmo óptimo!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <TreeVisualization progressPercentage={project.progressPercentage} />
          </div>
        </div>

        <Separator className="my-6" />

        <ProjectJournal projectId={project.id} />
      </CardContent>

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
    </Card>
  )
}
