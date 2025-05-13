import { redirect } from "next/navigation"

export default function NuevoProyectoRedirect() {
  // Esta página simplemente redirige a la ruta correcta
  redirect("/proyectos/crear")
}
