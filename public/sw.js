// Este archivo es una copia del contenido de app/service-worker.ts
// pero adaptado para funcionar directamente como un service worker

// Nombre de la caché
const CACHE_NAME = "tree-of-pips-v1"

// Archivos a cachear inicialmente
const urlsToCache = [
  "/",
  "/proyectos",
  "/estadisticas",
  "/perfil",
  "/manifest.json",
  "/images/treeofpips-logo-cuadrado-claro.png",
  "/images/treeofpips-logo-cuadrado-oscuro.png",
]

// Almacenamiento para notificaciones programadas
const scheduledNotifications = new Map()

// Instalar el Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caché abierta")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activar el Service Worker
self.addEventListener("activate", (event) => {
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
self.addEventListener("fetch", (event) => {
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
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-projects") {
    event.waitUntil(syncProjects())
  }
})

async function syncProjects() {
  // Aquí iría la lógica para sincronizar con un backend
  console.log("Sincronizando proyectos en segundo plano")
}

// Gestión de mensajes
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
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
      self.registration.showNotification(title, {
        body,
        icon: "/images/treeofpips-logo-cuadrado-claro.png",
        badge: "/images/treeofpips-logo-cuadrado-claro.png",
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
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        // Si ya hay una ventana abierta, enfocarla
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && "focus" in client) {
            return client.focus()
          }
        }
        // Si no hay ventana abierta, abrir una nueva
        if (self.clients.openWindow) {
          return self.clients.openWindow("/")
        }
      }),
    )
  }
})
