import * as React from 'react'
import { WebSocketMessage } from './websocket-server'
import { FlowCollection, FlowNFT } from './flow-api'

export interface DataTransformation<T = any> {
  transform(rawData: any): T | null
  validate(data: T): boolean
  sanitize(data: T): T
}

export interface ProcessedUpdate {
  id: string
  type: 'price' | 'volume' | 'sale' | 'whale' | 'alert'
  entityType: 'collection' | 'nft' | 'wallet'
  entityId: string
  data: any
  timestamp: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface BatchConfig {
  maxBatchSize: number
  maxWaitTime: number // milliseconds
  priorityThreshold: 'medium' | 'high' | 'critical'
}

export class RealTimeDataProcessor {
  private transformers: Map<string, DataTransformation> = new Map()
  private updateQueue: ProcessedUpdate[] = []
  private batchTimer: NodeJS.Timeout | null = null
  private subscribers: Map<string, (updates: ProcessedUpdate[]) => void> = new Map()
  private lastUpdateTimes: Map<string, number> = new Map()
  private updateThrottles: Map<string, number> = new Map()

  constructor(private batchConfig: BatchConfig = {
    maxBatchSize: 50,
    maxWaitTime: 1000,
    priorityThreshold: 'medium'
  }) {
    this.setupDefaultTransformers()
  }

  private setupDefaultTransformers(): void {
    // Collection price update transformer
    this.transformers.set('collection_price', {
      transform: (rawData: any) => {
        if (!rawData.collectionId || typeof rawData.floorPrice !== 'number') {
          return null
        }
        return {
          collectionId: rawData.collectionId,
          floorPrice: rawData.floorPrice,
          previousPrice: rawData.previousPrice,
          change24h: rawData.change24h,
          volume24h: rawData.volume24h,
          marketCap: rawData.marketCap
        }
      },
      validate: (data: any) => {
        return data.collectionId && 
               typeof data.floorPrice === 'number' && 
               data.floorPrice >= 0
      },
      sanitize: (data: any) => ({
        ...data,
        floorPrice: Math.max(0, Number(data.floorPrice)),
        change24h: Number(data.change24h) || 0,
        volume24h: Math.max(0, Number(data.volume24h) || 0)
      })
    })

    // NFT sale transformer
    this.transformers.set('nft_sale', {
      transform: (rawData: any) => {
        if (!rawData.nftId || !rawData.price || !rawData.buyer) {
          return null
        }
        return {
          nftId: rawData.nftId,
          collectionId: rawData.collectionId,
          price: rawData.price,
          buyer: rawData.buyer,
          seller: rawData.seller,
          timestamp: rawData.timestamp || new Date().toISOString(),
          transactionId: rawData.transactionId
        }
      },
      validate: (data: any) => {
        return data.nftId && 
               data.price > 0 && 
               data.buyer && 
               data.buyer !== data.seller
      },
      sanitize: (data: any) => ({
        ...data,
        price: Math.max(0, Number(data.price)),
        buyer: String(data.buyer).toLowerCase(),
        seller: data.seller ? String(data.seller).toLowerCase() : null
      })
    })

    // Whale movement transformer
    this.transformers.set('whale_movement', {
      transform: (rawData: any) => {
        if (!rawData.walletAddress || !rawData.transactionType) {
          return null
        }
        return {
          walletAddress: rawData.walletAddress,
          transactionType: rawData.transactionType,
          nftId: rawData.nftId,
          collectionId: rawData.collectionId,
          amount: rawData.amount,
          timestamp: rawData.timestamp || new Date().toISOString(),
          isLargeTransaction: rawData.amount > 10000
        }
      },
      validate: (data: any) => {
        return data.walletAddress && 
               ['buy', 'sell', 'transfer'].includes(data.transactionType) &&
               data.amount >= 0
      },
      sanitize: (data: any) => ({
        ...data,
        walletAddress: String(data.walletAddress).toLowerCase(),
        amount: Math.max(0, Number(data.amount) || 0),
        isLargeTransaction: Number(data.amount) > 10000
      })
    })
  }

  public registerTransformer(type: string, transformer: DataTransformation): void {
    this.transformers.set(type, transformer)
  }

  public processWebSocketMessage(message: WebSocketMessage): void {
    const update = this.transformMessage(message)
    if (update) {
      this.queueUpdate(update)
    }
  }

  private transformMessage(message: WebSocketMessage): ProcessedUpdate | null {
    let transformerType: string
    let entityType: ProcessedUpdate['entityType']
    let entityId: string
    let priority: ProcessedUpdate['priority'] = 'medium'

    switch (message.type) {
      case 'price_update':
        transformerType = 'collection_price'
        entityType = 'collection'
        entityId = message.collectionId || 'unknown'
        priority = 'high'
        break
      case 'new_sale':
        transformerType = 'nft_sale'
        entityType = 'nft'
        entityId = message.nftId || 'unknown'
        priority = 'high'
        break
      case 'whale_movement':
        transformerType = 'whale_movement'
        entityType = 'wallet'
        entityId = message.data?.walletAddress || 'unknown'
        priority = message.data?.isLargeTransaction ? 'critical' : 'medium'
        break
      case 'alert_trigger':
        entityType = 'collection'
        entityId = message.collectionId || 'alert'
        priority = 'critical'
        break
      default:
        return null
    }

    const transformer = this.transformers.get(transformerType)
    if (!transformer && message.type !== 'alert_trigger') {
      console.warn(`No transformer found for type: ${transformerType}`)
      return null
    }

    let processedData = message.data
    if (transformer) {
      const transformed = transformer.transform(message.data)
      if (!transformed || !transformer.validate(transformed)) {
        console.warn(`Invalid data for transformer ${transformerType}:`, message.data)
        return null
      }
      processedData = transformer.sanitize(transformed)
    }

    return {
      id: `${entityType}_${entityId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.getUpdateType(message.type),
      entityType,
      entityId,
      data: processedData,
      timestamp: message.timestamp,
      priority
    }
  }

  private getUpdateType(messageType: string): ProcessedUpdate['type'] {
    switch (messageType) {
      case 'price_update': return 'price'
      case 'new_sale': return 'sale'
      case 'whale_movement': return 'whale'
      case 'alert_trigger': return 'alert'
      default: return 'price'
    }
  }

  private queueUpdate(update: ProcessedUpdate): void {
    // Check if we should throttle this update
    if (this.shouldThrottleUpdate(update)) {
      return
    }

    this.updateQueue.push(update)
    this.lastUpdateTimes.set(update.entityId, Date.now())

    // Process immediately if critical or queue is full
    if (update.priority === 'critical' || this.updateQueue.length >= this.batchConfig.maxBatchSize) {
      this.processBatch()
    } else if (!this.batchTimer) {
      this.scheduleBatchProcessing()
    }
  }

  private shouldThrottleUpdate(update: ProcessedUpdate): boolean {
    const entityKey = `${update.entityType}_${update.entityId}`
    const lastUpdate = this.lastUpdateTimes.get(entityKey)
    const throttleTime = this.updateThrottles.get(entityKey) || this.getDefaultThrottleTime(update.type)

    if (lastUpdate && Date.now() - lastUpdate < throttleTime) {
      // Skip this update if it's too soon after the last one
      return true
    }

    return false
  }

  private getDefaultThrottleTime(updateType: ProcessedUpdate['type']): number {
    switch (updateType) {
      case 'price': return 5000 // 5 seconds
      case 'volume': return 10000 // 10 seconds
      case 'sale': return 1000 // 1 second
      case 'whale': return 2000 // 2 seconds
      case 'alert': return 0 // No throttling for alerts
      default: return 5000
    }
  }

  private scheduleBatchProcessing(): void {
    this.batchTimer = setTimeout(() => {
      this.processBatch()
    }, this.batchConfig.maxWaitTime)
  }

  private processBatch(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }

    if (this.updateQueue.length === 0) {
      return
    }

    // Sort by priority and timestamp
    const batch = this.updateQueue.splice(0, this.batchConfig.maxBatchSize)
    batch.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    })

    // Group updates by entity for efficient processing
    const groupedUpdates = this.groupUpdatesByEntity(batch)

    // Notify subscribers
    this.notifySubscribers(groupedUpdates)

    // Continue processing if there are more updates
    if (this.updateQueue.length > 0) {
      this.scheduleBatchProcessing()
    }
  }

  private groupUpdatesByEntity(updates: ProcessedUpdate[]): Map<string, ProcessedUpdate[]> {
    const grouped = new Map<string, ProcessedUpdate[]>()
    
    updates.forEach(update => {
      const key = `${update.entityType}_${update.entityId}`
      if (!grouped.has(key)) {
        grouped.set(key, [])
      }
      grouped.get(key)!.push(update)
    })

    return grouped
  }

  private notifySubscribers(groupedUpdates: Map<string, ProcessedUpdate[]>): void {
    this.subscribers.forEach((callback, subscriberId) => {
      try {
        const allUpdates = Array.from(groupedUpdates.values()).flat()
        callback(allUpdates)
      } catch (error) {
        console.error(`Error notifying subscriber ${subscriberId}:`, error)
      }
    })
  }

  public subscribe(subscriberId: string, callback: (updates: ProcessedUpdate[]) => void): void {
    this.subscribers.set(subscriberId, callback)
  }

  public unsubscribe(subscriberId: string): void {
    this.subscribers.delete(subscriberId)
  }

  public setUpdateThrottle(entityType: string, entityId: string, throttleMs: number): void {
    const key = `${entityType}_${entityId}`
    this.updateThrottles.set(key, throttleMs)
  }

  public getQueueSize(): number {
    return this.updateQueue.length
  }

  public getSubscriberCount(): number {
    return this.subscribers.size
  }

  public clearQueue(): void {
    this.updateQueue = []
    if (this.batchTimer) {
      clearTimeout(this.batchTimer)
      this.batchTimer = null
    }
  }

  public getProcessingStats(): {
    queueSize: number
    subscriberCount: number
    lastProcessedTime: string | null
    throttledEntities: number
  } {
    return {
      queueSize: this.updateQueue.length,
      subscriberCount: this.subscribers.size,
      lastProcessedTime: this.lastUpdateTimes.size > 0 
        ? new Date(Math.max(...Array.from(this.lastUpdateTimes.values()))).toISOString()
        : null,
      throttledEntities: this.updateThrottles.size
    }
  }
}

// Singleton instance
let dataProcessor: RealTimeDataProcessor | null = null

export function getRealTimeDataProcessor(): RealTimeDataProcessor {
  if (!dataProcessor) {
    dataProcessor = new RealTimeDataProcessor()
  }
  return dataProcessor
}

// React hook for using the data processor
export function useRealTimeDataProcessor() {
  const [processor] = React.useState(() => getRealTimeDataProcessor())
  const [updates, setUpdates] = React.useState<ProcessedUpdate[]>([])
  const [stats, setStats] = React.useState(processor.getProcessingStats())

  React.useEffect(() => {
    const subscriberId = `react_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    processor.subscribe(subscriberId, (newUpdates) => {
      setUpdates(prev => [...prev.slice(-99), ...newUpdates]) // Keep last 100 updates
    })

    // Update stats periodically
    const statsInterval = setInterval(() => {
      setStats(processor.getProcessingStats())
    }, 5000)

    return () => {
      processor.unsubscribe(subscriberId)
      clearInterval(statsInterval)
    }
  }, [processor])

  return {
    processor,
    updates,
    stats,
    clearUpdates: () => setUpdates([])
  }
}