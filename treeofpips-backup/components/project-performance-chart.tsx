"use client"

import { useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  type: string
}

interface ProjectPerformanceChartProps {
  data: any[]
  selectedProjects: string[]
  availableProjects: Project[]
  colors: string[]
}

export function ProjectPerformanceChart({
  data,
  selectedProjects,
  availableProjects,
  colors,
}: ProjectPerformanceChartProps) {
  const [metric, setMetric] = useState<"balance" | "roi">("balance")

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-muted-foreground">No hay datos disponibles para los proyectos seleccionados</p>
      </div>
    )
  }

  // Get selected project details
  const selectedProjectDetails = availableProjects
    .filter((p) => selectedProjects.includes(p.id))
    .map((p, index) => ({
      ...p,
      color: colors[index % colors.length],
    }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={metric} onValueChange={(value) => setMetric(value as "balance" | "roi")} className="w-auto">
          <TabsList>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="roi">ROI</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          {selectedProjectDetails.map((project) => (
            <Badge key={project.id} variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: project.color }} />
              {project.title}
            </Badge>
          ))}
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                if (!date) return ""
                try {
                  const d = new Date(date)
                  return `${d.getDate()}/${d.getMonth() + 1}`
                } catch (e) {
                  return ""
                }
              }}
            />
            <YAxis
              tickFormatter={(value) => {
                if (typeof value !== "number") return ""
                return metric === "balance" ? `$${Math.round(value / 1000)}k` : `${value.toFixed(0)}%`
              }}
            />
            <Tooltip />
            <Legend />
            {metric === "balance" ? (
              <>
                {selectedProjects.map((projectId, index) => (
                  <Line
                    key={projectId}
                    type="monotone"
                    dataKey={`balance_${projectId}`}
                    name={availableProjects.find((p) => p.id === projectId)?.title || projectId}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
                <ReferenceLine y={0} stroke="#666" />
              </>
            ) : (
              <>
                {selectedProjects.map((projectId, index) => (
                  <Line
                    key={projectId}
                    type="monotone"
                    dataKey={`roi_${projectId}`}
                    name={availableProjects.find((p) => p.id === projectId)?.title || projectId}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ))}
                <ReferenceLine y={0} stroke="#666" />
              </>
            )}
            <Brush dataKey="date" height={30} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
