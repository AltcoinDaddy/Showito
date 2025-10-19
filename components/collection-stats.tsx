"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const stats = [
  {
    label: "Floor Price",
    value: "2.5 FLOW",
    usd: "$12.50",
    change: "+8.2%",
    trend: "up" as const,
  },
  {
    label: "Volume (24h)",
    value: "456.78 FLOW",
    usd: "$2,283.90",
    change: "+15.2%",
    trend: "up" as const,
  },
  {
    label: "Sales (24h)",
    value: "234",
    change: "+12.5%",
    trend: "up" as const,
  },
  {
    label: "Avg. Price",
    value: "1.95 FLOW",
    usd: "$9.75",
    change: "-2.1%",
    trend: "down" as const,
  },
  {
    label: "Listed",
    value: "12,345",
    change: "9.8%",
    trend: "neutral" as const,
  },
  {
    label: "Unique Owners",
    value: "45,678",
    change: "+234",
    trend: "up" as const,
  },
]

export function CollectionStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4 bg-card border-border">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <div className="space-y-1">
              <p className="text-xl font-bold font-mono">{stat.value}</p>
              {stat.usd && <p className="text-xs text-muted-foreground font-mono">{stat.usd}</p>}
            </div>
            {stat.trend !== "neutral" && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  stat.trend === "up" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
