"use client"

import { Card } from "@/components/ui/card"

export function NFTDetails() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Contract Address</p>
            <p className="font-mono text-sm">0x0b2a3299cc857e29</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Token ID</p>
            <p className="font-mono text-sm">1234</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Token Standard</p>
            <p className="text-sm">Flow NFT</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Blockchain</p>
            <p className="text-sm">Flow</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Creator</p>
            <p className="font-mono text-sm">0x1234...5678</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Owner</p>
            <p className="font-mono text-sm">0x8765...4321</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
