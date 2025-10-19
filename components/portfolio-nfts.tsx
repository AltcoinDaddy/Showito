"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const nfts = [
  {
    name: "LeBron James Dunk #1234",
    collection: "NBA Top Shot",
    acquired: "2024-01-15",
    cost: "10.5 FLOW",
    current: "12.5 FLOW",
    change: "+19.0%",
  },
  {
    name: "Patrick Mahomes TD #5678",
    collection: "NFL All Day",
    acquired: "2024-02-20",
    cost: "7.8 FLOW",
    current: "8.3 FLOW",
    change: "+6.4%",
  },
  {
    name: "Flovatar #3456",
    collection: "Flovatar",
    acquired: "2024-03-10",
    cost: "48.0 FLOW",
    current: "50.0 FLOW",
    change: "+4.2%",
  },
  {
    name: "Conor McGregor KO #9012",
    collection: "UFC Strike",
    acquired: "2024-04-05",
    cost: "6.5 FLOW",
    current: "8.0 FLOW",
    change: "+23.1%",
  },
  {
    name: "Gaia Land #7890",
    collection: "Gaia",
    acquired: "2024-05-12",
    cost: "3.0 FLOW",
    current: "3.2 FLOW",
    change: "+6.7%",
  },
  {
    name: "Stephen Curry 3PT #2345",
    collection: "NBA Top Shot",
    acquired: "2024-06-18",
    cost: "15.0 FLOW",
    current: "14.2 FLOW",
    change: "-5.3%",
  },
]

export function PortfolioNFTs() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your NFTs</h2>
            <p className="text-sm text-muted-foreground">All items in your portfolio</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-2">
          {nfts.map((nft) => (
            <div
              key={nft.name}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-muted rounded" />
                <div>
                  <p className="font-medium">{nft.name}</p>
                  <p className="text-sm text-muted-foreground">{nft.collection}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">Acquired: {nft.acquired}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="font-mono text-sm">{nft.cost}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-mono text-sm">{nft.current}</p>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p
                    className={`font-mono text-sm ${
                      nft.change.startsWith("+") ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {nft.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
