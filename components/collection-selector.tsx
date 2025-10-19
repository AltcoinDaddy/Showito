"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, X } from "lucide-react"
import { EnhancedFlowCollection } from "@/lib/enhanced-flow-types"
import { getCollections } from "@/lib/flow-api"

interface CollectionSelectorProps {
  selectedCollections?: string[]
  onSelectionChange?: (collectionIds: string[]) => void
  maxSelections?: number
  showFilters?: boolean
  className?: string
}

interface FilterState {
  search: string
  minFloor: string
  maxFloor: string
  minVolume: string
  maxVolume: string
  healthFilter: 'all' | 'healthy' | 'volatile' | 'illiquid'
  whaleActivity: 'all' | 'high' | 'medium' | 'low'
}

export function CollectionSelector({
  selectedCollections = [],
  onSelectionChange,
  maxSelections,
  showFilters = true,
  className = ""
}: CollectionSelectorProps) {
  const [collections, setCollections] = useState<EnhancedFlowCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedCollections)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minFloor: '',
    maxFloor: '',
    minVolume: '',
    maxVolume: '',
    healthFilter: 'all',
    whaleActivity: 'all'
  })

  useEffect(() => {
    loadCollections()
  }, [])

  useEffect(() => {
    setSelectedIds(selectedCollections)
  }, [selectedCollections])

  const loadCollections = async () => {
    try {
      const data = await getCollections()
      setCollections(data)
    } catch (error) {
      console.error("Failed to load collections:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionToggle = (collectionId: string, checked: boolean) => {
    let newSelected: string[]
    
    if (checked) {
      if (maxSelections && selectedIds.length >= maxSelections) {
        return // Don't allow more selections than max
      }
      newSelected = [...selectedIds, collectionId]
    } else {
      newSelected = selectedIds.filter(id => id !== collectionId)
    }
    
    setSelectedIds(newSelected)
    onSelectionChange?.(newSelected)
  }

  const clearAllSelections = () => {
    setSelectedIds([])
    onSelectionChange?.([])
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      minFloor: '',
      maxFloor: '',
      minVolume: '',
      maxVolume: '',
      healthFilter: 'all',
      whaleActivity: 'all'
    })
  }

  const getFilteredCollections = () => {
    return collections.filter(collection => {
      // Search filter
      if (filters.search && !collection.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Floor price filters
      if (filters.minFloor && collection.floorPrice < parseFloat(filters.minFloor)) {
        return false
      }
      if (filters.maxFloor && collection.floorPrice > parseFloat(filters.maxFloor)) {
        return false
      }

      // Volume filters
      if (filters.minVolume && collection.volume24h < parseFloat(filters.minVolume)) {
        return false
      }
      if (filters.maxVolume && collection.volume24h > parseFloat(filters.maxVolume)) {
        return false
      }

      // Health filter
      if (filters.healthFilter !== 'all' && collection.marketHealth.overallHealth !== filters.healthFilter) {
        return false
      }

      // Whale activity filter
      if (filters.whaleActivity !== 'all') {
        const whaleCount = collection.whaleCount
        switch (filters.whaleActivity) {
          case 'high':
            if (whaleCount < 50) return false
            break
          case 'medium':
            if (whaleCount < 10 || whaleCount >= 50) return false
            break
          case 'low':
            if (whaleCount >= 10) return false
            break
        }
      }

      return true
    })
  }

  const formatFlowAmount = (amount: number) => `${amount.toLocaleString()} FLOW`

  if (loading) {
    return (
      <Card className={`p-6 bg-card border-border ${className}`}>
        <div className="space-y-4">
          <div className="h-6 bg-muted animate-pulse rounded" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  const filteredCollections = getFilteredCollections()

  return (
    <Card className={`p-6 bg-card border-border ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Select Collections</h3>
            <p className="text-sm text-muted-foreground font-mono">
              {selectedIds.length} selected
              {maxSelections && ` of ${maxSelections} max`}
              {filteredCollections.length !== collections.length && 
                ` • ${filteredCollections.length} of ${collections.length} shown`
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllSelections}>
                Clear All
              </Button>
            )}
            {showFilters && (
              <Button
                variant={showFilterPanel ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <Card className="p-4 bg-secondary border-border">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Floor Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Floor Price (FLOW)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={filters.minFloor}
                      onChange={(e) => setFilters(prev => ({ ...prev, minFloor: e.target.value }))}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Max"
                      value={filters.maxFloor}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxFloor: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Volume Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">24h Volume (FLOW)</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min"
                      value={filters.minVolume}
                      onChange={(e) => setFilters(prev => ({ ...prev, minVolume: e.target.value }))}
                      className="text-xs"
                    />
                    <Input
                      placeholder="Max"
                      value={filters.maxVolume}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxVolume: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Market Health */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Market Health</label>
                  <Select 
                    value={filters.healthFilter} 
                    onValueChange={(value: any) => setFilters(prev => ({ ...prev, healthFilter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="healthy">Healthy</SelectItem>
                      <SelectItem value="volatile">Volatile</SelectItem>
                      <SelectItem value="illiquid">Illiquid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Whale Activity */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Whale Activity</label>
                  <Select 
                    value={filters.whaleActivity} 
                    onValueChange={(value: any) => setFilters(prev => ({ ...prev, whaleActivity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="high">High (50+)</SelectItem>
                      <SelectItem value="medium">Medium (10-49)</SelectItem>
                      <SelectItem value="low">Low (&lt;10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Collection List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredCollections.map((collection) => {
            const isSelected = selectedIds.includes(collection.id)
            const isDisabled = !!(maxSelections && !isSelected && selectedIds.length >= maxSelections)

            return (
              <div
                key={collection.id}
                className={`p-3 rounded-lg border transition-all ${
                  isDisabled 
                    ? "bg-muted border-border opacity-50 cursor-not-allowed"
                    : isSelected 
                      ? "bg-accent border-foreground cursor-pointer" 
                      : "bg-secondary border-border hover:bg-accent cursor-pointer"
                }`}
                onClick={() => !isDisabled && handleCollectionToggle(collection.id, !isSelected)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isSelected}
                      disabled={isDisabled}
                      onCheckedChange={() => {}}
                      className="pointer-events-none"
                    />
                    <img 
                      src={collection.imageUrl || "/placeholder.svg"} 
                      alt={collection.name}
                      className="w-8 h-8 rounded border"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{collection.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        {collection.totalItems.toLocaleString()} items
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <p className="text-muted-foreground">Floor</p>
                      <p className="font-mono">{formatFlowAmount(collection.floorPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-mono">{formatFlowAmount(collection.volume24h)}</p>
                    </div>
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
            )
          })}
        </div>

        {filteredCollections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No collections match your filters</p>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}