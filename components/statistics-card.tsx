import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatisticsCardProps {
  title: string
  value: string | number
  icon?: ReactNode
}

export function StatisticsCard({ title, value, icon }: StatisticsCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          {icon && <div className="p-2 bg-muted rounded-full">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
