"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitTestimonial } from "@/lib/testimonial-service"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function TestimonialForm({ userName = "", onClose }: { userName?: string; onClose?: () => void }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    author: userName || "",
    role: "",
    quote: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.author || !formData.role || !formData.quote) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await submitTestimonial({
        author: formData.author,
        role: formData.role,
        quote: formData.quote,
        approved: false, // Por defecto, los testimonios no están aprobados
        createdAt: new Date().toISOString(),
      })

      toast({
        title: "¡Gracias por tu testimonio!",
        description: "Tu testimonio ha sido enviado y será revisado por nuestro equipo.",
      })

      // Mostrar confirmación
      setIsSubmitted(true)

      // Limpiar formulario después de 3 segundos si no se cierra
      if (!onClose) {
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({
            author: userName || "",
            role: "",
            quote: "",
          })
        }, 5000)
      }
    } catch (error) {
      console.error("Error al enviar testimonio:", error)
      toast({
        title: "Error",
        description: "No se pudo enviar tu testimonio. Por favor intenta de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center space-y-3"
          >
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto" />
            <h3 className="text-xl font-medium text-green-800 dark:text-green-300">¡Testimonio enviado!</h3>
            <p className="text-green-700 dark:text-green-400">
              Tu testimonio ha sido recibido y está pendiente de aprobación. ¡Gracias por compartir tu experiencia!
            </p>
            {onClose && (
              <Button onClick={onClose} className="mt-4">
                Cerrar
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="quote">Tu experiencia con Tree of Pips</Label>
              <Textarea
                id="quote"
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                placeholder="Cuéntanos cómo Tree of Pips te ha ayudado..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="author">Tu nombre</Label>
              <Input
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Nombre completo"
                className="mt-1"
                disabled={!!userName}
              />
            </div>

            <div>
              <Label htmlFor="role">Tu ocupación</Label>
              <Input
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Ej: Trader independiente, Inversor particular..."
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar testimonio"}
            </Button>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Tu testimonio será revisado antes de ser publicado en nuestra página.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
