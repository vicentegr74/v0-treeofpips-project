"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/context/projects-context"
import { formatCurrency } from "@/lib/utils"
import { Clock, AlertTriangle, TrendingUp, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ProgressDashboard() {
  const { projects } = useProjects()
  const [projectsWithProgress, setProjectsWithProgress] = useState<any[]>([])
  const [aheadProjects, setAheadProjects] = useState<any[]>([])
  const [behindProjects, setBehindProjects] = useState<any[]>([])

  useEffect(() => {
    // Calcular progreso esperado y real para cada proyecto
    const analyzedProjects = projects.map((project) => {
      const today = new Date()
      const deadline = new Date(project.targetDate)
      const startDate = new Date(project.startDate)
      const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Calcular progreso esperado basado en tiempo transcurrido
      const totalDays = Math.ceil((deadline.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassed / totalDays) * 100)) : 0

      // Determinar si está adelantado o atrasado
      const progressDifference = project.progressPercentage - expectedProgress
      const isAhead = progressDifference > 0
      const isBehind = progressDifference < 0

      // Calcular meta diaria necesaria para cumplir a tiempo
      const remainingAmount = project.targetAmount - (project.currentBalance - project.initialCapital)
      const dailyGoalNeeded = daysRemaining > 0 ? remainingAmount / daysRemaining : remainingAmount

      // Calcular días de ventaja o retraso
      const daysAheadOrBehind = totalDays > 0 ? Math.round((progressDifference / 100) * totalDays) : 0

      return {
        ...project,
        daysRemaining,
        expectedProgress,
        progressDifference,
        isAhead,
        isBehind,
        dailyGoalNeeded,
        daysAheadOrBehind: Math.abs(daysAheadOrBehind),
        aheadScore: isAhead ? progressDifference * 2 + (100 - project.progressPercentage) : 0,
        behindScore: isBehind ? Math.abs(progressDifference) * 2 + (100 - project.progressPercentage) : 0,
      }
    })

    // Ordenar proyectos adelantados por puntuación (mayor primero)
    const ahead = analyzedProjects
      .filter((p) => p.isAhead)
      .sort((a, b) => b.aheadScore - a.aheadScore)
      .slice(0, 3)

    // Ordenar proyectos atrasados por puntuación (mayor primero)
    const behind = analyzedProjects
      .filter((p) => p.isBehind)
      .sort((a, b) => b.behindScore - a.behindScore)
      .slice(0, 3)

    setProjectsWithProgress(analyzedProjects)
    setAheadProjects(ahead)
    setBehindProjects(behind)
  }, [projects])

  // Función para determinar el color de progreso
  const getProgressColor = (progressDifference: number) => {
    if (progressDifference >= 20) return "text-emerald-500"
    if (progressDifference > 0) return "text-green-500"
    if (progressDifference <= -20) return "text-red-500"
    if (progressDifference < 0) return "text-amber-500"
    return "text-blue-500"
  }

  if (projectsWithProgress.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-blue-500" />
          Progreso de Proyectos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ahead" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger
              value="ahead"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
            >
              <Shield className="h-4 w-4 mr-2" />
              Ritmo acelerado
            </TabsTrigger>
            <TabsTrigger
              value="behind"
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300"
            >
              <Clock className="h-4 w-4 mr-2" />
              Necesitan atención
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ahead" className="space-y-4">
            {aheadProjects.length > 0 ? (
              aheadProjects.map((project) => (
                <Link href={`/proyectos/${project.id}`} key={project.id}>
                  <motion.div
                    className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs flex items-center text-blue-600">
                            <Shield className="h-3 w-3 mr-1" />
                            {project.daysAheadOrBehind} {project.daysAheadOrBehind === 1 ? "día" : "días"} por delante
                            del cronograma
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Progreso actual:</div>
                        <div className="font-medium text-sm text-blue-600">{project.progressPercentage}%</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progreso esperado: {project.expectedProgress}%</span>
                        <span className="text-blue-600 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />+{project.progressDifference}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-blue-200 dark:bg-blue-700/50 absolute top-1"
                            style={{ width: `${project.expectedProgress}%`, height: "0.5rem" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No hay proyectos adelantados en este momento
              </div>
            )}

            {aheadProjects.length > 0 && (
              <div className="text-center text-sm text-blue-600 pt-2">
                <p>
                  Recuerda mantener un ritmo constante. En trading, ir demasiado rápido puede llevar a decisiones
                  impulsivas.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="behind" className="space-y-4">
            {behindProjects.length > 0 ? (
              behindProjects.map((project) => (
                <Link href={`/proyectos/${project.id}`} key={project.id}>
                  <motion.div
                    className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-xs flex items-center text-amber-600">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {project.daysAheadOrBehind} {project.daysAheadOrBehind === 1 ? "día" : "días"} por detrás
                            del cronograma
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Meta diaria necesaria:</div>
                        <div className="font-medium text-sm">{formatCurrency(project.dailyGoalNeeded)}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progreso actual: {project.progressPercentage}%</span>
                        <span className="text-amber-600 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {project.progressDifference}%
                        </span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                            style={{ width: `${project.progressPercentage}%` }}
                          ></div>
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-amber-300/50 dark:bg-amber-700/50 absolute top-1"
                            style={{ width: `${project.expectedProgress}%`, height: "0.5rem" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No hay proyectos atrasados en este momento
              </div>
            )}

            {behindProjects.length > 0 && (
              <div className="text-center text-sm text-amber-600 pt-2">
                <p>Estos proyectos necesitan atención adicional para alcanzar sus metas a tiempo</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
