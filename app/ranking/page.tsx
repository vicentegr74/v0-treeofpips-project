"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useProjects } from "@/context/projects-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Award, Trophy, Medal, Star, Users, Calendar, Target, CheckCircle, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"

// Tipos para el ranking
interface RankingUser {
  id: string
  name: string
  email: string
  avatarUrl?: string
  level: {
    name: string
    color: string
    icon: string
  }
  totalPoints: number
  metrics: {
    goalCompletion: number
    consistency: number
    milestones: number
    completedProjects: number
    communityParticipation: number
  }
  badges: {
    name: string
    description: string
    icon: string
    color: string
  }[]
  rank: number
  streak: number
  completedProjects: number
  specialAchievements: string[]
}

// Datos de ejemplo para el ranking
const mockRankingData: RankingUser[] = [
  {
    id: "1",
    name: "Ana Martínez",
    email: "ana@example.com",
    avatarUrl: "/professional-woman-portrait.png",
    level: {
      name: "Árbol Maduro",
      color: "bg-green-600",
      icon: "🌳",
    },
    totalPoints: 78,
    metrics: {
      goalCompletion: 27,
      consistency: 22,
      milestones: 16,
      completedProjects: 9,
      communityParticipation: 4,
    },
    badges: [
      {
        name: "Maestro de la Constancia",
        description: "Mantiene una racha de actividad de más de 30 días",
        icon: "calendar",
        color: "bg-blue-500",
      },
      {
        name: "Completador Experto",
        description: "Ha completado más de 5 proyectos al 100%",
        icon: "check-circle",
        color: "bg-purple-500",
      },
    ],
    rank: 1,
    streak: 45,
    completedProjects: 7,
    specialAchievements: ["Mejor racha del mes", "Mayor crecimiento semanal"],
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    avatarUrl: "/professional-man-portrait.png",
    level: {
      name: "Árbol Joven",
      color: "bg-green-500",
      icon: "🌱",
    },
    totalPoints: 58,
    metrics: {
      goalCompletion: 20,
      consistency: 15,
      milestones: 12,
      completedProjects: 8,
      communityParticipation: 3,
    },
    badges: [
      {
        name: "Visionario de Metas",
        description: "Establece y cumple metas desafiantes",
        icon: "target",
        color: "bg-amber-500",
      },
    ],
    rank: 2,
    streak: 22,
    completedProjects: 4,
    specialAchievements: ["Cumplimiento perfecto de hitos"],
  },
  {
    id: "3",
    name: "Laura Sánchez",
    email: "laura@example.com",
    avatarUrl: "/young-professional-woman.png",
    level: {
      name: "Árbol Centenario",
      color: "bg-green-700",
      icon: "🌲",
    },
    totalPoints: 85,
    metrics: {
      goalCompletion: 28,
      consistency: 23,
      milestones: 17,
      completedProjects: 10,
      communityParticipation: 7,
    },
    badges: [
      {
        name: "Mentor del Bosque",
        description: "Gran contribución a la comunidad",
        icon: "users",
        color: "bg-teal-500",
      },
      {
        name: "Crecimiento Equilibrado",
        description: "Puntuación equilibrada en todas las métricas",
        icon: "trending-up",
        color: "bg-indigo-500",
      },
    ],
    rank: 3,
    streak: 38,
    completedProjects: 9,
    specialAchievements: ["Mayor contribución comunitaria", "Trader del mes"],
  },
]

// Función para determinar el nivel basado en los puntos
const determineLevel = (points: number) => {
  if (points >= 96) return { name: "Árbol Legendario", color: "bg-green-800", icon: "🌳" }
  if (points >= 81) return { name: "Árbol Centenario", color: "bg-green-700", icon: "🌲" }
  if (points >= 61) return { name: "Árbol Maduro", color: "bg-green-600", icon: "🌳" }
  if (points >= 41) return { name: "Árbol Joven", color: "bg-green-500", icon: "🌱" }
  if (points >= 21) return { name: "Brote Emergente", color: "bg-green-400", icon: "🌱" }
  return { name: "Semilla Prometedora", color: "bg-green-300", icon: "🌰" }
}

// Componente para mostrar un badge
const UserBadge = ({ badge }: { badge: RankingUser["badges"][0] }) => {
  const icons = {
    calendar: <Calendar className="h-3 w-3" />,
    "check-circle": <CheckCircle className="h-3 w-3" />,
    target: <Target className="h-3 w-3" />,
    users: <Users className="h-3 w-3" />,
    "trending-up": <TrendingUp className="h-3 w-3" />,
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${badge.color} text-white flex items-center gap-1 cursor-help`}>
            {icons[badge.icon as keyof typeof icons]}
            {badge.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{badge.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Componente para la tarjeta de usuario en el ranking
const UserRankCard = ({ user, isCurrentUser }: { user: RankingUser; isCurrentUser: boolean }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={`mb-4 overflow-hidden ${isCurrentUser ? "border-green-500 dark:border-green-400 border-2" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-green-100 dark:border-green-900">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {user.rank <= 3 && (
                  <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5 text-white">
                    {user.rank === 1 && <Trophy className="h-4 w-4" />}
                    {user.rank === 2 && <Medal className="h-4 w-4" />}
                    {user.rank === 3 && <Award className="h-4 w-4" />}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  {isCurrentUser && (
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Tú
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm flex items-center gap-1 mt-0.5">
                  <span className="text-lg mr-1">{user.level.icon}</span>
                  {user.level.name}
                </CardDescription>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{user.totalPoints}</div>
              <div className="text-xs text-muted-foreground">puntos</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 mb-3">
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Metas</div>
              <div className="font-semibold text-green-600 dark:text-green-400">{user.metrics.goalCompletion}/30</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Constancia</div>
              <div className="font-semibold text-green-600 dark:text-green-400">{user.metrics.consistency}/25</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Hitos</div>
              <div className="font-semibold text-green-600 dark:text-green-400">{user.metrics.milestones}/20</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Proyectos</div>
              <div className="font-semibold text-green-600 dark:text-green-400">
                {user.metrics.completedProjects}/15
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground">Comunidad</div>
              <div className="font-semibold text-green-600 dark:text-green-400">
                {user.metrics.communityParticipation}/10
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {user.badges.map((badge, index) => (
              <UserBadge key={index} badge={badge} />
            ))}
          </div>

          {user.specialAchievements.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium">Logros especiales:</span> {user.specialAchievements.join(", ")}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Componente para mostrar las estadísticas del usuario actual
const CurrentUserStats = ({ user }: { user: RankingUser }) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-green-700 dark:text-green-400 flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-500" />
          Tu Progreso en el Bosque
        </CardTitle>
        <CardDescription>
          Nivel actual: <span className="font-medium">{user.level.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">{user.totalPoints} puntos</span>
            <span className="text-sm text-muted-foreground">
              {user.totalPoints < 20
                ? "Próximo nivel: Brote Emergente (21)"
                : user.totalPoints < 40
                  ? "Próximo nivel: Árbol Joven (41)"
                  : user.totalPoints < 60
                    ? "Próximo nivel: Árbol Maduro (61)"
                    : user.totalPoints < 80
                      ? "Próximo nivel: Árbol Centenario (81)"
                      : user.totalPoints < 95
                        ? "Próximo nivel: Árbol Legendario (96)"
                        : "¡Nivel máximo alcanzado!"}
            </span>
          </div>
          <Progress value={user.totalPoints} max={100} className="h-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <Calendar className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <div className="text-xl font-bold text-green-700 dark:text-green-400">{user.streak}</div>
            <div className="text-xs text-muted-foreground">Días de racha</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <div className="text-xl font-bold text-green-700 dark:text-green-400">{user.completedProjects}</div>
            <div className="text-xs text-muted-foreground">Proyectos completados</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-green-600 dark:text-green-400" />
            <div className="text-xl font-bold text-green-700 dark:text-green-400">
              {Math.round((user.metrics.goalCompletion / 30) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Cumplimiento de metas</div>
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-2">Desglose de puntos:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li className="flex justify-between">
              <span>Cumplimiento de metas:</span>
              <span className="font-medium text-foreground">{user.metrics.goalCompletion} / 30 pts</span>
            </li>
            <li className="flex justify-between">
              <span>Consistencia de crecimiento:</span>
              <span className="font-medium text-foreground">{user.metrics.consistency} / 25 pts</span>
            </li>
            <li className="flex justify-between">
              <span>Logro de hitos:</span>
              <span className="font-medium text-foreground">{user.metrics.milestones} / 20 pts</span>
            </li>
            <li className="flex justify-between">
              <span>Proyectos completados:</span>
              <span className="font-medium text-foreground">{user.metrics.completedProjects} / 15 pts</span>
            </li>
            <li className="flex justify-between">
              <span>Participación comunitaria:</span>
              <span className="font-medium text-foreground">{user.metrics.communityParticipation} / 10 pts</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para mostrar las categorías especializadas
const SpecializedCategories = () => {
  const categories = [
    {
      title: "Maestros de la Constancia",
      description: "Usuarios con las mejores rachas de actividad",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      users: [
        { name: "Ana Martínez", value: "45 días" },
        { name: "Laura Sánchez", value: "38 días" },
        { name: "Miguel Torres", value: "32 días" },
      ],
    },
    {
      title: "Visionarios de Metas",
      description: "Usuarios que establecen y cumplen metas desafiantes",
      icon: <Target className="h-5 w-5 text-amber-500" />,
      users: [
        { name: "Laura Sánchez", value: "93%" },
        { name: "Ana Martínez", value: "90%" },
        { name: "Carlos Rodríguez", value: "85%" },
      ],
    },
    {
      title: "Completadores Expertos",
      description: "Usuarios con más proyectos completados al 100%",
      icon: <CheckCircle className="h-5 w-5 text-purple-500" />,
      users: [
        { name: "Laura Sánchez", value: "9 proyectos" },
        { name: "Ana Martínez", value: "7 proyectos" },
        { name: "David López", value: "6 proyectos" },
      ],
    },
    {
      title: "Mentores del Bosque",
      description: "Usuarios con mayor contribución comunitaria",
      icon: <Users className="h-5 w-5 text-teal-500" />,
      users: [
        { name: "Laura Sánchez", value: "7/10 pts" },
        { name: "Elena Gómez", value: "6/10 pts" },
        { name: "Ana Martínez", value: "4/10 pts" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {categories.map((category, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {category.icon}
              {category.title}
            </CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {category.users.map((user, userIndex) => (
                <li key={userIndex} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {userIndex === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                    {userIndex === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                    {userIndex === 2 && <Award className="h-4 w-4 text-amber-700" />}
                    <span>{user.name}</span>
                  </div>
                  <span className="font-medium">{user.value}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Componente para mostrar información sobre cómo se calcula el ranking
const RankingInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-green-700 dark:text-green-400">
          ¿Cómo funciona el Bosque de Excelencia?
        </CardTitle>
        <CardDescription>
          Nuestro sistema de ranking celebra el crecimiento constante y natural en tus proyectos de trading
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Métricas de evaluación</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Target className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Índice de Cumplimiento de Metas (30 pts)</span>
                <p className="text-muted-foreground">Mide qué tan bien cumples con las metas que estableciste.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Consistencia de Crecimiento (25 pts)</span>
                <p className="text-muted-foreground">Evalúa la regularidad con la que registras progreso.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Logro de Hitos (20 pts)</span>
                <p className="text-muted-foreground">Mide cuántos hitos has alcanzado a tiempo o antes.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Proyectos Completados (15 pts)</span>
                <p className="text-muted-foreground">Número de proyectos llevados al 100% de cumplimiento.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Users className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Participación Comunitaria (10 pts)</span>
                <p className="text-muted-foreground">Evalúa tu contribución a la comunidad de Tree of Pips.</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Niveles de Maestría</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌰</span> Semilla Prometedora
              </div>
              <div className="text-muted-foreground">0-20 puntos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌱</span> Brote Emergente
              </div>
              <div className="text-muted-foreground">21-40 puntos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌱</span> Árbol Joven
              </div>
              <div className="text-muted-foreground">41-60 puntos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌳</span> Árbol Maduro
              </div>
              <div className="text-muted-foreground">61-80 puntos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌲</span> Árbol Centenario
              </div>
              <div className="text-muted-foreground">81-95 puntos</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <div className="font-medium flex items-center gap-1">
                <span>🌳</span> Árbol Legendario
              </div>
              <div className="text-muted-foreground">96-100 puntos</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            El ranking se actualiza semanalmente. Recuerda que el objetivo principal es tu crecimiento personal y el
            respeto a tus propias metas, no la competencia con otros usuarios.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente principal de la página de ranking
export default function RankingPage() {
  const { user } = useAuth()
  const { projects, completedProjects, getStreak } = useProjects()
  const [rankingData, setRankingData] = useState<RankingUser[]>([])
  const [currentUserData, setCurrentUserData] = useState<RankingUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Simular la carga de datos de ranking
  useEffect(() => {
    // En una implementación real, aquí cargaríamos los datos desde Firebase
    setTimeout(() => {
      setRankingData(mockRankingData)

      // Simular datos del usuario actual
      if (user) {
        const mockCurrentUser: RankingUser = {
          id: user.uid,
          name: user.nombre || user.email.split("@")[0],
          email: user.email,
          avatarUrl: user.photoURL || "/young-professional-man.png",
          level: determineLevel(58),
          totalPoints: 58,
          metrics: {
            goalCompletion: 20,
            consistency: 15,
            milestones: 12,
            completedProjects: 8,
            communityParticipation: 3,
          },
          badges: [
            {
              name: "Visionario de Metas",
              description: "Establece y cumple metas desafiantes",
              icon: "target",
              color: "bg-amber-500",
            },
          ],
          rank: 4,
          streak: getStreak(),
          completedProjects: completedProjects.length,
          specialAchievements: [],
        }

        setCurrentUserData(mockCurrentUser)
      }

      setLoading(false)
    }, 1000)
  }, [user, completedProjects, getStreak])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            <div className="mt-8 text-muted-foreground">Cargando el Bosque de Excelencia...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-400 mb-2">Bosque de Excelencia</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Celebramos a los traders que mantienen un crecimiento constante y natural, respetando sus metas y cultivando
          buenos hábitos.
        </p>
      </motion.div>

      <Tabs defaultValue="ranking" className="mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="ranking">Ranking General</TabsTrigger>
          <TabsTrigger value="categories">Categorías Especiales</TabsTrigger>
          <TabsTrigger value="info">¿Cómo Funciona?</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="space-y-6">
          {currentUserData && <CurrentUserStats user={currentUserData} />}

          <div className="mb-4">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">Top Traders</h2>
            {rankingData.map((rankUser) => (
              <UserRankCard
                key={rankUser.id}
                user={rankUser}
                isCurrentUser={currentUserData ? rankUser.id === currentUserData.id : false}
              />
            ))}

            {/* Si el usuario actual no está en el top, mostrar su tarjeta al final */}
            {currentUserData && !rankingData.some((u) => u.id === currentUserData.id) && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200 dark:border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">Tu posición</span>
                  </div>
                </div>
                <UserRankCard user={currentUserData} isCurrentUser={true} />
              </>
            )}
          </div>

          <div className="text-center">
            <Button variant="outline" className="text-green-700 border-green-200">
              Ver ranking completo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <SpecializedCategories />
        </TabsContent>

        <TabsContent value="info">
          <RankingInfo />
        </TabsContent>
      </Tabs>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Recuerda que el verdadero éxito está en tu crecimiento personal y en el respeto a tus propias metas.
        </p>
        <Link href="/dashboard">
          <Button variant="default" className="bg-green-700 hover:bg-green-800">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
