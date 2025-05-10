/// <reference lib="webworker" />

// Este archivo debe ser colocado en la carpeta 'public' como 'sw.js'
// Aquí solo mostramos el contenido que debería tener

const SW = self as unknown as ServiceWorkerGlobalScope

// Nombre de la caché
const CACHE_NAME = "trading-achievements-v1"

// Archivos a cachear inicialmente
const urlsToCache = [
  "/",
  "/proyectos",
  "/estadisticas",
  "/perfil",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
]

// Almacenamiento para notificaciones programadas
const scheduledNotifications = new Map()

// Instalar el Service Worker
SW.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché abierta")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activar el Service Worker
SW.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Estrategia de caché: Network first, fallback to cache
SW.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, clonarla y guardarla en caché
        if (event.request.method === "GET" && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Si falla la red, intentar desde caché
        return caches.match(event.request)
      }),
  )
})

// Sincronización en segundo plano
SW.addEventListener("sync", (event) => {
  if (event.tag === "sync-projects") {
    event.waitUntil(syncProjects())
  }
})

async function syncProjects() {
  // Aquí iría la lógica para sincronizar con un backend
  console.log("Sincronizando proyectos en segundo plano")
}

// Gestión de mensajes
SW.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    SW.skipWaiting()
  }

  // Programar notificación
  if (event.data && event.data.type === "SCHEDULE_NOTIFICATION") {
    const { id, hour, minute, title, body } = event.data.payload
    scheduleNotification(id, hour, minute, title, body)
  }

  // Cancelar notificación
  if (event.data && event.data.type === "CANCEL_NOTIFICATION") {
    const { id } = event.data.payload
    cancelNotification(id)
  }
})

// Función para programar notificaciones
function scheduleNotification(id, hour, minute, title, body) {
  // Cancelar notificación existente con el mismo ID
  cancelNotification(id)

  // Programar nueva notificación
  const checkAndNotify = () => {
    const now = new Date()
    if (now.getHours() === hour && now.getMinutes() === minute) {
      SW.registration.showNotification(title, {
        body,
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
        tag: id,
        actions: [
          {
            action: "open",
            title: "Abrir app",
          },
        ],
      })
    }
  }

  // Verificar cada minuto
  const intervalId = setInterval(checkAndNotify, 60 * 1000)
  scheduledNotifications.set(id, intervalId)
}

// Función para cancelar notificaciones
function cancelNotification(id) {
  const intervalId = scheduledNotifications.get(id)
  if (intervalId) {
    clearInterval(intervalId)
    scheduledNotifications.delete(id)
  }
}

// Gestionar clics en notificaciones
SW.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      SW.clients.matchAll({ type: "window" }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(SW.registration.scope) && "focus" in client) {
            return client.focus()
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (SW.clients.openWindow) {
          return SW.clients.openWindow("/")
        }
      }),
    )
  }
})
