"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { CollectionHeader } from "@/components/collection-header"
import { CollectionStats } from "@/components/collection-stats"
import { CollectionChart } from "@/components/collection-chart"
import { CollectionActivity } from "@/components/collection-activity"
import { CollectionItems } from "@/components/collection-items"
import { RarityDistribution } from "@/components/rarity-distribution"

export default function CollectionDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <CollectionHeader />
        <CollectionStats />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CollectionChart />
          </div>
          <RarityDistribution />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CollectionActivity />
          <CollectionItems />
        </div>
      </main>
    </div>
  )
}
