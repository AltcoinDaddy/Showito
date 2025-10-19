"use client"

import { Card } from "@/components/ui/card"

const rarities = [
  { name: "Legendary", count: 1234, percentage: 5.2, color: "#ffffff" },
  { name: "Rare", count: 4567, percentage: 19.3, color: "#d4d4d4" },
  { name: "Uncommon", count: 8901, percentage: 37.6, color: "#a3a3a3" },
  { name: "Common", count: 9012, percentage: 37.9, color: "#737373" },
]

export function RarityDistribution() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Rarity Distribution</h2>
          <p className="text-sm text-muted-foreground">Item rarity breakdown</p>
        </div>

        <div className="space-y-4">
          {rarities.map((rarity) => (
            <div key={rarity.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: rarity.color }} />
                  <span className="font-medium">{rarity.name}</span>
                </div>
                <span className="font-mono text-muted-foreground">{rarity.count}</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${rarity.percentage}%`, backgroundColor: rarity.color }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{rarity.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
