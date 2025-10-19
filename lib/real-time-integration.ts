import { getRealTimeService } from './real-time-service'
import { FlowCollection, FlowNFT } from './flow-api'

export interface RealTimeIntegrationConfig {
  autoStart: boolean
  enableSimulation: boolean
  simulationInterval: number
}

export class RealTimeIntegration {
  private service = getRealTimeService()
  private simulationTimer: NodeJS.Timeout | null = null

  constructor(private config: RealTimeIntegrationConfig = {
    autoStart: true,
    enableSimulation: process.env.NODE_ENV === 'development',
    simulationInterval: 10000 // 10 seconds
  }) {}

  public initialize(): void {
    if (this.config.autoStart) {
      this.service.start()
    }

    if (this.config.enableSimulation) {
      this.startSimulation()
    }

    // Set up integration with existing Flow API
    this.setupFlowAPIIntegration()
  }

  public shutdown(): void {
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer)
      this.simulationTimer = null
    }
    this.service.stop()
  }

  private setupFlowAPIIntegration(): void {
    // This would integrate with the existing Flow API to get real data
    // For now, we'll set up the structure for future integration
    console.log('Setting up Flow API integration for real-time data')
  }

  private startSimulation(): void {
    console.log('Starting real-time data simulation')
    
    this.simulationTimer = setInterval(() => {
      this.simulateMarketActivity()
    }, this.config.simulationInterval)
  }

  private simulateMarketActivity(): void {
    const collections = [
      'nba-top-shot',
      'nfl-all-day', 
      'disney-pinnacle',
      'cryptokitties'
    ]

    // Simulate price updates
    collections.forEach(collectionId => {
      if (Math.random() < 0.7) { // 70% chance of price update
        const basePrice = this.getBasePrice(collectionId)
        const change = (Math.random() - 0.5) * 0.2 // ±10% change
        const newPrice = basePrice * (1 + change)
        
        this.service.ingestPriceUpdate(collectionId, {
          collectionId,
          floorPrice: newPrice,
          previousPrice: basePrice,
          change24h: change * 100,
          volume24h: Math.random() * 100000,
          marketCap: newPrice * (Math.random() * 50000 + 10000)
        })
      }
    })

    // Simulate sales
    if (Math.random() < 0.4) { // 40% chance of sale
      const collectionId = collections[Math.floor(Math.random() * collections.length)]
      const nftId = `nft_${Math.floor(Math.random() * 10000)}`
      const price = this.getBasePrice(collectionId) * (0.8 + Math.random() * 0.4)
      
      this.service.ingestSaleData(collectionId, nftId, {
        nftId,
        collectionId,
        price,
        buyer: `0x${Math.random().toString(16).substr(2, 16)}`,
        seller: `0x${Math.random().toString(16).substr(2, 16)}`,
        timestamp: new Date().toISOString(),
        transactionId: `tx_${Math.random().toString(16).substr(2, 16)}`
      })
    }

    // Simulate whale movements
    if (Math.random() < 0.2) { // 20% chance of whale movement
      const collectionId = collections[Math.floor(Math.random() * collections.length)]
      const amount = Math.random() * 50000 + 5000
      
      this.service.ingestWhaleMovement({
        walletAddress: `0x${Math.random().toString(16).substr(2, 16)}`,
        transactionType: Math.random() > 0.5 ? 'buy' : 'sell',
        nftId: `nft_${Math.floor(Math.random() * 10000)}`,
        collectionId,
        amount,
        timestamp: new Date().toISOString(),
        isLargeTransaction: amount > 10000
      })
    }

    // Simulate alerts
    if (Math.random() < 0.1) { // 10% chance of alert
      const collectionId = collections[Math.floor(Math.random() * collections.length)]
      
      this.service.triggerAlert({
        type: 'price_threshold',
        collectionId,
        message: `Floor price alert for ${collectionId}`,
        threshold: Math.random() * 1000,
        currentValue: Math.random() * 1000,
        timestamp: new Date().toISOString()
      })
    }
  }

  private getBasePrice(collectionId: string): number {
    const basePrices: Record<string, number> = {
      'nba-top-shot': 150,
      'nfl-all-day': 80,
      'disney-pinnacle': 200,
      'cryptokitties': 300
    }
    return basePrices[collectionId] || 100
  }

  // Public methods for manual data ingestion
  public ingestCollectionUpdate(collection: FlowCollection): void {
    this.service.ingestPriceUpdate(collection.id, {
      collectionId: collection.id,
      floorPrice: collection.floorPrice,
      volume24h: collection.volume24h,
      marketCap: collection.marketCap,
      change24h: collection.change24h
    })
  }

  public ingestNFTSale(nft: FlowNFT, salePrice: number, buyer: string, seller?: string): void {
    this.service.ingestSaleData(nft.collectionId, nft.id, {
      nftId: nft.id,
      collectionId: nft.collectionId,
      price: salePrice,
      buyer,
      seller,
      timestamp: new Date().toISOString()
    })
  }

  public getServiceStatus() {
    return this.service.getStatus()
  }
}

// Singleton instance
let integration: RealTimeIntegration | null = null

export function getRealTimeIntegration(): RealTimeIntegration {
  if (!integration) {
    integration = new RealTimeIntegration()
  }
  return integration
}

export function initializeRealTimeIntegration(): void {
  const integration = getRealTimeIntegration()
  integration.initialize()
}

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize when the module loads in the browser
  setTimeout(() => {
    initializeRealTimeIntegration()
  }, 1000)
}