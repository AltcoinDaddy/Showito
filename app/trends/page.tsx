"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { TrendingCollections } from "@/components/trending-collections"
import { MarketSentiment } from "@/components/market-sentiment"
import { VolumeLeaders } from "@/components/volume-leaders"
import { PriceMovers } from "@/components/price-movers"
import { MarketHeatmap } from "@/components/market-heatmap"

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Market Trends</h1>
          <p className="text-muted-foreground text-lg">Comprehensive market analytics and trending insights</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketSentiment />
          <MarketHeatmap />
        </div>

        <TrendingCollections />

        <div className="grid gap-8 lg:grid-cols-2">
          <VolumeLeaders />
          <PriceMovers />
        </div>
      </main>
    </div>
  )
}
