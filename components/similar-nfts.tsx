"use client"

import { Card } from "@/components/ui/card"

const similar = [
  { name: "LeBron Dunk #5678", price: "11.2 FLOW" },
  { name: "LeBron Dunk #9012", price: "13.8 FLOW" },
  { name: "LeBron Dunk #3456", price: "10.9 FLOW" },
]

export function SimilarNFTs() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Similar NFTs</h2>

        <div className="space-y-3">
          {similar.map((nft) => (
            <div
              key={nft.name}
              className="p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer space-y-2"
            >
              <div className="aspect-square bg-muted rounded" />
              <div>
                <p className="font-medium text-sm">{nft.name}</p>
                <p className="font-mono text-sm text-muted-foreground">{nft.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
