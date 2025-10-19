/**
 * Find Labs API Integration Service
 * Handles collection floor prices, metadata, and transaction event polling
 * Requirements: 1.1, 7.2
 */

import { 
  EnhancedFlowCollection, 
  EnhancedFlowNFT, 
  MarketActivity, 
  APIResponse, 
  APIError,
  ValidationResult 
} from './enhanced-flow-types'
import { ValidationService } from './validation-service'

export interface FindLabsConfig {
  baseUrl: string
  apiKey?: string
  timeout: number
  retryAttempts: number
  retryDelay: number
  rateLimit: {
    requestsPerSecond: number
    burstLimit: number
  }
}

export interface FindLabsCollectionData {
  id: string
  name: string
  description: string
  floorPrice: number
  volume24h: number
  sales24h: number
  totalItems: number
  uniqueOwners: number
  change24h: number
  imageUrl?: string
  metadata: Record<string, any>
}

export interface FindLabsTransactionEvent {
  id: string
  type: 'sale' | 'burn' | 'mint' | 'transfer'
  collectionId: string
  nftId: string
  price?: number
  from?: string
  to?: string
  timestamp: string
  blockHeight: number
  transactionHash: string
  metadata: Record<string, any>
}

export interface FindLabsNFTMetadata {
  id: string
  collectionId: string
  name: string
  description: string
  traits: Array<{ name: string; value: string; rarity?: string }>
  rarity?: string
  imageUrl?: string
  metadata: Record<string, any>
}

export class FindLabsAPIService {
  private config: FindLabsConfig
  private requestQueue: Array<() => Promise<any>> = []
  private isProcessingQueue = false
  private lastRequestTime = 0
  private requestCount = 0
  private resetTime = Date.now() + 1000

  constructor(config: Partial<FindLabsConfig> = {}) {
    this.config = {
      baseUrl: process.env.FIND_LABS_API_URL || 'https://api.findlabs.io/v1',
      apiKey: process.env.FIND_LABS_API_KEY,
      timeout: 10000,
      retryAttempts: 3,
      retryDelay: 1000,
      rateLimit: {
        requestsPerSecond: 10,
        burstLimit: 50
      },
      ...config
    }
  }

  /**
   * Fetch collection floor prices and metadata
   */
  async fetchCollectionData(collectionId: string): Promise<APIResponse<FindLabsCollectionData>> {
    const validation = this.validateCollectionId(collectionId)
    if (!validation.isValid) {
      return this.createErrorResponse('VALIDATION_ERROR', validation.errors[0]?.message || 'Invalid collection ID')
    }

    return this.executeWithRetry(async () => {
      const response = await this.makeRequest(`/collections/${collectionId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      // Transform Find Labs data to our format
      const collectionData: FindLabsCollectionData = {
        id: data.id || collectionId,
        name: data.name || 'Unknown Collection',
        description: data.description || '',
        floorPrice: this.parsePrice(data.floor_price),
        volume24h: this.parseVolume(data.volume_24h),
        sales24h: parseInt(data.sales_24h) || 0,
        totalItems: parseInt(data.total_items) || 0,
        uniqueOwners: parseInt(data.unique_owners) || 0,
        change24h: parseFloat(data.change_24h) || 0,
        imageUrl: data.image_url,
        metadata: data.metadata || {}
      }

      return this.createSuccessResponse(collectionData)
    })
  }

  /**
   * Fetch multiple collections in batch
   */
  async fetchMultipleCollections(collectionIds: string[]): Promise<APIResponse<FindLabsCollectionData[]>> {
    if (collectionIds.length === 0) {
      return this.createErrorResponse('INVALID_INPUT', 'Collection IDs array cannot be empty')
    }

    if (collectionIds.length > 50) {
      return this.createErrorResponse('BATCH_SIZE_EXCEEDED', 'Maximum 50 collections per batch request')
    }

    return this.executeWithRetry(async () => {
      const response = await this.makeRequest('/collections/batch', {
        method: 'POST',
        body: JSON.stringify({ collection_ids: collectionIds }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const collections = data.collections?.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unknown Collection',
        description: item.description || '',
        floorPrice: this.parsePrice(item.floor_price),
        volume24h: this.parseVolume(item.volume_24h),
        sales24h: parseInt(item.sales_24h) || 0,
        totalItems: parseInt(item.total_items) || 0,
        uniqueOwners: parseInt(item.unique_owners) || 0,
        change24h: parseFloat(item.change_24h) || 0,
        imageUrl: item.image_url,
        metadata: item.metadata || {}
      })) || []

      return this.createSuccessResponse(collections)
    })
  }

  /**
   * Poll for transaction events (sales, burns, mints)
   */
  async pollTransactionEvents(
    collectionId?: string, 
    eventTypes: string[] = ['sale', 'burn', 'mint'],
    since?: string
  ): Promise<APIResponse<FindLabsTransactionEvent[]>> {
    const params = new URLSearchParams()
    
    if (collectionId) {
      const validation = this.validateCollectionId(collectionId)
      if (!validation.isValid) {
        return this.createErrorResponse('VALIDATION_ERROR', validation.errors[0]?.message || 'Invalid collection ID')
      }
      params.append('collection_id', collectionId)
    }

    eventTypes.forEach(type => params.append('event_types', type))
    
    if (since) {
      params.append('since', since)
    }

    params.append('limit', '100')

    return this.executeWithRetry(async () => {
      const response = await this.makeRequest(`/events?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const events = data.events?.map((event: any) => ({
        id: event.id,
        type: event.type,
        collectionId: event.collection_id,
        nftId: event.nft_id,
        price: event.price ? this.parsePrice(event.price) : undefined,
        from: event.from_address,
        to: event.to_address,
        timestamp: event.timestamp,
        blockHeight: parseInt(event.block_height) || 0,
        transactionHash: event.transaction_hash,
        metadata: event.metadata || {}
      })) || []

      return this.createSuccessResponse(events)
    })
  }

  /**
   * Fetch NFT metadata
   */
  async fetchNFTMetadata(nftId: string): Promise<APIResponse<FindLabsNFTMetadata>> {
    const validation = this.validateNFTId(nftId)
    if (!validation.isValid) {
      return this.createErrorResponse('VALIDATION_ERROR', validation.errors[0]?.message || 'Invalid NFT ID')
    }

    return this.executeWithRetry(async () => {
      const response = await this.makeRequest(`/nfts/${nftId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      const nftMetadata: FindLabsNFTMetadata = {
        id: data.id || nftId,
        collectionId: data.collection_id,
        name: data.name || 'Unknown NFT',
        description: data.description || '',
        traits: data.traits?.map((trait: any) => ({
          name: trait.trait_type || trait.name,
          value: trait.value,
          rarity: trait.rarity
        })) || [],
        rarity: data.rarity,
        imageUrl: data.image_url,
        metadata: data.metadata || {}
      }

      return this.createSuccessResponse(nftMetadata)
    })
  }

  /**
   * Get collection floor price history
   */
  async getFloorPriceHistory(
    collectionId: string, 
    days: number = 30
  ): Promise<APIResponse<Array<{ timestamp: string; price: number }>>> {
    const validation = this.validateCollectionId(collectionId)
    if (!validation.isValid) {
      return this.createErrorResponse('VALIDATION_ERROR', validation.errors[0]?.message || 'Invalid collection ID')
    }

    if (days < 1 || days > 365) {
      return this.createErrorResponse('INVALID_RANGE', 'Days must be between 1 and 365')
    }

    return this.executeWithRetry(async () => {
      const response = await this.makeRequest(`/collections/${collectionId}/price-history?days=${days}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      const priceHistory = data.price_history?.map((point: any) => ({
        timestamp: point.timestamp,
        price: this.parsePrice(point.price)
      })) || []

      return this.createSuccessResponse(priceHistory)
    })
  }

  /**
   * Execute request with retry logic and error handling
   */
  private async executeWithRetry<T>(operation: () => Promise<APIResponse<T>>): Promise<APIResponse<T>> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        await this.enforceRateLimit()
        return await operation()
      } catch (error) {
        lastError = error as Error
        console.warn(`Find Labs API attempt ${attempt} failed:`, error)

        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1) // Exponential backoff
          await this.sleep(delay)
        }
      }
    }

    return this.createErrorResponse(
      'API_ERROR', 
      `Failed after ${this.config.retryAttempts} attempts: ${lastError?.message}`
    )
  }

  /**
   * Make HTTP request with proper headers and timeout
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`
    const headers: Record<string, string> = {
      'User-Agent': 'Showito-Analytics/1.0',
      ...options.headers as Record<string, string>
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Enforce rate limiting
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now()
    
    // Reset counter if a second has passed
    if (now >= this.resetTime) {
      this.requestCount = 0
      this.resetTime = now + 1000
    }

    // Check if we've exceeded the rate limit
    if (this.requestCount >= this.config.rateLimit.requestsPerSecond) {
      const waitTime = this.resetTime - now
      if (waitTime > 0) {
        await this.sleep(waitTime)
        this.requestCount = 0
        this.resetTime = Date.now() + 1000
      }
    }

    this.requestCount++
    this.lastRequestTime = now
  }

  /**
   * Utility functions
   */
  private parsePrice(price: any): number {
    if (typeof price === 'number') return price
    if (typeof price === 'string') {
      const parsed = parseFloat(price)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  private parseVolume(volume: any): number {
    if (typeof volume === 'number') return volume
    if (typeof volume === 'string') {
      const parsed = parseFloat(volume)
      return isNaN(parsed) ? 0 : parsed
    }
    return 0
  }

  private validateCollectionId(collectionId: string): ValidationResult {
    return ValidationService.validateCollectionId(collectionId)
  }

  private validateNFTId(nftId: string): ValidationResult {
    return ValidationService.validateNFTId(nftId)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private createSuccessResponse<T>(data: T): APIResponse<T> {
    return {
      data,
      success: true,
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        processingTime: 0,
        dataSource: 'api'
      }
    }
  }

  private createErrorResponse(code: string, message: string): APIResponse<any> {
    return {
      data: null,
      success: false,
      error: {
        code,
        message,
        timestamp: new Date().toISOString()
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        processingTime: 0,
        dataSource: 'api'
      }
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Health check for the Find Labs API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health')
      return response.ok
    } catch (error) {
      console.error('Find Labs API health check failed:', error)
      return false
    }
  }

  /**
   * Get API usage statistics
   */
  getUsageStats() {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      queueLength: this.requestQueue.length,
      isProcessingQueue: this.isProcessingQueue
    }
  }
}

// Export singleton instance
export const findLabsAPI = new FindLabsAPIService()