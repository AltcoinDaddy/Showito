"use client"

import { TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    label: "Total Value",
    value: "2,456.78 FLOW",
    usd: "$12,345.67",
    change: "+18.5%",
  },
  {
    label: "Total NFTs",
    value: "127",
    change: "+5",
  },
  {
    label: "Collections",
    value: "12",
    change: "+2",
  },
  {
    label: "Avg. Hold Time",
    value: "45 days",
    change: "+3 days",
  },
]

export function PortfolioStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="space-y-1">
              <p className="text-2xl font-bold font-mono">{stat.value}</p>
              {stat.usd && <p className="text-sm text-muted-foreground font-mono">{stat.usd}</p>}
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-foreground">
              <TrendingUp className="h-4 w-4" />
              {stat.change}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
