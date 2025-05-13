"use client"

import type * as React from "react"
import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value: Date
  onChange: (time: Date) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
  // Formatear la hora para el input
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // Manejar cambios en el input
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value
    if (timeString) {
      const [hours, minutes] = timeString.split(":").map(Number)
      const newDate = new Date(value)
      newDate.setHours(hours, minutes, 0, 0)
      onChange(newDate)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="grid gap-1.5">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input id="time" type="time" value={formatTime(value)} onChange={handleTimeChange} className="w-[120px]" />
        </div>
      </div>
    </div>
  )
}
