"use client"

import { Card } from "@/components/ui/card"

const collections = [
  { name: "NBA Top Shot", count: 45, value: "1,125 FLOW", percentage: 45.8 },
  { name: "NFL All Day", count: 32, value: "384 FLOW", percentage: 15.6 },
  { name: "UFC Strike", count: 28, value: "224 FLOW", percentage: 9.1 },
  { name: "Flovatar", count: 12, value: "600 FLOW", percentage: 24.4 },
  { name: "Others", count: 10, value: "123 FLOW", percentage: 5.1 },
]

export function PortfolioCollections() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">By Collection</h2>
          <p className="text-sm text-muted-foreground">Portfolio breakdown</p>
        </div>

        <div className="space-y-4">
          {collections.map((collection) => (
            <div key={collection.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{collection.name}</span>
                <span className="font-mono text-muted-foreground">{collection.count} NFTs</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: `${collection.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{collection.percentage}%</span>
                  <span className="font-mono">{collection.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
