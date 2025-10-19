"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsGrid } from "@/components/metrics-grid"
import { MarketOverview } from "@/components/market-overview"
import { TopCollections } from "@/components/top-collections"
import { RecentActivity } from "@/components/recent-activity"
import { PortfolioWidget } from "@/components/portfolio-widget"
import { TrendsWidget } from "@/components/trends-widget"
import { AlertsWidget } from "@/components/alerts-widget"
import { MultiCollectionOverview } from "@/components/multi-collection-overview"
import { useState } from "react"

export default function DashboardPage() {
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null)

  const handleCollectionFilterChange = (collectionId: string | null) => {
    setSelectedCollectionFilter(collectionId)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">Flow NFT Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Real-time insights and analytics for the Flow blockchain ecosystem
            {selectedCollectionFilter && (
              <span className="block text-sm font-mono mt-1">
                Filtered by: {selectedCollectionFilter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            )}
          </p>
        </div>

        <MetricsGrid selectedCollection={selectedCollectionFilter} />

        <MultiCollectionOverview 
          enableSingleSelection={true}
          onSingleCollectionSelect={handleCollectionFilterChange}
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <MarketOverview selectedCollection={selectedCollectionFilter} />
          <TopCollections selectedCollection={selectedCollectionFilter} />
        </div>

        <RecentActivity selectedCollection={selectedCollectionFilter} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PortfolioWidget selectedCollection={selectedCollectionFilter} />
          <TrendsWidget selectedCollection={selectedCollectionFilter} />
          <AlertsWidget selectedCollection={selectedCollectionFilter} />
        </div>
      </main>
    </div>
  )
}
