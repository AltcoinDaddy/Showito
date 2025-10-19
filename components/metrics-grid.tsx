"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const metrics = [
  {
    label: "Total Volume (24h)",
    value: "1,234.56 FLOW",
    change: "+12.5%",
    trend: "up" as const,
  },
  {
    label: "Total Sales (24h)",
    value: "8,432",
    change: "+8.2%",
    trend: "up" as const,
  },
  {
    label: "Active Collections",
    value: "156",
    change: "+3",
    trend: "up" as const,
  },
  {
    label: "Avg. Sale Price",
    value: "0.146 FLOW",
    change: "-2.1%",
    trend: "down" as const,
  },
]

export function MetricsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-2xl font-bold font-mono">{metric.value}</p>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  metric.trend === "up" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {metric.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {metric.change}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
