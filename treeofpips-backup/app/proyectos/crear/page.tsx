"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calculator, Calendar, Info } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjects } from "@/context/projects-context"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

export default function NewProjectPage() {
  const router = useRouter()
  const { addProject } = useProjects()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    initialCapital: "",
    targetAmount: "",
    targetDate: "",
    goalFrequency: "daily",
    goalAmount: "",
    type: "forex",
  })

  const [suggestedDate, setSuggestedDate] = useState<string | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate suggested completion date based on goals
  useEffect(() => {
    if (
      formData.targetAmount &&
      formData.goalAmount &&
      formData.goalFrequency &&
      !isNaN(Number(formData.targetAmount)) &&
      !isNaN(Number(formData.goalAmount)) &&
      Number(formData.goalAmount) > 0
    ) {
      const targetAmount = Number(formData.targetAmount)
      const goalAmount = Number(formData.goalAmount)

      let workingDaysNeeded = 0

      switch (formData.goalFrequency) {
        case "daily":
          workingDaysNeeded = Math.ceil(targetAmount / goalAmount)
          break
        case "weekly":
          // For weekly goals, we consider a 5-day work week
          workingDaysNeeded = Math.ceil((targetAmount / goalAmount) * 5)
          break
        case "monthly":
          // For monthly goals, we consider approximately 22 working days per month
          workingDaysNeeded = Math.ceil((targetAmount / goalAmount) * 22)
          break
      }

      // Calculate the suggested date considering only working days
      const suggestedDate = addWorkingDays(new Date(), workingDaysNeeded)

      // Format the date as YYYY-MM-DD for the input field
      const suggestedDateStr = suggestedDate.toISOString().split("T")[0]
      setSuggestedDate(suggestedDateStr)
    } else {
      setSuggestedDate(null)
    }
  }, [formData.targetAmount, formData.goalAmount, formData.goalFrequency])

  // Add this helper function to calculate working days
  function addWorkingDays(startDate, daysToAdd) {
    const endDate = new Date(startDate)
    let daysAdded = 0

    while (daysAdded < daysToAdd) {
      // Move to the next day
      endDate.setDate(endDate.getDate() + 1)

      // Check if it's a weekday (0 = Sunday, 6 = Saturday)
      const dayOfWeek = endDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        daysAdded++
      }
    }

    return endDate
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateSuggestedDate = () => {
    setIsCalculating(true)

    // Simulate calculation with a small delay for UX
    setTimeout(() => {
      if (suggestedDate) {
        setFormData((prev) => ({
          ...prev,
          targetDate: suggestedDate,
        }))

        toast({
          title: "Fecha calculada",
          description: `Se ha establecido la fecha sugerida: ${formatDate(suggestedDate)} (considerando solo días laborables)`,
        })
      } else {
        toast({
          title: "No se pudo calcular",
          description: "Por favor, completa los campos de objetivo y meta para calcular una fecha sugerida.",
          variant: "destructive",
        })
      }
      setIsCalculating(false)
    }, 600)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar datos
      if (!formData.title.trim()) {
        throw new Error("El título es obligatorio")
      }

      if (!formData.description.trim()) {
        throw new Error("La descripción es obligatoria")
      }

      if (isNaN(Number(formData.initialCapital)) || Number(formData.initialCapital) <= 0) {
        throw new Error("El capital inicial debe ser un número positivo")
      }

      if (isNaN(Number(formData.targetAmount)) || Number(formData.targetAmount) <= 0) {
        throw new Error("El objetivo a alcanzar debe ser un número positivo")
      }

      if (!formData.targetDate) {
        throw new Error("La fecha objetivo es obligatoria")
      }

      if (isNaN(Number(formData.goalAmount)) || Number(formData.goalAmount) <= 0) {
        throw new Error("La cantidad de meta debe ser un número positivo")
      }

      // Convertir explícitamente los valores a números
      const initialCapital = Number(formData.initialCapital)
      const targetAmount = Number(formData.targetAmount)
      const goalAmount = Number(formData.goalAmount)

      // Create new project
      addProject({
        title: formData.title,
        description: formData.description,
        initialCapital: initialCapital,
        currentBalance: initialCapital, // El saldo inicial debe ser igual al capital inicial
        targetAmount: targetAmount,
        startDate: new Date().toISOString().split("T")[0],
        targetDate: formData.targetDate,
        goalFrequency: formData.goalFrequency,
        goalAmount: goalAmount,
        type: formData.type,
      })

      // Mostrar mensaje de éxito
      toast({
        title: "Proyecto creado",
        description: "Tu nuevo proyecto ha sido creado exitosamente",
      })

      // Redirect to projects page
      router.push("/proyectos")
    } catch (error) {
      // Mostrar error
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-2">
        <Link href="/proyectos">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-green-700">Nuevo Proyecto</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Proyecto</CardTitle>
          <CardDescription>Crea un nuevo proyecto para seguir tus metas de trading</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título del Proyecto</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Inversión en Forex"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe brevemente tu proyecto de trading"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="initialCapital">Capital Inicial ($)</Label>
                  <Input
                    id="initialCapital"
                    name="initialCapital"
                    type="number"
                    placeholder="1000"
                    value={formData.initialCapital}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="targetAmount">Objetivo a Alcanzar ($)</Label>
                  <Input
                    id="targetAmount"
                    name="targetAmount"
                    type="number"
                    placeholder="500"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo de Mercado</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forex">Forex</SelectItem>
                      <SelectItem value="criptomonedas">Criptomonedas</SelectItem>
                      <SelectItem value="acciones">Acciones</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="targetDate">Fecha Estimada de Finalización</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              calculateSuggestedDate()
                            }}
                            disabled={isCalculating || !suggestedDate}
                          >
                            {isCalculating ? (
                              <span className="flex items-center">
                                <Calculator className="h-3 w-3 mr-1 animate-spin" />
                                Calculando...
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Calculator className="h-3 w-3 mr-1" />
                                Usar sugerida
                              </span>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Calcular fecha basada en tus metas (excluye fines de semana)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="targetDate"
                      name="targetDate"
                      type="date"
                      value={formData.targetDate}
                      onChange={handleChange}
                      required
                      className="pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {suggestedDate && (
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Info className="h-3 w-3 mr-1" />
                      <span>Fecha sugerida (solo días laborables): </span>
                      <Badge variant="outline" className="ml-1 text-xs font-normal">
                        {formatDate(suggestedDate)}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="goalFrequency">Frecuencia de Meta</Label>
                  <Select
                    name="goalFrequency"
                    value={formData.goalFrequency}
                    onValueChange={(value) => handleSelectChange("goalFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diaria</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="goalAmount">
                    Cantidad de Meta (
                    {formData.goalFrequency === "daily"
                      ? "Diaria"
                      : formData.goalFrequency === "weekly"
                        ? "Semanal"
                        : "Mensual"}
                    )
                  </Label>
                  <Input
                    id="goalAmount"
                    name="goalAmount"
                    type="number"
                    placeholder="50"
                    value={formData.goalAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Link href="/proyectos">
                <Button variant="outline">Cancelar</Button>
              </Link>
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear Proyecto"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
