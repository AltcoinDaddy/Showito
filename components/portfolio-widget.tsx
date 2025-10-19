"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export function PortfolioWidget() {
  const { isConnected, address } = useWallet()

  if (!isConnected) {
    return (
      <Card className="bg-card border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Wallet className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Portfolio</h3>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your wallet to view your NFT portfolio and track your holdings.
          </p>
          <Button variant="outline" className="w-full bg-transparent" asChild>
            <Link href="/portfolio">
              Connect Wallet
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <Wallet className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Portfolio</h3>
        </div>
        <Link href="/portfolio">
          <Button variant="ghost" size="sm">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">1,247.50 FLOW</p>
          <p className="text-sm text-green-500">+12.5% (24h)</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-xs text-muted-foreground">NFTs Owned</p>
            <p className="text-lg font-semibold">47</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Collections</p>
            <p className="text-lg font-semibold">8</p>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
          <Link href="/portfolio">
            View Full Portfolio
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
