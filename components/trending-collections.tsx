"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const collections = [
  { name: "NBA Top Shot", volume: "456.78 FLOW", change: "+45.2%", trend: 1 },
  { name: "NFL All Day", volume: "234.56 FLOW", change: "+38.7%", trend: 2 },
  { name: "UFC Strike", volume: "189.34 FLOW", change: "+32.4%", trend: 3 },
  { name: "Flovatar", volume: "123.45 FLOW", change: "+28.1%", trend: 4 },
]

export function TrendingCollections() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Trending Collections</h2>
          <p className="text-sm text-muted-foreground">Fastest growing by volume</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => (
            <div
              key={collection.name}
              className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 bg-muted rounded" />
                <div className="flex items-center gap-1 text-sm text-foreground">
                  <TrendingUp className="h-4 w-4" />#{collection.trend}
                </div>
              </div>
              <div>
                <p className="font-medium">{collection.name}</p>
                <p className="text-sm font-mono text-muted-foreground">{collection.volume}</p>
              </div>
              <p className="text-sm text-foreground">{collection.change}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
