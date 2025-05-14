"use client"

import { useProjects } from "@/context/projects-context"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"

export function ProgressDashboard() {
  const { projects } = useProjects()
  const [progressStats, setProgressStats] = useState({
    onTrack: 0,
    needsAttention: 0,
    completed: 0,
    total: 0,
  })

  useEffect(() => {
    // Calcular estadísticas de progreso
    const stats = projects.reduce(
      (acc, project) => {
        acc.total++

        if (project.completed) {
          acc.completed++
        } else if (project.progress >= 70) {
          acc.onTrack++
        } else {
          acc.needsAttention++
        }

        return acc
      },
      { onTrack: 0, needsAttention: 0, completed: 0, total: 0 },
    )

    setProgressStats(stats)
  }, [projects])

  // Calcular porcentajes para la visualización
  const completionRate = progressStats.total > 0 ? Math.round((progressStats.completed / progressStats.total) * 100) : 0

  const onTrackRate = progressStats.total > 0 ? Math.round((progressStats.onTrack / progressStats.total) * 100) : 0

  return (
    <div className="space-y-4">
      {progressStats.total === 0 ? (
        <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">No hay proyectos activos</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Crea tu primer proyecto para ver tu progreso</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Ritmo acelerado</div>
              <div className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {progressStats.onTrack}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">proyectos</span>
              </div>
              <Progress value={onTrackRate} className="h-2 mt-2" indicatorClassName="bg-green-500 dark:bg-green-400" />
            </div>

            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500 dark:text-gray-400">Necesitan atención</div>
              <div className="mt-1 text-2xl font-bold text-amber-500">
                {progressStats.needsAttention}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">proyectos</span>
              </div>
              <Progress
                value={progressStats.needsAttention > 0 ? 100 : 0}
                className="h-2 mt-2"
                indicatorClassName="bg-amber-500"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Tasa de finalización</div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">{completionRate}%</div>
            </div>
            <Progress value={completionRate} className="h-2 mt-2" indicatorClassName="bg-green-600 dark:bg-green-500" />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {progressStats.completed} de {progressStats.total} proyectos completados
            </div>
          </div>
        </>
      )}
    </div>
  )
}
