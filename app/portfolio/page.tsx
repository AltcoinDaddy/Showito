"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { PortfolioStats } from "@/components/portfolio-stats"
import { PortfolioChart } from "@/components/portfolio-chart"
import { PortfolioNFTs } from "@/components/portfolio-nfts"
import { PortfolioCollections } from "@/components/portfolio-collections"
import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WalletModal } from "@/components/wallet-modal"

export default function PortfolioPage() {
  const { isConnected } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="h-24 w-24 bg-muted rounded-full" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Connect your Flow wallet to view your NFT portfolio and track your holdings
            </p>
            <Button onClick={() => setShowWalletModal(true)}>Connect Wallet</Button>
          </div>
        </main>
        <WalletModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Portfolio</h1>
          <p className="text-muted-foreground text-lg">Track your NFT holdings and portfolio value</p>
        </div>

        <PortfolioStats />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PortfolioChart />
          </div>
          <PortfolioCollections />
        </div>

        <PortfolioNFTs />
      </main>
    </div>
  )
}
