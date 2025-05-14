"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChevronDown, Target, BarChart3, Bell, Leaf, LineChart, Smartphone, type LucideIcon } from "lucide-react"
import { getApprovedTestimonials } from "@/lib/testimonial-service"
import type { Testimonial } from "@/types/testimonial"

// Definir interfaces para nuestros componentes
interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  image?: string
}

interface FAQItemProps {
  question: string
  answer: string
}

// Componente para las características
const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
    whileHover={{ y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
    </div>
    <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-400">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
)

// Componente para los testimonios
const TestimonialCard = ({ quote, author, role, image }: TestimonialCardProps) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    <div className="flex items-center mb-4">
      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
        <Image src={image || "/placeholder.svg"} alt={author} fill className="object-contain" />
      </div>
      <div>
        <h4 className="font-medium text-green-800 dark:text-green-400">{author}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
    <p className="italic text-gray-600 dark:text-gray-300">"{quote}"</p>
  </motion.div>
)

// Componente para las preguntas frecuentes
const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <button className="flex justify-between items-center w-full text-left" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="text-lg font-medium text-green-800 dark:text-green-400">{question}</h3>
        <ChevronDown
          className={`h-5 w-5 text-green-600 dark:text-green-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 text-gray-600 dark:text-gray-300"
        >
          {answer}
        </motion.div>
      )}
    </div>
  )
}

export default function LandingPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
  }, [])

  // Frases célebres de traders reconocidos
  const quotes = [
    {
      text: "El trading no se trata de tener razón o estar equivocado; se trata de ganar dinero.",
      author: "Bill Lipschutz",
    },
    {
      text: "Los mercados pueden mantener su irracionalidad más tiempo del que tú puedes mantener tu solvencia.",
      author: "John Maynard Keynes",
    },
    {
      text: "El riesgo viene de no saber lo que estás haciendo.",
      author: "Warren Buffett",
    },
    {
      text: "La paciencia es la clave para el éxito en el trading.",
      author: "Jesse Livermore",
    },
  ]

  // Seleccionar una frase aleatoria
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]

  // Datos para las características
  const features = [
    {
      icon: Leaf,
      title: "Visualización de Crecimiento",
      description: "Observa cómo tu árbol crece con cada logro financiero que alcanzas en tu camino.",
    },
    {
      icon: Target,
      title: "Metas Personalizadas",
      description: "Establece objetivos financieros realistas y sigue tu progreso de manera visual e intuitiva.",
    },
    {
      icon: LineChart,
      title: "Análisis de Rendimiento",
      description: "Obtén estadísticas detalladas sobre tu desempeño y mejora tus estrategias de trading.",
    },
    {
      icon: Bell,
      title: "Recordatorios Inteligentes",
      description: "Recibe notificaciones personalizadas para mantener el enfoque en tus objetivos financieros.",
    },
    {
      icon: BarChart3,
      title: "Seguimiento de Progreso",
      description: "Monitorea tu avance diario y visualiza tu camino hacia el éxito financiero.",
    },
    {
      icon: Smartphone,
      title: "Acceso Móvil",
      description: "Gestiona tus proyectos desde cualquier lugar con nuestra aplicación optimizada para móviles.",
    },
  ]

  // Datos para las preguntas frecuentes
  const faqs = [
    {
      question: "¿Cómo funciona Tree of Pips?",
      answer:
        "Tree of Pips te permite visualizar tu progreso financiero como un árbol que crece. Estableces metas, registras tus operaciones y observas cómo tu árbol florece con cada logro. La aplicación te proporciona estadísticas, recordatorios y herramientas para mantener el enfoque en tus objetivos.",
    },
    {
      question: "¿Es gratuita la aplicación?",
      answer:
        "Ofrecemos una versión básica gratuita que incluye las funcionalidades esenciales. También disponemos de planes premium con características avanzadas como análisis detallado, más proyectos simultáneos y sincronización con plataformas de trading.",
    },
    {
      question: "¿Necesito conocimientos avanzados de trading?",
      answer:
        "No, Tree of Pips está diseñada para traders de todos los niveles. La interfaz es intuitiva y fácil de usar, y proporcionamos recursos educativos para ayudarte a mejorar tus habilidades de trading.",
    },
    {
      question: "¿Puedo usar la aplicación sin conexión a internet?",
      answer:
        "Sí, Tree of Pips funciona como una Progressive Web App (PWA), lo que significa que puedes instalarla en tu dispositivo y usarla sin conexión. Tus datos se sincronizarán cuando vuelvas a conectarte.",
    },
    {
      question: "¿Cómo protegen mis datos financieros?",
      answer:
        "Tu privacidad y seguridad son nuestra prioridad. Utilizamos encriptación de extremo a extremo y seguimos las mejores prácticas de seguridad para proteger tus datos. Además, nunca compartimos tu información con terceros sin tu consentimiento explícito.",
    },
  ]

  // Efecto para cambiar automáticamente los testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % (testimonials.length || 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  // Función para desplazarse suavemente a una sección
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Efecto para cargar testimonios
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const loadedTestimonials = await getApprovedTestimonials()

        // Si no hay testimonios aprobados, usar testimonios de ejemplo
        if (loadedTestimonials.length === 0) {
          setTestimonials([
            {
              id: "1",
              quote:
                "Tree of Pips transformó mi enfoque del trading. Ahora puedo visualizar mi progreso y mantenerme motivado incluso en los días difíciles.",
              author: "Carlos Rodríguez",
              role: "Trader independiente",
              image: "/professional-man-portrait.png",
              approved: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: "2",
              quote:
                "La visualización del árbol me ayuda a mantener la perspectiva a largo plazo. Es una herramienta indispensable para mi disciplina diaria.",
              author: "Laura Martínez",
              role: "Inversora particular",
              image: "/professional-woman-portrait.png",
              approved: true,
              createdAt: new Date().toISOString(),
            },
            {
              id: "3",
              quote:
                "Gracias a esta aplicación he podido establecer metas realistas y ver cómo crecen mis inversiones día a día.",
              author: "Miguel Sánchez",
              role: "Trader de forex",
              image: "/young-professional-man.png",
              approved: true,
              createdAt: new Date().toISOString(),
            },
          ])
        } else {
          setTestimonials(loadedTestimonials)
        }

        setIsLoadingTestimonials(false)
      } catch (error) {
        console.error("Error al cargar testimonios:", error)
        setIsLoadingTestimonials(false)
      }
    }

    loadTestimonials()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center md:text-left space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold text-green-800 dark:text-green-400 leading-tight">
                El árbol de los <span className="text-green-600 dark:text-green-300">Logros del Trading</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl">
                Visualiza tu crecimiento financiero como un árbol que florece con cada operación exitosa. Establece
                metas, registra tu progreso y celebra tus logros.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/registro">
                  <Button className="bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 h-auto rounded-full w-full sm:w-auto">
                    Empieza ahora
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30 text-lg px-8 py-6 h-auto rounded-full"
                  onClick={() => scrollToSection("features")}
                >
                  Conoce más
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative h-80 md:h-96 w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {mounted && (
                <Image
                  src={
                    theme === "dark"
                      ? "/images/treeofpips-comienza-ya-oscuro.png"
                      : "/images/treeofpips-comienza-ya-claro.png"
                  }
                  alt="Tree of Pips"
                  fill
                  className="object-contain"
                  priority
                />
              )}
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.button
              onClick={() => scrollToSection("features")}
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              className="text-green-600 dark:text-green-400"
            >
              <ChevronDown className="h-8 w-8" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-green-100 dark:bg-green-900/20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.blockquote
            className="text-xl md:text-2xl italic text-center text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            "{randomQuote.text}"
            <footer className="text-right font-medium mt-4 text-green-700 dark:text-green-400">
              — {randomQuote.author}
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Características principales
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Descubre cómo Tree of Pips puede ayudarte a visualizar y alcanzar tus metas financieras
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Lo que dicen nuestros usuarios
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Descubre cómo Tree of Pips está ayudando a traders de todo el mundo
            </motion.p>
          </div>

          {isLoadingTestimonials ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <TestimonialCard {...testimonial} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 px-4 bg-green-50 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Preguntas frecuentes
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Respuestas a las preguntas más comunes sobre Tree of Pips
            </motion.p>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FAQItem {...faq} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-green-800 dark:text-green-400 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Comienza tu viaje hacia el éxito financiero
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Únete a miles de traders que ya están visualizando su progreso y alcanzando sus metas financieras con Tree
            of Pips.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/registro">
              <Button className="bg-green-700 hover:bg-green-800 text-white text-lg px-8 py-6 h-auto rounded-full w-full sm:w-auto">
                Crear cuenta gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-900/30 text-lg px-8 py-6 h-auto rounded-full"
              >
                Iniciar sesión
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
