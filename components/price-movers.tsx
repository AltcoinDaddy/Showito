"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const movers = [
  { name: "Flovatar", change: "+45.2%", trend: "up" as const },
  { name: "NBA Top Shot", change: "+32.8%", trend: "up" as const },
  { name: "Ballerz", change: "-18.5%", trend: "down" as const },
  { name: "Versus", change: "-12.3%", trend: "down" as const },
]

export function PriceMovers() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Price Movers</h2>
          <p className="text-sm text-muted-foreground">Biggest floor price changes</p>
        </div>

        <div className="space-y-2">
          {movers.map((mover) => (
            <div
              key={mover.name}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-muted rounded" />
                <p className="font-medium">{mover.name}</p>
              </div>

              <div
                className={`flex items-center gap-2 ${
                  mover.trend === "up" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {mover.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <p className="font-mono font-medium">{mover.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
