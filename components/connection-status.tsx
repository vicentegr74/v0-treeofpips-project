"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) {
    return (
      <Badge
        variant="outline"
        className="fixed bottom-4 right-4 bg-green-50 text-green-700 border-green-200 flex items-center gap-1 z-50"
      >
        <Wifi className="h-3 w-3" />
        Conectado
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="fixed bottom-4 right-4 bg-red-50 text-red-700 border-red-200 flex items-center gap-1 z-50"
    >
      <WifiOff className="h-3 w-3" />
      Sin conexión
    </Badge>
  )
}
