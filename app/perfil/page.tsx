"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Edit, Medal, MessageSquare, Trophy, User, Info } from "lucide-react"
import { NotificationSettings } from "@/components/notification-settings"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { TestimonialForm } from "@/components/testimonial-form"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false)
  const [editedUser, setEditedUser] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  // Datos de gamificación (estos seguirían siendo ficticios por ahora)
  const userGameData = {
    level: 3,
    levelName: "Árbol Joven",
    xp: 2750,
    nextLevelXp: 5000,
    completedProjects: 7,
    achievements: [
      {
        id: "1",
        title: "Primer Logro",
        description: "Completaste tu primer proyecto de trading",
        icon: Trophy,
        date: "2023-01-15",
      },
      {
        id: "2",
        title: "5 Logros Alcanzados",
        description: "Has completado 5 proyectos de trading",
        icon: Award,
        date: "2023-03-22",
      },
      {
        id: "3",
        title: "Racha de 3",
        description: "3 logros consecutivos sin abandonar",
        icon: Medal,
        date: "2023-04-10",
      },
    ],
    badges: [
      { id: "1", name: "Semilla", achieved: true },
      { id: "2", name: "Brote", achieved: true },
      { id: "3", name: "Árbol Joven", achieved: true },
      { id: "4", name: "Árbol Floreciente", achieved: false },
      { id: "5", name: "Bosque de Logros", achieved: false },
    ],
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

  const handleSaveProfile = () => {
    try {
      // Obtener el usuario actual del localStorage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const currentUser = JSON.parse(storedUser)

        // Actualizar los datos del usuario
        const updatedUser = {
          ...currentUser,
          nombre: editedUser.nombre,
          email: editedUser.email,
        }

        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        toast({
          title: "Perfil actualizado",
          description: "Tus datos han sido actualizados correctamente.",
          variant: "success",
        })

        // Recargar la página para reflejar los cambios
        window.location.reload()
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }

    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <User className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-medium">No has iniciado sesión</h2>
        <p className="text-muted-foreground">Inicia sesión para ver tu perfil</p>
        <Button asChild>
          <a href="/login">Iniciar sesión</a>
        </Button>
      </div>
    )
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-700">Mi Perfil</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={editedUser.nombre}
                  onChange={(e) => setEditedUser({ ...editedUser, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile} className="w-full">
                Guardar cambios
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-[1fr_2fr] gap-6">
        <motion.div variants={item} initial="hidden" animate="show">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={editedUser.avatar || "/placeholder.svg"} alt={user.nombre || "Usuario"} />
                <AvatarFallback>{user.nombre ? user.nombre.charAt(0) : user.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.nombre || "Usuario"}</h2>
              <p className="text-sm text-muted-foreground mb-4">{user.email}</p>

              {/* Añadir la insignia de nivel aquí */}
              <div className="mt-2 flex items-center gap-1">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1">
                  <span className="text-lg">🌱</span>
                  <span>Árbol Joven</span>
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">Información sobre nivel</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tu nivel actual en el Bosque de Excelencia</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="w-full space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Nivel {userGameData.level}: {userGameData.levelName}
                  </span>
                  <span>
                    {userGameData.xp}/{userGameData.nextLevelXp} XP
                  </span>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Progress value={(userGameData.xp / userGameData.nextLevelXp) * 100} className="h-2" />
                </motion.div>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full text-center">
                <motion.div
                  className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-green-700">{userGameData.completedProjects}</p>
                  <p className="text-xs text-muted-foreground">Proyectos Completados</p>
                </motion.div>
                <motion.div
                  className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <p className="text-2xl font-bold text-green-700">{userGameData.achievements.length}</p>
                  <p className="text-xs text-muted-foreground">Logros Desbloqueados</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <Tabs defaultValue="achievements">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="achievements">Logros</TabsTrigger>
              <TabsTrigger value="badges">Niveles</TabsTrigger>
              <TabsTrigger value="testimonial">Testimonio</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements" className="mt-4 space-y-4">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                {userGameData.achievements.map((achievement) => (
                  <motion.div key={achievement.id} variants={item}>
                    <Card>
                      <CardContent className="p-4 flex items-center">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                          <achievement.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Conseguido el {new Date(achievement.date).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
            <TabsContent value="badges" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Niveles de Trader</CardTitle>
                  <CardDescription>Tu progreso en el camino del trading</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                    {userGameData.badges.map((badge) => (
                      <motion.div
                        key={badge.id}
                        variants={item}
                        className={`p-4 rounded-lg flex items-center ${
                          badge.achieved ? "bg-green-50 dark:bg-green-900/20" : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center mr-4 ${
                            badge.achieved ? "bg-green-100 dark:bg-green-800" : "bg-muted"
                          }`}
                        >
                          <span className="text-sm font-bold">{badge.id}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{badge.name}</h3>
                          <p className="text-xs">{badge.achieved ? "Nivel desbloqueado" : "Nivel bloqueado"}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="testimonial" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comparte tu experiencia</CardTitle>
                  <CardDescription>Cuéntanos cómo Tree of Pips te ha ayudado en tu camino como trader</CardDescription>
                </CardHeader>
                <CardContent>
                  <TestimonialForm userName={user.nombre || ""} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <NotificationSettings />

          <Dialog open={isTestimonialOpen} onOpenChange={setIsTestimonialOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Compartir mi experiencia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Comparte tu experiencia con Tree of Pips</DialogTitle>
              </DialogHeader>
              <TestimonialForm userName={user.nombre || ""} onClose={() => setIsTestimonialOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  )
}
