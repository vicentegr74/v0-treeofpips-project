import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/login", "/registro"]

  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname === route)

  // Obtener el token de autenticación de las cookies
  const authCookie = request.cookies.get("auth")
  const isAuthenticated = !!authCookie

  // Si no está autenticado y no es una ruta pública, redirigir a login
  if (
    !isAuthenticated &&
    !isPublicRoute &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si está autenticado y está intentando acceder a una ruta pública, redirigir al dashboard
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
