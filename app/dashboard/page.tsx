"use client"

import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { MotivationalQuote } from "@/components/motivational-quote"
import { useProjects } from "@/context/projects-context"
import { InstallPrompt } from "@/components/install-prompt"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { AppHeader } from "@/components/app-header"

export default function Dashboard() {
  const { projects, deleteProject, updateProjectProgress } = useProjects()
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleNewProject = () => {
    router.push("/proyectos/crear")
  }

  return (
    <div className="space-y-6">
      <AppHeader />
      <InstallPrompt />

      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">Bienvenido a Tree of Pips</h1>
          <p className="text-green-700 dark:text-green-300 max-w-lg mt-2">
            Visualiza tu crecimiento en el trading, establece metas y florece como trader profesional.
          </p>
          <div className="flex gap-3 mt-4">
            <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={handleNewProject}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
            {user && (
              <Button variant="outline" onClick={logout} className="border-green-200 text-green-700">
                Cerrar sesión
              </Button>
            )}
          </div>
        </div>

        {user && (
          <div className="text-sm text-green-600 dark:text-green-400 mt-4">Hola, {user.nombre || user.email}</div>
        )}

        <ProgressDashboard />

        <MotivationalQuote />

        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400 mt-8 mb-4">Tus Proyectos</h2>

        <div className="grid gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={deleteProject}
              onUpdateProgress={updateProjectProgress}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-green-100 dark:border-green-900">
            <h3 className="text-lg font-medium">No tienes proyectos activos</h3>
            <p className="text-muted-foreground mt-1">Comienza creando tu primer proyecto de trading</p>
            <Button className="bg-green-700 hover:bg-green-800 mt-4" onClick={handleNewProject}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear mi primer proyecto
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
