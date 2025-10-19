import { getWebSocketServer, FlowWebSocketServer } from './websocket-server'
import { getRealTimeDataProcessor, RealTimeDataProcessor, ProcessedUpdate } from './real-time-data-processor'
import { FlowCollection, FlowNFT } from './flow-api'

export interface RealTimeServiceConfig {
  enableWebSocket: boolean
  enableDataProcessing: boolean
  pollingFallbackInterval: number
  maxConcurrentConnections: number
}

export class RealTimeService {
  private wsServer: FlowWebSocketServer
  private dataProcessor: RealTimeDataProcessor
  private pollingTimer: NodeJS.Timeout | null = null
  private isRunning = false

  constructor(private config: RealTimeServiceConfig = {
    enableWebSocket: true,
    enableDataProcessing: true,
    pollingFallbackInterval: 60000, // 1 minute
    maxConcurrentConnections: 1000
  }) {
    this.wsServer = getWebSocketServer()
    this.dataProcessor = getRealTimeDataProcessor()
    this.setupDataProcessorIntegration()
  }

  public start(): void {
    if (this.isRunning) {
      console.warn('RealTimeService is already running')
      return
    }

    console.log('Starting RealTimeService...')
    
    if (this.config.enableWebSocket) {
      this.wsServer.start()
    }

    if (this.config.enableDataProcessing) {
      this.startPollingFallback()
    }

    this.isRunning = true
    console.log('RealTimeService started successfully')
  }

  public stop(): void {
    if (!this.isRunning) {
      return
    }

    console.log('Stopping RealTimeService...')
    
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
    }

    this.wsServer.stop()
    this.dataProcessor.clearQueue()
    
    this.isRunning = false
    console.log('RealTimeService stopped')
  }

  private setupDataProcessorIntegration(): void {
    // Subscribe to processed updates and broadcast them via WebSocket
    this.dataProcessor.subscribe('websocket_broadcaster', (updates: ProcessedUpdate[]) => {
      this.broadcastUpdates(updates)
    })
  }

  private broadcastUpdates(updates: ProcessedUpdate[]): void {
    updates.forEach(update => {
      switch (update.type) {
        case 'price':
          if (update.entityType === 'collection') {
            this.wsServer.broadcastPriceUpdate(update.entityId, update.data)
          }
          break
        case 'sale':
          if (update.entityType === 'nft' && update.data.collectionId) {
            this.wsServer.broadcastNewSale(update.data.collectionId, update.entityId, update.data)
          }
          break
        case 'whale':
          this.wsServer.broadcastWhaleMovement(update.data)
          break
        case 'alert':
          this.wsServer.broadcastToChannel('alerts', {
            type: 'alert_trigger',
            data: update.data
          })
          break
      }
    })
  }

  private startPollingFallback(): void {
    // Fallback polling for when WebSocket connections fail
    this.pollingTimer = setInterval(async () => {
      try {
        await this.pollForUpdates()
      } catch (error) {
        console.error('Error during polling fallback:', error)
      }
    }, this.config.pollingFallbackInterval)
  }

  private async pollForUpdates(): Promise<void> {
    // This would typically fetch data from external APIs
    // For now, we'll simulate some updates for testing
    if (process.env.NODE_ENV === 'development') {
      this.simulateUpdates()
    }
  }

  private simulateUpdates(): void {
    // Simulate price updates for testing
    const collections = ['nba-top-shot', 'nfl-all-day', 'disney-pinnacle']
    const randomCollection = collections[Math.floor(Math.random() * collections.length)]
    
    const priceUpdate = {
      type: 'price_update' as const,
      collectionId: randomCollection,
      data: {
        collectionId: randomCollection,
        floorPrice: Math.random() * 1000 + 100,
        previousPrice: Math.random() * 1000 + 100,
        change24h: (Math.random() - 0.5) * 20,
        volume24h: Math.random() * 50000,
        marketCap: Math.random() * 1000000
      },
      timestamp: new Date().toISOString()
    }

    this.dataProcessor.processWebSocketMessage(priceUpdate)

    // Occasionally simulate whale movements
    if (Math.random() < 0.3) {
      const whaleUpdate = {
        type: 'whale_movement' as const,
        data: {
          walletAddress: `0x${Math.random().toString(16).substr(2, 16)}`,
          transactionType: Math.random() > 0.5 ? 'buy' : 'sell',
          nftId: `nft_${Math.floor(Math.random() * 10000)}`,
          collectionId: randomCollection,
          amount: Math.random() * 50000 + 5000,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      }

      this.dataProcessor.processWebSocketMessage(whaleUpdate)
    }
  }

  // Public methods for external data ingestion
  public ingestPriceUpdate(collectionId: string, priceData: any): void {
    this.dataProcessor.processWebSocketMessage({
      type: 'price_update',
      collectionId,
      data: priceData,
      timestamp: new Date().toISOString()
    })
  }

  public ingestSaleData(collectionId: string, nftId: string, saleData: any): void {
    this.dataProcessor.processWebSocketMessage({
      type: 'new_sale',
      collectionId,
      nftId,
      data: saleData,
      timestamp: new Date().toISOString()
    })
  }

  public ingestWhaleMovement(whaleData: any): void {
    this.dataProcessor.processWebSocketMessage({
      type: 'whale_movement',
      data: whaleData,
      timestamp: new Date().toISOString()
    })
  }

  public triggerAlert(alertData: any): void {
    this.dataProcessor.processWebSocketMessage({
      type: 'alert_trigger',
      data: alertData,
      timestamp: new Date().toISOString()
    })
  }

  // Status and monitoring methods
  public getStatus(): {
    isRunning: boolean
    webSocketConnections: number
    queueSize: number
    processingStats: any
  } {
    return {
      isRunning: this.isRunning,
      webSocketConnections: this.wsServer.getConnectedClientsCount(),
      queueSize: this.dataProcessor.getQueueSize(),
      processingStats: this.dataProcessor.getProcessingStats()
    }
  }

  public getWebSocketServer(): FlowWebSocketServer {
    return this.wsServer
  }

  public getDataProcessor(): RealTimeDataProcessor {
    return this.dataProcessor
  }
}

// Singleton instance
let realTimeService: RealTimeService | null = null

export function getRealTimeService(): RealTimeService {
  if (!realTimeService) {
    realTimeService = new RealTimeService()
  }
  return realTimeService
}

export function startRealTimeService(): void {
  const service = getRealTimeService()
  service.start()
}

export function stopRealTimeService(): void {
  if (realTimeService) {
    realTimeService.stop()
  }
}