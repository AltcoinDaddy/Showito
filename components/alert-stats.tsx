"use client"

import { Card } from "@/components/ui/card"

const stats = [
  { label: "Active Alerts", value: "12" },
  { label: "Triggered Today", value: "3" },
  { label: "Total Notifications", value: "45" },
]

export function AlertStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-6 bg-card border-border">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-3xl font-bold font-mono">{stat.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
