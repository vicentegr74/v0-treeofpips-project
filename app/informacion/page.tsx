"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Footer } from "@/components/footer"
import { AppHeader } from "@/components/app-header"
import {
  ChevronRight,
  Leaf,
  LineChart,
  Target,
  Bell,
  BarChart3,
  Smartphone,
  Quote,
  Star,
  CheckCircle,
  type LucideIcon,
} from "lucide-react"

// Definir la interfaz para las props de FeatureCard
interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

// Componente para las características
const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="mb-4 rounded-full bg-primary/10 p-2 w-12 h-12 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
)

// Componente para los testimonios
interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
}

const TestimonialCard = ({ quote, author, role, rating }: TestimonialCardProps) => (
  <Card className="border-none shadow-md">
    <CardContent className="p-6">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
      </div>
      <div className="mb-4">
        <Quote className="h-8 w-8 text-primary/20" />
      </div>
      <p className="mb-4 text-muted-foreground italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </CardContent>
  </Card>
)

// Componente para los planes de precios
interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

const PricingCard = ({ title, price, description, features, popular = false }: PricingCardProps) => (
  <Card className={`border ${popular ? "border-primary" : ""} relative`}>
    {popular && (
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <Badge className="bg-primary hover:bg-primary">Más Popular</Badge>
      </div>
    )}
    <CardContent className={`p-6 ${popular ? "pt-8" : "pt-6"}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Gratis" && <span className="text-muted-foreground">/mes</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className={`w-full ${popular ? "bg-primary hover:bg-primary/90" : ""}`}>
        Comenzar {popular ? "Ahora" : ""}
      </Button>
    </CardContent>
  </Card>
)

// Componente para las preguntas frecuentes
interface FAQItemProps {
  question: string
  answer: string
}

const FAQItem = ({ question, answer }: FAQItemProps) => (
  <div className="py-4 border-b">
    <h4 className="text-lg font-semibold mb-2">{question}</h4>
    <p className="text-muted-foreground">{answer}</p>
  </div>
)

export default function InformationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transforma tu Trading con <span className="text-primary">Tree of Pips</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                La plataforma que te ayuda a crecer como trader, establecer metas claras y seguir tu progreso con
                visualizaciones intuitivas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Comenzar Gratis
                </Button>
                <Button size="lg" variant="outline">
                  Ver Demo
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <img
                src="/tree-growth-app-dashboard.png"
                alt="Tree of Pips Dashboard"
                className="rounded-lg shadow-xl max-w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Características Principales</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Diseñado específicamente para traders que buscan mejorar su disciplina y resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Target}
                title="Establece Metas Claras"
                description="Define objetivos diarios, semanales y mensuales para mantener tu trading enfocado y disciplinado."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={LineChart}
                title="Seguimiento Visual"
                description="Visualiza tu progreso con gráficos intuitivos que muestran tu evolución como trader."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Leaf}
                title="Crecimiento Progresivo"
                description="Ve cómo tu árbol de trading crece con cada meta alcanzada, motivándote a seguir mejorando."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Bell}
                title="Recordatorios Personalizados"
                description="Recibe notificaciones para mantener tu disciplina y no perder de vista tus objetivos."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={BarChart3}
                title="Estadísticas Detalladas"
                description="Analiza tu rendimiento con métricas avanzadas para identificar fortalezas y áreas de mejora."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon={Smartphone}
                title="Acceso Móvil"
                description="Accede a tu progreso desde cualquier dispositivo, incluso sin conexión a internet."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cómo Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un proceso simple para transformar tu enfoque de trading en resultados consistentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Crea tu Proyecto</h3>
              <p className="text-muted-foreground">
                Define tus objetivos de trading, estrategia y métricas de seguimiento.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Registra tu Progreso</h3>
              <p className="text-muted-foreground">
                Actualiza diariamente tus resultados y observa cómo crece tu árbol.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analiza y Mejora</h3>
              <p className="text-muted-foreground">
                Utiliza las estadísticas para refinar tu estrategia y mejorar tus resultados.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Button className="bg-primary hover:bg-primary/90">
              Comenzar Ahora <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/30 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo Que Dicen Nuestros Usuarios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Traders como tú que han transformado sus resultados con Tree of Pips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                quote="Tree of Pips ha transformado mi enfoque del trading. Ahora tengo metas claras y puedo ver mi progreso día a día."
                author="Carlos Rodríguez"
                role="Day Trader"
                rating={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                quote="La visualización del árbol me motiva a mantener la disciplina. He mejorado mi win rate en un 15% desde que empecé a usar la app."
                author="Laura Martínez"
                role="Swing Trader"
                rating={5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <TestimonialCard
                quote="Las estadísticas me han ayudado a identificar patrones en mi trading que no había notado antes. Increíble herramienta."
                author="Miguel Sánchez"
                role="Scalper"
                rating={4}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Planes Simples y Transparentes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades de trading.
            </p>
          </div>

          <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="annual">Anual (20% descuento)</TabsTrigger>
            </TabsList>

            <TabsContent value="monthly" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PricingCard
                  title="Básico"
                  price="Gratis"
                  description="Perfecto para comenzar tu viaje de trading disciplinado."
                  features={[
                    "Hasta 2 proyectos activos",
                    "Seguimiento de metas diarias",
                    "Visualización básica del árbol",
                    "Estadísticas esenciales",
                  ]}
                />

                <PricingCard
                  title="Pro"
                  price="9,99€"
                  description="Para traders comprometidos que buscan mejorar constantemente."
                  features={[
                    "Proyectos ilimitados",
                    "Metas diarias, semanales y mensuales",
                    "Árbol con animaciones avanzadas",
                    "Estadísticas detalladas",
                    "Notificaciones personalizadas",
                  ]}
                  popular={true}
                />

                <PricingCard
                  title="Elite"
                  price="19,99€"
                  description="La experiencia completa para traders profesionales."
                  features={[
                    "Todo lo del plan Pro",
                    "Análisis avanzado de rendimiento",
                    "Exportación de datos",
                    "Integración con plataformas de trading",
                    "Soporte prioritario",
                  ]}
                />
              </div>
            </TabsContent>

            <TabsContent value="annual" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PricingCard
                  title="Básico"
                  price="Gratis"
                  description="Perfecto para comenzar tu viaje de trading disciplinado."
                  features={[
                    "Hasta 2 proyectos activos",
                    "Seguimiento de metas diarias",
                    "Visualización básica del árbol",
                    "Estadísticas esenciales",
                  ]}
                />

                <PricingCard
                  title="Pro"
                  price="95,90€"
                  description="Para traders comprometidos que buscan mejorar constantemente."
                  features={[
                    "Proyectos ilimitados",
                    "Metas diarias, semanales y mensuales",
                    "Árbol con animaciones avanzadas",
                    "Estadísticas detalladas",
                    "Notificaciones personalizadas",
                  ]}
                  popular={true}
                />

                <PricingCard
                  title="Elite"
                  price="191,90€"
                  description="La experiencia completa para traders profesionales."
                  features={[
                    "Todo lo del plan Pro",
                    "Análisis avanzado de rendimiento",
                    "Exportación de datos",
                    "Integración con plataformas de trading",
                    "Soporte prioritario",
                  ]}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">¿Tienes preguntas sobre nuestros planes?</p>
            <Button variant="outline">Contacta con Nosotros</Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-xl text-muted-foreground">Respuestas a las preguntas más comunes sobre Tree of Pips.</p>
          </div>

          <div className="space-y-1">
            <FAQItem
              question="¿Qué hace diferente a Tree of Pips de otras aplicaciones de trading?"
              answer="Tree of Pips se enfoca específicamente en la disciplina y el crecimiento progresivo del trader, utilizando visualizaciones motivadoras como el árbol que crece con tu progreso. No es solo un diario de trading, sino una herramienta completa para desarrollar hábitos consistentes."
            />

            <FAQItem
              question="¿Puedo usar Tree of Pips sin conexión a internet?"
              answer="Sí, Tree of Pips funciona como una Progressive Web App (PWA) que puedes instalar en tu dispositivo y usar sin conexión. Tus datos se sincronizarán automáticamente cuando vuelvas a conectarte."
            />

            <FAQItem
              question="¿Cómo se calculan las estadísticas de rendimiento?"
              answer="Las estadísticas se calculan basándose en los datos que ingresas en tus proyectos de trading. Incluyen métricas como ROI, win rate, drawdown máximo, y otras medidas importantes para evaluar tu rendimiento."
            />

            <FAQItem
              question="¿Puedo cambiar de plan en cualquier momento?"
              answer="Sí, puedes actualizar o cambiar tu plan en cualquier momento. Si actualizas a un plan superior, solo pagarás la diferencia proporcional al tiempo restante de tu suscripción actual."
            />

            <FAQItem
              question="¿Ofrecen reembolsos si no estoy satisfecho?"
              answer="Sí, ofrecemos una garantía de devolución de 14 días. Si no estás completamente satisfecho con tu suscripción de pago, puedes solicitar un reembolso completo dentro de los primeros 14 días."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Comienza Tu Viaje de Crecimiento Hoy</h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de traders que están transformando sus resultados con Tree of Pips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Registrarse Gratis
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="lg" variant="outline" className="border-primary-foreground">
                    Ver Demo
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explora todas las funciones sin registrarte</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
