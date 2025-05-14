import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/proyectos", "/estadisticas", "/perfil", "/ranking"]

// Rutas públicas (accesibles sin autenticación)
const publicRoutes = ["/", "/login", "/registro", "/recuperar-password", "/informacion"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Verificar si la ruta actual es una ruta protegida o una subruta de una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // Verificar si la ruta actual es una ruta pública
  const isPublicRoute = publicRoutes.some((route) => path === route)

  // Obtener el estado de autenticación de la cookie
  const authCookie = request.cookies.get("auth")?.value
  const isAuthenticated = authCookie === "true"

  // Si es una ruta protegida y el usuario no está autenticado, redirigir a login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", encodeURIComponent(path))
    return NextResponse.redirect(loginUrl)
  }

  // Si es una ruta de autenticación (login/registro) y el usuario ya está autenticado, redirigir al dashboard
  if ((path === "/login" || path === "/registro") && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get("redirect")
    const dashboardUrl = new URL(redirectTo ? decodeURIComponent(redirectTo) : "/dashboard", request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // En cualquier otro caso, continuar con la solicitud
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|sounds).*)",
  ],
}
