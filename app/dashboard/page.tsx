"use client"
import { useProjects } from "@/context/projects-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { RankingWidget } from "@/components/ranking-widget"
import { AppHeader } from "@/components/app-header"
import { ProjectSuggestions } from "@/components/project-suggestions"
import { DataMigrationPrompt } from "@/components/data-migration-prompt"

export default function Dashboard() {
  const { projects, deleteProject, updateProjectProgress } = useProjects()
  const { user } = useAuth()
  const router = useRouter()

  const handleNewProject = () => {
    router.push("/proyectos/nuevo")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Mostrar el prompt de migración si hay un usuario autenticado */}
        <DataMigrationPrompt />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProgressDashboard />
            <ProjectSuggestions
              dailyGoalNeeded={10}
              averageDailyProgress={8.5}
              daysActive={14}
              daysRemaining={30}
              progressPercentage={35}
            />
          </div>
          <div>
            <RankingWidget />
          </div>
        </div>
      </main>
    </div>
  )
}
