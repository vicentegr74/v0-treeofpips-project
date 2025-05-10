"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Implementación simplificada del Label para evitar problemas con @radix-ui/react-label
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement> & { variant?: "default" }>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className,
        )}
        {...props}
      >
        {children}
      </label>
    )
  },
)
Label.displayName = "Label"

export { Label }
