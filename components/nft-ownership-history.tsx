"use client"

import { Card } from "@/components/ui/card"

const history = [
  { event: "Sale", from: "0x2345...6789", to: "0x8765...4321", price: "12.5 FLOW", date: "Feb 12, 2024" },
  { event: "Sale", from: "0x1234...5678", to: "0x2345...6789", price: "10.5 FLOW", date: "Jan 15, 2024" },
  { event: "Mint", from: "NBA Top Shot", to: "0x1234...5678", price: "8.0 FLOW", date: "Dec 1, 2023" },
]

export function NFTOwnershipHistory() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Ownership History</h2>
          <p className="text-sm text-muted-foreground">Transfer and sale history</p>
        </div>

        <div className="space-y-2">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{item.event}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {item.from} → {item.to}
                </p>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <p className="font-mono text-sm">{item.price}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
