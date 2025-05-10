"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff } from "lucide-react"
import { requestNotificationPermission, scheduleNotification, cancelScheduledNotification } from "@/lib/notifications"
import { TimePickerDemo } from "@/components/time-picker"

export function NotificationSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [reminderTime, setReminderTime] = useState<Date>(() => {
    // Por defecto, 8:00 PM
    const date = new Date()
    date.setHours(20, 0, 0, 0)
    return date
  })

  // Verificar el estado de los permisos al cargar
  useEffect(() => {
    const checkPermission = async () => {
      if ("Notification" in window) {
        const isGranted = Notification.permission === "granted"
        setPermissionGranted(isGranted)

        // Recuperar configuración guardada
        const savedSettings = localStorage.getItem("notificationSettings")
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          setNotificationsEnabled(settings.enabled)

          if (settings.time) {
            const [hours, minutes] = settings.time.split(":").map(Number)
            const date = new Date()
            date.setHours(hours, minutes, 0, 0)
            setReminderTime(date)
          }
        }
      }
    }

    checkPermission()
  }, [])

  // Guardar configuración cuando cambia
  useEffect(() => {
    const saveSettings = () => {
      const settings = {
        enabled: notificationsEnabled,
        time: `${reminderTime.getHours()}:${reminderTime.getMinutes()}`,
      }
      localStorage.setItem("notificationSettings", JSON.stringify(settings))
    }

    if (permissionGranted) {
      saveSettings()
    }
  }, [notificationsEnabled, reminderTime, permissionGranted])

  // Programar o cancelar notificaciones cuando cambia la configuración
  useEffect(() => {
    const updateNotification = async () => {
      if (notificationsEnabled && permissionGranted) {
        await scheduleNotification(
          reminderTime.getHours(),
          reminderTime.getMinutes(),
          "Recordatorio de Trading",
          "¡No olvides actualizar tu progreso diario y alimentar tu árbol de logros!",
        )
      } else {
        cancelScheduledNotification("daily-reminder")
      }
    }

    if (permissionGranted) {
      updateNotification()
    }
  }, [notificationsEnabled, reminderTime, permissionGranted])

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setPermissionGranted(granted)
    if (granted) {
      setNotificationsEnabled(true)
    }
  }

  const handleToggleNotifications = async (enabled: boolean) => {
    if (enabled && !permissionGranted) {
      await handleRequestPermission()
    } else {
      setNotificationsEnabled(enabled)
    }
  }

  const handleTimeChange = (time: Date) => {
    setReminderTime(time)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
        <CardDescription>Configura recordatorios para mantener tu progreso diario</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
            <Label htmlFor="notifications" className="font-medium">
              Recordatorios diarios
            </Label>
          </div>
          <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={handleToggleNotifications} />
        </div>

        {notificationsEnabled && (
          <div className="space-y-2">
            <Label htmlFor="time">Hora del recordatorio</Label>
            <TimePickerDemo value={reminderTime} onChange={handleTimeChange} />
            <p className="text-sm text-muted-foreground mt-2">
              Recibirás una notificación diaria a esta hora para recordarte actualizar tu progreso.
            </p>
          </div>
        )}

        {!permissionGranted && (
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Necesitamos tu permiso para enviar notificaciones. Haz clic en el botón para activarlas.
            </p>
            <Button
              onClick={handleRequestPermission}
              variant="outline"
              className="mt-2 border-amber-300 dark:border-amber-700"
            >
              <Bell className="h-4 w-4 mr-2" />
              Permitir notificaciones
            </Button>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>Las notificaciones te ayudarán a mantener tu racha de progreso y alcanzar tus metas más rápido.</p>
        </div>
      </CardContent>
    </Card>
  )
}
