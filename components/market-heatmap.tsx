"use client"

import { Card } from "@/components/ui/card"

const heatmapData = [
  { name: "NBA Top Shot", value: 95 },
  { name: "NFL All Day", value: 78 },
  { name: "UFC Strike", value: 65 },
  { name: "Flovatar", value: 82 },
  { name: "Gaia", value: 58 },
  { name: "Versus", value: 45 },
  { name: "Ballerz", value: 38 },
  { name: "Cryptoys", value: 52 },
]

export function MarketHeatmap() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Market Heatmap</h2>
          <p className="text-sm text-muted-foreground">Activity intensity by collection</p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {heatmapData.map((item) => (
            <div
              key={item.name}
              className="aspect-square rounded-lg flex items-center justify-center p-2 cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                backgroundColor: `rgba(255, 255, 255, ${item.value / 100})`,
              }}
            >
              <p className="text-xs font-medium text-center text-black">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
