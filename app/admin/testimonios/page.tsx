"use client"

import { useState, useEffect } from "react"
import { getAllTestimonials, approveTestimonial, deleteTestimonial } from "@/lib/testimonial-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Trash2 } from "lucide-react"
import type { Testimonial } from "@/types/testimonial"
import Image from "next/image"

export default function TestimonialsAdminPage() {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function loadTestimonials() {
    setIsLoading(true)
    try {
      const data = await getAllTestimonials()
      setTestimonials(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los testimonios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleApprove(id: string) {
    try {
      await approveTestimonial(id)
      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ahora se mostrará en la página de inicio",
      })
      // Actualizar la lista
      setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, approved: true } : t)))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar este testimonio?")) {
      return
    }

    try {
      await deleteTestimonial(id)
      toast({
        title: "Testimonio eliminado",
        description: "El testimonio ha sido eliminado permanentemente",
      })
      // Actualizar la lista
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el testimonio",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Administración de Testimonios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.length === 0 ? (
          <p className="col-span-full text-center py-8 text-gray-500">No hay testimonios para mostrar</p>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={testimonial.approved ? "border-green-200" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                  <Badge variant={testimonial.approved ? "success" : "secondary"}>
                    {testimonial.approved ? "Aprobado" : "Pendiente"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  {testimonial.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="italic text-gray-600 dark:text-gray-300">"{testimonial.quote}"</p>
                <p className="text-xs text-gray-400 mt-2">
                  Creado: {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!testimonial.approved && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-green-600 border-green-600"
                    onClick={() => handleApprove(testimonial.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 ml-auto"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Button onClick={loadTestimonials}>Actualizar lista</Button>
      </div>
    </div>
  )
}
