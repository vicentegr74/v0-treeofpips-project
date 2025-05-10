"use client"

import { X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Project {
  id: string
  title: string
  type: string
}

interface StatisticsFilterPanelProps {
  availableProjects: Project[]
  selectedProjects: string[]
  setSelectedProjects: (projects: string[]) => void
  filterType: string[]
  setFilterType: (types: string[]) => void
  onClose: () => void
}

export function StatisticsFilterPanel({
  availableProjects,
  selectedProjects,
  setSelectedProjects,
  filterType,
  setFilterType,
  onClose,
}: StatisticsFilterPanelProps) {
  const projectTypes = ["forex", "criptomonedas", "acciones", "otros"]

  const handleProjectToggle = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
    } else {
      setSelectedProjects([...selectedProjects, projectId])
    }
  }

  const handleTypeToggle = (type: string) => {
    if (filterType.includes(type)) {
      setFilterType(filterType.filter((t) => t !== type))
    } else {
      setFilterType([...filterType, type])
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Filtros</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Proyectos</h3>
            <div className="space-y-2">
              {availableProjects.map((project) => (
                <div key={project.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`project-${project.id}`}
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => handleProjectToggle(project.id)}
                  />
                  <label
                    htmlFor={`project-${project.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                  >
                    {project.title}
                    <Badge variant="outline" className="ml-2 capitalize">
                      {project.type}
                    </Badge>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Tipo de Mercado</h3>
            <div className="space-y-2">
              {projectTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={filterType.includes(type)}
                    onCheckedChange={() => handleTypeToggle(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
