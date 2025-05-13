"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/context/projects-context"
import { formatCurrency } from "@/lib/utils"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export function CountdownDashboard() {
  const { projects } = useProjects()
  const [sortedProjects, setSortedProjects] = useState<any[]>([])

  useEffect(() => {
    // Calcular días restantes y ordenar proyectos por urgencia
    const projectsWithDeadlines = projects.map((project) => {
      const today = new Date()
      const deadline = new Date(project.targetDate)
      const daysRemaining = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      // Calcular si está atrasado según el progreso esperado
      const totalDays = Math.ceil((deadline.getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
      const daysPassed = Math.ceil((today.getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
      const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassed / totalDays) * 100)) : 0
      const isBehindSchedule = project.progressPercentage < expectedProgress

      // Calcular meta diaria necesaria para cumplir a tiempo
      const remainingAmount = project.targetAmount - (project.currentBalance - project.initialCapital)
      const dailyGoalNeeded = daysRemaining > 0 ? remainingAmount / daysRemaining : remainingAmount

      return {
        ...project,
        daysRemaining,
        isBehindSchedule,
        expectedProgress,
        dailyGoalNeeded,
        urgencyScore: calculateUrgencyScore(daysRemaining, isBehindSchedule, project.progressPercentage),
      }
    })

    // Ordenar por puntuación de urgencia (mayor primero)
    setSortedProjects(projectsWithDeadlines.sort((a, b) => b.urgencyScore - a.urgencyScore).slice(0, 3))
  }, [projects])

  // Función para calcular la puntuación de urgencia
  const calculateUrgencyScore = (daysRemaining: number, isBehindSchedule: boolean, progressPercentage: number) => {
    let score = 0

    // Menos días = más urgente
    if (daysRemaining <= 0) score += 100
    else if (daysRemaining <= 3) score += 80
    else if (daysRemaining <= 7) score += 60
    else if (daysRemaining <= 14) score += 40
    else if (daysRemaining <= 30) score += 20

    // Estar atrasado aumenta la urgencia
    if (isBehindSchedule) score += 30

    // Bajo progreso aumenta la urgencia
    if (progressPercentage < 25) score += 20
    else if (progressPercentage < 50) score += 10

    return score
  }

  // Función para determinar el color de urgencia
  const getUrgencyColor = (daysRemaining: number, isBehindSchedule: boolean) => {
    if (daysRemaining <= 0) return "text-red-500"
    if (daysRemaining <= 3 || isBehindSchedule) return "text-amber-500"
    if (daysRemaining <= 7) return "text-yellow-500"
    return "text-green-500"
  }

  if (sortedProjects.length === 0) {
    return null
  }

  return (
    <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5 text-amber-500" />
          Metas con prioridad
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedProjects.map((project) => (
          <Link href={`/proyectos/${project.id}`} key={project.id}>
            <motion.div
              className="p-3 rounded-lg border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <div className="flex items-center mt-1">
                    {project.daysRemaining <= 0 ? (
                      <span className="text-xs flex items-center text-red-500">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        ¡Plazo vencido!
                      </span>
                    ) : (
                      <span
                        className={`text-xs flex items-center ${getUrgencyColor(project.daysRemaining, project.isBehindSchedule)}`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {project.daysRemaining} {project.daysRemaining === 1 ? "día" : "días"} restantes
                      </span>
                    )}
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
                  <span className={project.isBehindSchedule ? "text-amber-500" : "text-green-500"}>
                    {project.isBehindSchedule ? (
                      <span className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Esperado: {project.expectedProgress}%
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Al día
                      </span>
                    )}
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                    <div
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                    {project.isBehindSchedule && (
                      <div
                        className="shadow-none flex flex-col text-center whitespace-nowrap justify-center bg-amber-500/30 absolute top-1"
                        style={{ width: `${project.expectedProgress}%`, height: "0.5rem" }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}

        <div className="text-center text-sm text-muted-foreground pt-2">
          <p>Estas metas requieren tu atención inmediata para cumplir con los plazos establecidos</p>
        </div>
      </CardContent>
    </Card>
  )
}
