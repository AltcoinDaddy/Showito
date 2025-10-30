"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const collections = [
  {
    name: "NBA Top Shot",
    description: "Officially licensed NBA collectible highlights",
    volume: "456.78 FLOW",
    floor: "2.5 FLOW",
    items: "125,432",
    owners: "45,678",
    change: "+15.2%",
    trend: "up" as const,
  },
  {
    name: "NFL All Day",
    description: "Officially licensed NFL video highlights",
    volume: "234.56 FLOW",
    floor: "1.2 FLOW",
    items: "89,234",
    owners: "32,456",
    change: "+8.7%",
    trend: "up" as const,
  },
  {
    name: "UFC Strike",
    description: "Official UFC digital collectibles",
    volume: "189.34 FLOW",
    floor: "0.8 FLOW",
    items: "67,890",
    owners: "28,901",
    change: "-3.4%",
    trend: "down" as const,
  },
  {
    name: "Flovatar",
    description: "Customizable avatars on Flow",
    volume: "123.45 FLOW",
    floor: "5.0 FLOW",
    items: "45,678",
    owners: "12,345",
    change: "+22.1%",
    trend: "up" as const,
  },
  {
    name: "Gaia",
    description: "Virtual land and metaverse assets",
    volume: "98.76 FLOW",
    floor: "3.2 FLOW",
    items: "34,567",
    owners: "9,876",
    change: "+5.3%",
    trend: "up" as const,
  },
  {
    name: "Versus",
    description: "Digital art and collectibles marketplace",
    volume: "87.65 FLOW",
    floor: "1.8 FLOW",
    items: "23,456",
    owners: "7,890",
    change: "+12.8%",
    trend: "up" as const,
  },
  {
    name: "Ballerz",
    description: "Basketball-themed NFT collection",
    volume: "76.54 FLOW",
    floor: "0.9 FLOW",
    items: "18,901",
    owners: "6,543",
    change: "-1.2%",
    trend: "down" as const,
  },
  {
    name: "Cryptoys",
    description: "Digital toys and collectibles",
    volume: "65.43 FLOW",
    floor: "2.1 FLOW",
    items: "15,678",
    owners: "5,432",
    change: "+7.9%",
    trend: "up" as const,
  },
]

export function CollectionGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {collections.map((collection) => (
        <Card
          key={collection.name}
          className="p-6 bg-card border-border hover:border-foreground transition-colors cursor-pointer group"
        >
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {collection.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-lg group-hover:text-foreground transition-colors">{collection.name}</h3>
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

              <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground">Floor</p>
                <p className="font-mono font-medium">{collection.floor}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Volume</p>
                <p className="font-mono font-medium">{collection.volume}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="font-mono text-sm">{collection.items}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Owners</p>
                <p className="font-mono text-sm">{collection.owners}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
