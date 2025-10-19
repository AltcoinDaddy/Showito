"use client"

import { Card } from "@/components/ui/card"

const leaders = [
  { name: "NBA Top Shot", volume: "456.78 FLOW", sales: 234 },
  { name: "NFL All Day", volume: "234.56 FLOW", sales: 189 },
  { name: "UFC Strike", volume: "189.34 FLOW", sales: 156 },
  { name: "Flovatar", volume: "123.45 FLOW", sales: 98 },
]

export function VolumeLeaders() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Volume Leaders</h2>
          <p className="text-sm text-muted-foreground">Top collections by 24h volume</p>
        </div>

        <div className="space-y-2">
          {leaders.map((leader, index) => (
            <div
              key={leader.name}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground w-6">{index + 1}</span>
                <div className="h-10 w-10 bg-muted rounded" />
                <p className="font-medium">{leader.name}</p>
              </div>

              <div className="text-right">
                <p className="font-mono text-sm">{leader.volume}</p>
                <p className="text-xs text-muted-foreground">{leader.sales} sales</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
