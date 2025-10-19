"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const collections = [
  {
    name: "NBA Top Shot",
    volume: "456.78 FLOW",
    change: "+15.2%",
    trend: "up" as const,
    floor: "2.5 FLOW",
  },
  {
    name: "NFL All Day",
    volume: "234.56 FLOW",
    change: "+8.7%",
    trend: "up" as const,
    floor: "1.2 FLOW",
  },
  {
    name: "UFC Strike",
    volume: "189.34 FLOW",
    change: "-3.4%",
    trend: "down" as const,
    floor: "0.8 FLOW",
  },
  {
    name: "Flovatar",
    volume: "123.45 FLOW",
    change: "+22.1%",
    trend: "up" as const,
    floor: "5.0 FLOW",
  },
  {
    name: "Gaia",
    volume: "98.76 FLOW",
    change: "+5.3%",
    trend: "up" as const,
    floor: "3.2 FLOW",
  },
]

export function TopCollections() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Top Collections</h2>
          <p className="text-sm text-muted-foreground">By 24h volume</p>
        </div>

        <div className="space-y-3">
          {collections.map((collection, index) => (
            <div
              key={collection.name}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground w-6">{index + 1}</span>
                <div className="h-10 w-10 bg-muted rounded" />
                <div>
                  <p className="font-medium">{collection.name}</p>
                  <p className="text-sm text-muted-foreground font-mono">Floor: {collection.floor}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-mono text-sm">{collection.volume}</p>
                <div
                  className={`flex items-center gap-1 text-xs ${
                    collection.trend === "up" ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {collection.trend === "up" ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {collection.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
