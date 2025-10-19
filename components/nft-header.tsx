"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Share2, Heart } from "lucide-react"

export function NFTHeader() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="aspect-square bg-muted rounded-lg" />

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">NBA Top Shot</p>
          <h1 className="text-4xl font-bold tracking-tight">LeBron James Dunk #1234</h1>
          <p className="text-muted-foreground">
            Iconic LeBron James dunk from the 2023 NBA Finals. Limited edition moment.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Current Price</p>
            <p className="text-3xl font-bold font-mono">12.5 FLOW</p>
            <p className="text-sm text-muted-foreground font-mono">$62.50 USD</p>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Last Sale</p>
            <p className="text-2xl font-bold font-mono">10.5 FLOW</p>
            <p className="text-sm text-foreground">+19.0%</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1">Buy Now</Button>
          <Button variant="outline" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Serial</p>
            <p className="font-mono font-medium">#1234</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mint Date</p>
            <p className="font-mono text-sm">Jan 15, 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Rarity</p>
            <p className="font-medium">Legendary</p>
          </div>
        </div>
      </div>
    </div>
  )
}
