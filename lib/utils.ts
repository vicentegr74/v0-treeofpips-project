import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un valor monetario como una cadena con formato de moneda
 */
export function formatCurrency(amount: number | string | undefined, showSymbol = true): string {
  if (amount === undefined || amount === null) return showSymbol ? "$0.00" : "0.00"

  const numAmount = typeof amount === "string" ? Number.parseFloat(amount) : amount

  if (isNaN(numAmount)) return showSymbol ? "$0.00" : "0.00"

  return showSymbol
    ? `$${numAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : numAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Formatea un valor que puede ser número o cadena para mostrar un número fijo de decimales
 */
export function formatNumberValue(value: any, decimals = 2): string {
  if (value === undefined || value === null) return "0"

  if (typeof value === "number") {
    return value.toFixed(decimals)
  }

  // Si es una cadena que representa un número, convertirla
  if (typeof value === "string" && !isNaN(Number.parseFloat(value))) {
    return Number.parseFloat(value).toFixed(decimals)
  }

  // En cualquier otro caso, devolver como cadena
  return String(value)
}

/**
 * Formatea una fecha como una cadena legible
 */
export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return ""

  const date = typeof dateString === "string" ? new Date(dateString) : dateString

  if (isNaN(date.getTime())) return ""

  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * Calcula el porcentaje de progreso
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0
  const progress = (current / target) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * Genera un ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
