// Función para solicitar permisos de notificaciones
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }

  return false
}

// Función para programar una notificación diaria
export async function scheduleNotification(
  hour: number,
  minute: number,
  title: string,
  body: string,
): Promise<boolean> {
  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return false

  // Registrar la notificación en el service worker
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SCHEDULE_NOTIFICATION",
      payload: {
        hour,
        minute,
        title,
        body,
        id: `daily-reminder-${hour}-${minute}`,
      },
    })
    return true
  }

  return false
}

// Función para enviar una notificación inmediata
export async function sendNotification(title: string, body: string, icon?: string): Promise<boolean> {
  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return false

  try {
    const notification = new Notification(title, {
      body,
      icon: icon || "/icons/icon-192x192.png",
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return true
  } catch (error) {
    console.error("Error al enviar notificación:", error)
    return false
  }
}

// Función para cancelar una notificación programada
export function cancelScheduledNotification(id: string): void {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CANCEL_NOTIFICATION",
      payload: { id },
    })
  }
}
