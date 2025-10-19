/**
 * Supabase Caching Layer Service
 * Provides caching for collection and NFT data with TTL and invalidation strategies
 * Requirements: 7.1, 7.3
 */

import { 
  EnhancedFlowCollection, 
  EnhancedFlowNFT, 
  FindLabsCollectionData,
  FindLabsNFTMetadata,
  APIResponse,
  ValidationResult
} from './enhanced-flow-types'
import { ValidationService } from './validation-service'

export interface CacheConfig {
  defaultTTL: number // seconds
  maxCacheSize: number // number of entries
  cleanupInterval: number // seconds
  batchSize: number // for batch operations
}

export interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  ttl: number
  accessCount: number
  lastAccessed: number
}

export interface CacheStats {
  totalEntries: number
  hitRate: number
  missRate: number
  totalHits: number
  totalMisses: number
  memoryUsage: number
  oldestEntry: number
  newestEntry: number
}

export interface BatchUpdateOperation {
  type: 'upsert' | 'delete' | 'invalidate'
  key: string
  data?: any
  ttl?: number
}

export class SupabaseCacheService {
  private cache = new Map<string, CacheEntry<any>>()
  private config: CacheConfig
  private stats = {
    hits: 0,
    misses: 0,
    totalRequests: 0
  }
  private cleanupTimer?: NodeJS.Timeout

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 300, // 5 minutes
      maxCacheSize: 10000,
      cleanupInterval: 60, // 1 minute
      batchSize: 100,
      ...config
    }

    this.startCleanupTimer()
  }

  /**
   * Cache collection data with TTL
   */
  async cacheCollection(
    collectionId: string, 
    data: EnhancedFlowCollection, 
    ttl?: number
  ): Promise<boolean> {
    try {
      const validation = ValidationService.validateCollectionId(collectionId)
      if (!validation.isValid) {
        console.error('Invalid collection ID for caching:', validation.errors)
        return false
      }

      const key = this.generateCollectionKey(collectionId)
      const entry: CacheEntry<EnhancedFlowCollection> = {
        key,
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now()
      }

      this.cache.set(key, entry)
      this.enforceMaxSize()
      
      return true
    } catch (error) {
      console.error('Failed to cache collection:', error)
      return false
    }
  }

  /**
   * Retrieve cached collection data
   */
  async getCachedCollection(collectionId: string): Promise<EnhancedFlowCollection | null> {
    try {
      const key = this.generateCollectionKey(collectionId)
      const entry = this.cache.get(key)

      if (!entry) {
        this.stats.misses++
        this.stats.totalRequests++
        return null
      }

      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        this.stats.misses++
        this.stats.totalRequests++
        return null
      }

      // Update access statistics
      entry.accessCount++
      entry.lastAccessed = Date.now()
      this.stats.hits++
      this.stats.totalRequests++

      return entry.data
    } catch (error) {
      console.error('Failed to retrieve cached collection:', error)
      return null
    }
  }

  /**
   * Cache NFT data with TTL
   */
  async cacheNFT(
    nftId: string, 
    data: EnhancedFlowNFT, 
    ttl?: number
  ): Promise<boolean> {
    try {
      const validation = ValidationService.validateNFTId(nftId)
      if (!validation.isValid) {
        console.error('Invalid NFT ID for caching:', validation.errors)
        return false
      }

      const key = this.generateNFTKey(nftId)
      const entry: CacheEntry<EnhancedFlowNFT> = {
        key,
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now()
      }

      this.cache.set(key, entry)
      this.enforceMaxSize()
      
      return true
    } catch (error) {
      console.error('Failed to cache NFT:', error)
      return false
    }
  }

  /**
   * Retrieve cached NFT data
   */
  async getCachedNFT(nftId: string): Promise<EnhancedFlowNFT | null> {
    try {
      const key = this.generateNFTKey(nftId)
      const entry = this.cache.get(key)

      if (!entry) {
        this.stats.misses++
        this.stats.totalRequests++
        return null
      }

      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        this.stats.misses++
        this.stats.totalRequests++
        return null
      }

      // Update access statistics
      entry.accessCount++
      entry.lastAccessed = Date.now()
      this.stats.hits++
      this.stats.totalRequests++

      return entry.data
    } catch (error) {
      console.error('Failed to retrieve cached NFT:', error)
      return null
    }
  }

  /**
   * Cache price history data
   */
  async cachePriceHistory(
    collectionId: string, 
    days: number,
    data: Array<{ timestamp: string; price: number }>, 
    ttl?: number
  ): Promise<boolean> {
    try {
      const key = this.generatePriceHistoryKey(collectionId, days)
      const entry: CacheEntry<Array<{ timestamp: string; price: number }>> = {
        key,
        data,
        timestamp: Date.now(),
        ttl: ttl || this.config.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now()
      }

      this.cache.set(key, entry)
      this.enforceMaxSize()
      
      return true
    } catch (error) {
      console.error('Failed to cache price history:', error)
      return false
    }
  }

  /**
   * Retrieve cached price history
   */
  async getCachedPriceHistory(
    collectionId: string, 
    days: number
  ): Promise<Array<{ timestamp: string; price: number }> | null> {
    try {
      const key = this.generatePriceHistoryKey(collectionId, days)
      const entry = this.cache.get(key)

      if (!entry || this.isExpired(entry)) {
        if (entry) this.cache.delete(key)
        this.stats.misses++
        this.stats.totalRequests++
        return null
      }

      entry.accessCount++
      entry.lastAccessed = Date.now()
      this.stats.hits++
      this.stats.totalRequests++

      return entry.data
    } catch (error) {
      console.error('Failed to retrieve cached price history:', error)
      return null
    }
  }

  /**
   * Batch update operations for performance optimization
   */
  async batchUpdate(operations: BatchUpdateOperation[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    // Process operations in batches
    for (let i = 0; i < operations.length; i += this.config.batchSize) {
      const batch = operations.slice(i, i + this.config.batchSize)
      
      for (const operation of batch) {
        try {
          switch (operation.type) {
            case 'upsert':
              if (operation.data) {
                const entry: CacheEntry<any> = {
                  key: operation.key,
                  data: operation.data,
                  timestamp: Date.now(),
                  ttl: operation.ttl || this.config.defaultTTL,
                  accessCount: 0,
                  lastAccessed: Date.now()
                }
                this.cache.set(operation.key, entry)
                success++
              } else {
                failed++
              }
              break

            case 'delete':
              this.cache.delete(operation.key)
              success++
              break

            case 'invalidate':
              const entry = this.cache.get(operation.key)
              if (entry) {
                // Mark as expired by setting timestamp to 0
                entry.timestamp = 0
                success++
              } else {
                failed++
              }
              break

            default:
              failed++
          }
        } catch (error) {
          console.error(`Batch operation failed for key ${operation.key}:`, error)
          failed++
        }
      }

      // Small delay between batches to prevent blocking
      if (i + this.config.batchSize < operations.length) {
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    this.enforceMaxSize()
    return { success, failed }
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidateByPattern(pattern: string): Promise<number> {
    let invalidated = 0
    const regex = new RegExp(pattern)

    for (const [key, entry] of this.cache.entries()) {
      if (regex.test(key)) {
        entry.timestamp = 0 // Mark as expired
        invalidated++
      }
    }

    return invalidated
  }

  /**
   * Invalidate all collection-related cache entries
   */
  async invalidateCollection(collectionId: string): Promise<number> {
    const pattern = `^(collection|nft|price_history):${collectionId}`
    return this.invalidateByPattern(pattern)
  }

  /**
   * Clear all cache entries
   */
  async clearCache(): Promise<void> {
    this.cache.clear()
    this.stats = { hits: 0, misses: 0, totalRequests: 0 }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    const entries = Array.from(this.cache.values())
    const now = Date.now()
    
    return {
      totalEntries: this.cache.size,
      hitRate: this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0,
      missRate: this.stats.totalRequests > 0 ? (this.stats.misses / this.stats.totalRequests) * 100 : 0,
      totalHits: this.stats.hits,
      totalMisses: this.stats.misses,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : now,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : now
    }
  }

  /**
   * Get cache entries by prefix
   */
  getEntriesByPrefix(prefix: string): CacheEntry<any>[] {
    const entries: CacheEntry<any>[] = []
    
    for (const [key, entry] of this.cache.entries()) {
      if (key.startsWith(prefix) && !this.isExpired(entry)) {
        entries.push(entry)
      }
    }

    return entries.sort((a, b) => b.lastAccessed - a.lastAccessed)
  }

  /**
   * Preload cache with batch data
   */
  async preloadCache(
    collections: EnhancedFlowCollection[],
    nfts: EnhancedFlowNFT[] = []
  ): Promise<{ collections: number; nfts: number }> {
    let collectionsLoaded = 0
    let nftsLoaded = 0

    // Preload collections
    for (const collection of collections) {
      const success = await this.cacheCollection(collection.id, collection)
      if (success) collectionsLoaded++
    }

    // Preload NFTs
    for (const nft of nfts) {
      const success = await this.cacheNFT(nft.id, nft)
      if (success) nftsLoaded++
    }

    return { collections: collectionsLoaded, nfts: nftsLoaded }
  }

  /**
   * Warm up cache with popular data
   */
  async warmUpCache(popularCollectionIds: string[]): Promise<void> {
    console.log(`Warming up cache for ${popularCollectionIds.length} collections`)
    
    // This would typically fetch data from the API and cache it
    // For now, we'll just mark these as priority entries
    for (const collectionId of popularCollectionIds) {
      const key = this.generateCollectionKey(collectionId)
      // In a real implementation, we would fetch and cache the data here
      console.log(`Marked ${key} for priority caching`)
    }
  }

  /**
   * Private helper methods
   */
  private generateCollectionKey(collectionId: string): string {
    return `collection:${collectionId}`
  }

  private generateNFTKey(nftId: string): string {
    return `nft:${nftId}`
  }

  private generatePriceHistoryKey(collectionId: string, days: number): string {
    return `price_history:${collectionId}:${days}d`
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now()
    return (now - entry.timestamp) > (entry.ttl * 1000)
  }

  private enforceMaxSize(): void {
    if (this.cache.size <= this.config.maxCacheSize) {
      return
    }

    // Remove oldest and least accessed entries
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, entry }))
      .sort((a, b) => {
        // Sort by access count (ascending) then by last accessed (ascending)
        if (a.entry.accessCount !== b.entry.accessCount) {
          return a.entry.accessCount - b.entry.accessCount
        }
        return a.entry.lastAccessed - b.entry.lastAccessed
      })

    const toRemove = entries.slice(0, this.cache.size - this.config.maxCacheSize)
    for (const { key } of toRemove) {
      this.cache.delete(key)
    }
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredEntries()
    }, this.config.cleanupInterval * 1000)
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now()
    let removed = 0

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key)
        removed++
      }
    }

    if (removed > 0) {
      console.log(`Cleaned up ${removed} expired cache entries`)
    }
  }

  private estimateMemoryUsage(): number {
    // Rough estimation of memory usage in bytes
    let totalSize = 0
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += key.length * 2 // UTF-16 characters
      totalSize += JSON.stringify(entry.data).length * 2
      totalSize += 64 // Overhead for entry metadata
    }

    return totalSize
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = undefined
    }
    this.cache.clear()
  }
}

// Export singleton instance
export const supabaseCacheService = new SupabaseCacheService()

// Export cache configuration for testing
export const createCacheService = (config: Partial<CacheConfig>) => {
  return new SupabaseCacheService(config)
}