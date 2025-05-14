"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function RankingWidget() {
  const { user } = useAuth()

  // Datos de ejemplo para el ranking
  const topUsers = [
    {
      id: "1",
      name: "Ana Martínez",
      level: "Árbol Maduro",
      points: 78,
      avatar: "/professional-woman-portrait.png",
    },
    {
      id: "2",
      name: "Laura Sánchez",
      level: "Árbol Centenario",
      points: 85,
      avatar: "",
    },
    {
      id: "3",
      name: "Carlos Rodríguez",
      level: "Árbol Joven",
      points: 58,
      avatar: "/professional-man-portrait.png",
    },
  ]

  // Datos del usuario actual
  const currentUser = {
    id: user?.uid || "current",
    name: user?.displayName || "Tú",
    level: "Árbol Joven",
    points: 58,
    position: 4,
    avatar: user?.photoURL || "",
  }

  // Función para obtener el emoji según el nivel
  const getLevelEmoji = (level: string) => {
    switch (level) {
      case "Semilla":
        return "🌱"
      case "Brote":
        return "🌿"
      case "Árbol Joven":
        return "🌲"
      case "Árbol Maduro":
        return "🌳"
      case "Árbol Centenario":
        return "🌴"
      case "Bosque Ancestral":
        return "🌲🌳🌴"
      default:
        return "🌱"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <Trophy className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-400">Bosque de Excelencia</h2>
      </div>

      <div className="space-y-3 flex-grow">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-900/30"
          >
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 font-medium text-sm mr-2">
                {index + 1}
              </div>
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm flex items-center">
                  {user.name} <span className="ml-1 text-xs">{getLevelEmoji(user.level)}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user.level}</p>
              </div>
            </div>
            <span className="font-bold text-green-600 dark:text-green-400">{user.points} pts</span>
          </div>
        ))}
      </div>

      {/* Separador */}
      <div className="my-3 border-t border-dashed border-green-200 dark:border-green-800"></div>

      {/* Usuario actual */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-green-100 dark:bg-green-800/50">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 font-medium text-sm mr-2">
            {currentUser.position}
          </div>
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm flex items-center">
              {currentUser.name} <span className="ml-1 text-xs">{getLevelEmoji(currentUser.level)}</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.level}</p>
          </div>
        </div>
        <span className="font-bold text-green-600 dark:text-green-400">{currentUser.points} pts</span>
      </div>

      {/* Enlace para ver el ranking completo */}
      <Link
        href="/ranking"
        className="mt-4 flex items-center justify-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
      >
        Ver ranking completo <ChevronRight className="h-4 w-4 ml-1" />
      </Link>
    </div>
  )
}
