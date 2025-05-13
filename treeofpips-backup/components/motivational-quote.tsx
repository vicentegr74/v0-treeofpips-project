"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const quotes = [
  "El trading no se trata de tener razón, sino de hacer dinero.",
  "La paciencia es una virtud que paga dividendos en el trading.",
  "El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.",
  "No es sobre cuánto ganas, sino cuánto conservas.",
  "La disciplina es el puente entre metas y logros.",
  "El trading es 10% inspiración y 90% transpiración.",
  "Invierte en ti mismo. Tu carrera es el motor de tu riqueza.",
  "El mercado recompensa la paciencia, no la impaciencia.",
  "El éxito en el trading es como un árbol: crece lentamente pero con raíces fuertes.",
  "No busques el momento perfecto, haz del momento algo perfecto.",
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }, [])

  return (
    <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30">
      <CardContent className="p-4 flex items-start">
        <Quote className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-green-800 dark:text-green-300 italic">{quote}</p>
      </CardContent>
    </Card>
  )
}
