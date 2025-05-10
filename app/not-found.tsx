export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-green-700 dark:text-green-400">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">Página no encontrada</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Lo sentimos, la página que estás buscando no existe.</p>
      <a href="/" className="mt-6 px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors">
        Volver al inicio
      </a>
    </div>
  )
}