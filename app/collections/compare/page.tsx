"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MultiCollectionOverview } from "@/components/multi-collection-overview"
import { CollectionSelector } from "@/components/collection-selector"
import { ArrowLeft, BarChart3, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function CollectionComparePage() {
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [showSelector, setShowSelector] = useState(false)

  const handleCollectionSelectionChange = (collectionIds: string[]) => {
    setSelectedCollections(collectionIds)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/collections">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Collections
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Collection Comparison</h1>
              <p className="text-sm text-muted-foreground font-mono">
                Compare metrics across multiple Flow NFT collections
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Collection Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Select Collections to Compare</h2>
              <p className="text-sm text-muted-foreground">
                Choose up to 5 collections for detailed comparison
              </p>
            </div>
            <Button
              variant={showSelector ? "default" : "outline"}
              onClick={() => setShowSelector(!showSelector)}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showSelector ? "Hide Selector" : "Show Selector"}
            </Button>
          </div>

          {showSelector && (
            <CollectionSelector
              selectedCollections={selectedCollections}
              onSelectionChange={handleCollectionSelectionChange}
              maxSelections={5}
              showFilters={true}
            />
          )}
        </div>

        {/* Multi-Collection Overview with Comparison */}
        <MultiCollectionOverview
          selectedCollections={selectedCollections}
          onCollectionSelect={handleCollectionSelectionChange}
          showComparison={true}
          enableSingleSelection={false}
        />

        {/* Quick Stats Summary */}
        {selectedCollections.length > 0 && (
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Comparison Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Best Performer</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Collection with highest 24h change
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Volume Leader</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Collection with highest 24h volume
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Most Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Collection with most whale activity
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {selectedCollections.length === 0 && (
          <Card className="p-12 bg-card border-border text-center">
            <div className="space-y-4">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">No Collections Selected</h3>
                <p className="text-sm text-muted-foreground">
                  Select collections above to start comparing their metrics and performance
                </p>
              </div>
              <Button onClick={() => setShowSelector(true)} className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Select Collections
              </Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}