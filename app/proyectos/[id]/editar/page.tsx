import EditProjectClientPage from "./EditProjectClientPage"

// Importar la función generateStaticParams correctamente
import { generateStaticParams } from "../generateStaticParams"

// Exportar la función para que Next.js la utilice
export { generateStaticParams }

export default function EditProjectPage() {
  return <EditProjectClientPage />
}
