"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { TrendingUp, TrendingDown, Users, Activity, DollarSign, BarChart3, GitCompare, X } from "lucide-react"
import { EnhancedFlowCollection } from "@/lib/enhanced-flow-types"
import { getCollections } from "@/lib/flow-api"

interface MultiCollectionOverviewProps {
  selectedCollections?: string[]
  onCollectionSelect?: (collectionIds: string[]) => void
  onSingleCollectionSelect?: (collectionId: string | null) => void
  showComparison?: boolean
  enableSingleSelection?: boolean
  className?: string
}

interface CollectionMetrics {
  floorPrice: number
  volume24h: number
  sales24h: number
  marketCap: number
  change24h: number
  whaleActivity: number
  uniqueOwners: number
  totalItems: number
}

export function MultiCollectionOverview({
  selectedCollections = [],
  onCollectionSelect,
  onSingleCollectionSelect,
  showComparison = false,
  enableSingleSelection = false,
  className = ""
}: MultiCollectionOverviewProps) {
  const [collections, setCollections] = useState<EnhancedFlowCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCollections)
  const [singleSelectedId, setSingleSelectedId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'volume' | 'floor' | 'change' | 'whales'>('volume')
  const [filterBy, setFilterBy] = useState<'all' | 'trending' | 'whales'>('all')
  const [comparisonMode, setComparisonMode] = useState(showComparison)
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString())

  useEffect(() => {
    loadCollections()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadCollections, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadCollections = async () => {
    try {
      const data = await getCollections()
      setCollections(data)
      setLastUpdate(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("Failed to load collections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionToggle = (collectionId: string, checked: boolean) => {
    if (enableSingleSelection) {
      // Single selection mode for dashboard filtering
      const newSingleSelected = checked ? collectionId : null
      setSingleSelectedId(newSingleSelected)
      onSingleCollectionSelect?.(newSingleSelected)
    } else {
      // Multi-selection mode for comparison
      const newSelected = checked 
        ? [...selectedIds, collectionId]
        : selectedIds.filter(id => id !== collectionId)
      
      setSelectedIds(newSelected)
      onCollectionSelect?.(newSelected)
    }
  }

  const getFilteredAndSortedCollections = () => {
    let filtered = [...collections]

    // Apply filters
    switch (filterBy) {
      case 'trending':
        filtered = filtered.filter(c => c.change24h > 0)
        break
      case 'whales':
        filtered = filtered.filter(c => c.whaleCount > 10)
        break
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume24h - a.volume24h
        case 'floor':
          return b.floorPrice - a.floorPrice
        case 'change':
          return b.change24h - a.change24h
        case 'whales':
          return b.whaleCount - a.whaleCount
        default:
          return 0
      }
    })

    return filtered
  }

  const formatFlowAmount = (amount: number) => `${amount.toLocaleString()} FLOW`
  const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`

  const getSelectedCollections = () => {
    return collections.filter(c => selectedIds.includes(c.id))
  }

  if (loading) {
    return (
      <Card className={`p-6 bg-card border-border ${className}`}>
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`p-6 bg-card border-border ${className}`}>
      <div className="space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Multi-Collection Overview</h2>
            <p className="text-sm text-muted-foreground font-mono">
              {collections.length} collections • {enableSingleSelection ? (singleSelectedId ? '1 selected' : 'none selected') : `${selectedIds.length} selected`}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Last updated: {lastUpdate}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="whales">Whale Active</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="floor">Floor Price</SelectItem>
                <SelectItem value="change">Change %</SelectItem>
                <SelectItem value="whales">Whales</SelectItem>
              </SelectContent>
            </Select>

            {!enableSingleSelection && (
              <Button
                variant={comparisonMode ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode(!comparisonMode)}
                className="gap-2"
              >
                <GitCompare className="h-4 w-4" />
                Compare
              </Button>
            )}
            
            {enableSingleSelection && singleSelectedId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSingleSelectedId(null)
                  onSingleCollectionSelect?.(null)
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filter
              </Button>
            )}
          </div>
        </div>

        {/* Collection List */}
        <div className="space-y-3">
          {getFilteredAndSortedCollections().map((collection) => {
            const isSelected = enableSingleSelection 
              ? singleSelectedId === collection.id
              : selectedIds.includes(collection.id)
            const metrics: CollectionMetrics = {
              floorPrice: collection.floorPrice,
              volume24h: collection.volume24h,
              sales24h: collection.sales24h,
              marketCap: collection.marketCap,
              change24h: collection.change24h,
              whaleActivity: collection.whaleCount,
              uniqueOwners: collection.uniqueOwners,
              totalItems: collection.totalItems
            }

            return (
              <div
                key={collection.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-accent border-foreground" 
                    : "bg-secondary border-border hover:bg-accent"
                }`}
                onClick={() => handleCollectionToggle(collection.id, !isSelected)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      onCheckedChange={() => {}}
                      className="pointer-events-none"
                    />
                    <div className="flex items-center gap-3">
                      <img 
                        src={collection.imageUrl || "/placeholder.svg"} 
                        alt={collection.name}
                        className="w-10 h-10 rounded border"
                      />
                      <div>
                        <h3 className="font-semibold">{collection.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono">
                          {metrics.totalItems.toLocaleString()} items • {metrics.uniqueOwners.toLocaleString()} owners
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Floor Price */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Floor</p>
                      <p className="font-mono font-semibold">{formatFlowAmount(metrics.floorPrice)}</p>
                    </div>

                    {/* 24h Volume */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">24h Volume</p>
                      <p className="font-mono font-semibold">{formatFlowAmount(metrics.volume24h)}</p>
                    </div>

                    {/* 24h Change */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <div className="flex items-center gap-1">
                        {metrics.change24h > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <p className={`font-mono font-semibold ${
                          metrics.change24h > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(metrics.change24h)}
                        </p>
                      </div>
                    </div>

                    {/* Whale Activity */}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Whales</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <p className="font-mono font-semibold">{metrics.whaleActivity}</p>
                      </div>
                    </div>

                    {/* Market Health Badge */}
                    <div>
                      <Badge 
                        variant={
                          collection.marketHealth.overallHealth === 'healthy' ? 'default' :
                          collection.marketHealth.overallHealth === 'volatile' ? 'secondary' :
                          'destructive'
                        }
                        className="font-mono"
                      >
                        {collection.marketHealth.overallHealth}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>   
         )
          })}
        </div>

        {/* Comparison View */}
        {comparisonMode && !enableSingleSelection && selectedIds.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Collection Comparison</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getSelectedCollections().map((collection) => (
                <Card key={collection.id} className="p-4 bg-secondary border-border">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <img 
                        src={collection.imageUrl || "/placeholder.svg"} 
                        alt={collection.name}
                        className="w-8 h-8 rounded border"
                      />
                      <h4 className="font-semibold text-sm">{collection.name}</h4>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Floor:</span>
                        <span className="font-mono">{formatFlowAmount(collection.floorPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volume:</span>
                        <span className="font-mono">{formatFlowAmount(collection.volume24h)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sales:</span>
                        <span className="font-mono">{collection.sales24h}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Market Cap:</span>
                        <span className="font-mono">{formatFlowAmount(collection.marketCap)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Change:</span>
                        <span className={`font-mono ${
                          collection.change24h > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {formatPercentage(collection.change24h)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Whales:</span>
                        <span className="font-mono">{collection.whaleCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Health:</span>
                        <Badge 
                          variant={
                            collection.marketHealth.overallHealth === 'healthy' ? 'default' :
                            collection.marketHealth.overallHealth === 'volatile' ? 'secondary' :
                            'destructive'
                          }
                          className="font-mono text-xs"
                        >
                          {collection.marketHealth.overallHealth}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary Stats for Selected Collections */}
        {!enableSingleSelection && selectedIds.length > 0 && (
          <div className="mt-6 p-4 bg-secondary rounded-lg border">
            <h3 className="text-sm font-semibold mb-3">Selected Collections Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Volume</p>
                <p className="font-mono font-semibold">
                  {formatFlowAmount(
                    getSelectedCollections().reduce((sum, c) => sum + c.volume24h, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Avg Floor</p>
                <p className="font-mono font-semibold">
                  {formatFlowAmount(
                    getSelectedCollections().reduce((sum, c) => sum + c.floorPrice, 0) / selectedIds.length
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Sales</p>
                <p className="font-mono font-semibold">
                  {getSelectedCollections().reduce((sum, c) => sum + c.sales24h, 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Whales</p>
                <p className="font-mono font-semibold">
                  {getSelectedCollections().reduce((sum, c) => sum + c.whaleCount, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}