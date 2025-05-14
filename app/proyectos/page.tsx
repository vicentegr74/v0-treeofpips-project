"use client"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useProjects } from "@/context/projects-context"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { formatCurrency } from "@/lib/utils"
import { ProjectProgressIndicator } from "@/components/project-progress-indicator"

export default function ProjectsPage() {
  const router = useRouter()
  const { projects, completedProjects, deleteProject } = useProjects()
  const [searchTerm, setSearchTerm] = useState("")
  const { isOpen, itemToDelete, openConfirmation, closeConfirmation } = useDeleteConfirmation()
  const [sortBy, setSortBy] = useState<"default" | "ahead" | "behind">("default")

  // Filtrar proyectos por término de búsqueda
  const filteredActiveProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCompletedProjects = completedProjects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ordenar proyectos según el criterio seleccionado
  const sortedActiveProjects = [...filteredActiveProjects].sort((a, b) => {
    if (sortBy === "default") {
      return 0 // Mantener el orden original
    }

    // Calcular progreso esperado para ambos proyectos
    const calculateExpectedProgress = (project) => {
      const today = new Date()
      const startDate = new Date(project.startDate)
      const targetDate = new Date(project.targetDate)

      const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysPassed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

      const expectedProgress = totalDays > 0 ? Math.min(100, Math.round((daysPassed / totalDays) * 100)) : 0
      return project.progressPercentage - expectedProgress
    }

    const diffA = calculateExpectedProgress(a)
    const diffB = calculateExpectedProgress(b)

    if (sortBy === "ahead") {
      return diffB - diffA // Mayor diferencia positiva primero
    } else {
      return diffA - diffB // Mayor diferencia negativa primero
    }
  })

  const handleEditProject = (id: string) => {
    router.push(`/proyectos/${id}/editar`)
  }

  const handleDeleteClick = (id: string, title: string) => {
    openConfirmation(id, title)
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteProject(itemToDelete.id)
      toast({
        title: "Proyecto eliminado",
        description: `El proyecto "${itemToDelete.title}" ha sido eliminado correctamente.`,
        variant: "success",
      })
      closeConfirmation()
    }
  }

  // Corregir la función handleNewProject para que redirija a la ruta correcta
  const handleNewProject = () => {
    router.push("/proyectos/nuevo")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">Mis Proyectos</h1>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleNewProject}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar proyectos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="activos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="activos">Activos</TabsTrigger>
          <TabsTrigger value="completados">Completados</TabsTrigger>
        </TabsList>

        <TabsContent value="activos" className="mt-4">
          {/* Opciones de ordenamiento */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <Button
                variant={sortBy === "default" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("default")}
                className="rounded-l-md rounded-r-none"
              >
                Todos
              </Button>
              <Button
                variant={sortBy === "ahead" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("ahead")}
                className="rounded-none border-l-0 border-r-0"
              >
                Adelantados
              </Button>
              <Button
                variant={sortBy === "behind" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("behind")}
                className="rounded-r-md rounded-l-none"
              >
                Atrasados
              </Button>
            </div>
          </div>

          <AnimatePresence>
            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
              {sortedActiveProjects.length > 0 ? (
                sortedActiveProjects.map((project) => (
                  <motion.div key={project.id} variants={item} layout>
                    <div className="relative group">
                      <Link href={`/proyectos/${project.id}`} className="block">
                        <div className="p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-green-700">{project.title}</h3>
                              <div className="mt-1">
                                <ProjectProgressIndicator
                                  startDate={project.startDate}
                                  targetDate={project.targetDate}
                                  progressPercentage={project.progressPercentage}
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEditProject(project.id)
                                }}
                              >
                                <span className="sr-only">Editar</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteClick(project.id, project.title)
                                }}
                              >
                                <span className="sr-only">Eliminar</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Capital inicial</p>
                              <p className="font-medium">{formatCurrency(project.initialCapital)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Saldo actual</p>
                              <p className="font-medium text-green-600">{formatCurrency(project.currentBalance)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Objetivo</p>
                              <p className="font-medium">{formatCurrency(project.targetAmount)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                              <p className="font-medium capitalize">{project.type}</p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progreso: {project.progressPercentage}%</span>
                              <span>
                                {formatDate(project.startDate)} → {formatDate(project.targetDate)}
                              </span>
                            </div>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                              <Progress value={project.progressPercentage} className="h-2" />
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={item} className="text-center py-10">
                  <p className="text-muted-foreground">No hay proyectos activos para mostrar</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="completados" className="mt-4">
          <AnimatePresence>
            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
              {filteredCompletedProjects.length > 0 ? (
                filteredCompletedProjects.map((project) => (
                  <motion.div key={project.id} variants={item} layout>
                    <div className="relative group">
                      <Link href={`/proyectos/${project.id}`} className="block">
                        <div className="p-4 border rounded-lg hover:bg-muted/10 transition-colors">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-medium text-green-700">{project.title}</h3>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEditProject(project.id)
                                }}
                              >
                                <span className="sr-only">Editar</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                  <path d="m15 5 4 4" />
                                </svg>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteClick(project.id, project.title)
                                }}
                              >
                                <span className="sr-only">Eliminar</span>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Capital inicial</p>
                              <p className="font-medium">{formatCurrency(project.initialCapital)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Saldo final</p>
                              <p className="font-medium text-green-600">{formatCurrency(project.currentBalance)}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Ganancia</p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(project.currentBalance - project.initialCapital)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">Tipo</p>
                              <p className="font-medium capitalize">{project.type}</p>
                            </div>
                          </div>

                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Completado: 100%</span>
                              <span>
                                {formatDate(project.startDate)} → {formatDate(project.targetDate)}
                              </span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={item} className="text-center py-10">
                  <p className="text-muted-foreground">No hay proyectos completados para mostrar</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

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
    </motion.div>
  )
}
