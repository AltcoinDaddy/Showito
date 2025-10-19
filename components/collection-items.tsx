"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const items = [
  { name: "LeBron James Dunk #1234", price: "12.5 FLOW", rarity: "Legendary" },
  { name: "Stephen Curry 3PT #5678", price: "8.3 FLOW", rarity: "Rare" },
  { name: "Giannis Block #9012", price: "15.0 FLOW", rarity: "Legendary" },
  { name: "Luka Doncic Assist #3456", price: "6.7 FLOW", rarity: "Common" },
]

export function CollectionItems() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Items</h2>
            <p className="text-sm text-muted-foreground">Available for purchase</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.name}
              className="p-4 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer space-y-3"
            >
              <div className="aspect-square bg-muted rounded" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.rarity}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-mono font-medium">{item.price}</p>
                <Button size="sm" variant="outline">
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
