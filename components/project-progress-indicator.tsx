"use client"

import { TrendingUp, TrendingDown, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface ProjectProgressIndicatorProps {
  startDate: string
  targetDate: string
  progressPercentage: number
}

export function ProjectProgressIndicator({ startDate, targetDate, progressPercentage }: ProjectProgressIndicatorProps) {
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

  useEffect(() => {
    // Calcular progreso esperado basado en tiempo transcurrido
    const today = new Date()
    const start = new Date(startDate)
    const target = new Date(targetDate)

    const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassed / totalDays) * 100)) : 0
    const progressDifference = progressPercentage - expectedProgress

    const isAhead = progressDifference > 0
    const isBehind = progressDifference < 0

    // Calcular días de ventaja o retraso
    const daysAheadOrBehind = totalDays > 0 ? Math.round((Math.abs(progressDifference) / 100) * totalDays) : 0

    setProgressStatus({
      isAhead,
      isBehind,
      expectedProgress,
      progressDifference,
      daysAheadOrBehind,
    })
  }, [startDate, targetDate, progressPercentage])

  return (
    <>
      {progressStatus.isAhead && (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
        >
          <TrendingUp className="h-3 w-3 mr-1" />
          {progressStatus.daysAheadOrBehind} {progressStatus.daysAheadOrBehind === 1 ? "día" : "días"} adelantado
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
          className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
        >
          <Clock className="h-3 w-3 mr-1" />
          En cronograma
        </Badge>
      )}
    </>
  )
}
