import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  initialCapital: number
  currentBalance: number
  targetAmount: number
  progressPercentage: number
  startDate: string
}

interface ProjectListProps {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay proyectos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {projects.map((project) => (
        <Link key={project.id} href={`/proyectos/${project.id}`}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-700">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Capital inicial</p>
                  <p className="font-medium">{formatCurrency(project.initialCapital)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Saldo actual</p>
                  <p className="font-medium text-green-600">{formatCurrency(project.currentBalance)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progreso: {project.progressPercentage}%</span>
                  <span>Inicio: {formatDate(project.startDate)}</span>
                </div>
                <Progress value={project.progressPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
