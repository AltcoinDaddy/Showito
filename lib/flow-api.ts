// Import enhanced types and services
import { 
  EnhancedFlowCollection,
  EnhancedFlowNFT,
  DisneyPinnacleNFT,
  WhaleActivity,
  PriceAlert,
  PortfolioMetrics,
  WhaleWallet,
  RarityTier,
  MarketHealthScore,
  BaseFlowCollection,
  BaseFlowNFT,
  MarketActivity
} from './enhanced-flow-types'
import { DisneyPinnacleService } from './disney-pinnacle-service'
import { WhaleTrackingService } from './whale-tracking-service'
import { ValidationService } from './validation-service'

// Re-export enhanced types for backward compatibility
export type { 
  EnhancedFlowCollection as FlowCollection,
  EnhancedFlowNFT as FlowNFT,
  DisneyPinnacleNFT,
  WhaleActivity,
  PriceAlert,
  PortfolioMetrics,
  BaseFlowCollection,
  BaseFlowNFT,
  MarketActivity
}

export async function getCollections(): Promise<EnhancedFlowCollection[]> {
  // Try real Flow integration first, fallback to mock data
  try {
    const { getRealCollections } = await import('./real-flow-api')
    return await getRealCollections()
  } catch (error) {
    console.warn("Real Flow API failed, using mock data:", error)
    return getMockCollections()
  }
}

async function getMockCollections(): Promise<EnhancedFlowCollection[]> {
  try {
    // Mock enhanced collection data
    const baseCollections = [
      {
        id: "nba-top-shot",
        name: "NBA Top Shot",
        description: "Officially licensed NBA collectible highlights",
        floorPrice: 2.5,
        volume24h: 45000,
        sales24h: 1250,
        totalItems: 500000,
        uniqueOwners: 125000,
        change24h: 5.2,
        imageUrl: "/nba-top-shot-logo.jpg",
      },
      {
        id: "nfl-all-day",
        name: "NFL All Day",
        description: "Officially licensed NFL collectible highlights",
        floorPrice: 1.8,
        volume24h: 32000,
        sales24h: 980,
        totalItems: 350000,
        uniqueOwners: 85000,
        change24h: -2.1,
        imageUrl: "/nfl-all-day-logo.jpg",
      },
      {
        id: "disney-pinnacle",
        name: "Disney Pinnacle",
        description: "Official Disney collectible pins and moments",
        floorPrice: 3.2,
        volume24h: 28000,
        sales24h: 750,
        totalItems: 250000,
        uniqueOwners: 65000,
        change24h: 8.7,
        imageUrl: "/placeholder-logo.png",
      },
      {
        id: "cryptokitties",
        name: "CryptoKitties",
        description: "Collectible and breedable digital cats on Flow",
        floorPrice: 0.8,
        volume24h: 15000,
        sales24h: 420,
        totalItems: 180000,
        uniqueOwners: 45000,
        change24h: -1.3,
        imageUrl: "/placeholder-logo.png",
      }
    ]

    // Enhance collections with additional data
    const enhancedCollections: EnhancedFlowCollection[] = baseCollections.map(collection => ({
      ...collection,
      whaleCount: Math.floor(collection.uniqueOwners * 0.02), // 2% are whales
      averageHoldingPeriod: Math.floor(Math.random() * 180) + 30, // 30-210 days
      marketCap: collection.floorPrice * collection.totalItems,
      rarityDistribution: generateMockRarityDistribution(),
      priceHistory: generateMockPriceHistory(collection.floorPrice),
      volumeHistory: generateMockVolumeHistory(collection.volume24h),
      topTraits: generateMockTopTraits(),
      marketHealth: generateMockMarketHealth()
    }))

    return enhancedCollections
  } catch (error) {
    console.error("[v0] Failed to fetch collections:", error)
    return []
  }
}

export async function getCollection(id: string): Promise<EnhancedFlowCollection | null> {
  try {
    const collections = await getCollections()
    return collections.find((c) => c.id === id) || null
  } catch (error) {
    console.error("[v0] Failed to fetch collection:", error)
    return null
  }
}

export async function getNFT(id: string): Promise<EnhancedFlowNFT | null> {
  try {
    // Mock enhanced NFT data
    const baseNFT = {
      id,
      collectionId: "nba-top-shot",
      collectionName: "NBA Top Shot",
      name: "LeBron James Dunk #1234",
      description: "Legendary dunk from the 2023 season",
      serialNumber: 1234,
      rarity: "Legendary",
      currentPrice: 150,
      lastSalePrice: 145,
      owner: "0x1234567890abcdef",
      mintDate: "2023-01-15T10:30:00Z",
      traits: [
        { name: "Player", value: "LeBron James", rarity: "Common" },
        { name: "Team", value: "Lakers", rarity: "Common" },
        { name: "Play Type", value: "Dunk", rarity: "Rare" },
      ],
      imageUrl: "/lebron-james-dunk.jpg",
    }

    // Enhance with additional data
    const enhancedNFT: EnhancedFlowNFT = {
      ...baseNFT,
      rarityAnalysis: {
        rarityScore: 95.5,
        rarityRank: 123,
        totalSupply: 10000,
        traitBreakdown: baseNFT.traits.map(trait => ({
          traitType: trait.name,
          traitValue: trait.value,
          rarityPercentage: trait.rarity === 'Rare' ? 5.2 : 25.0,
          floorPrice: trait.rarity === 'Rare' ? 50 : 10,
          count: trait.rarity === 'Rare' ? 520 : 2500
        })),
        estimatedValue: baseNFT.currentPrice,
        priceHistory: generateMockNFTPriceHistory(baseNFT.currentPrice)
      },
      priceHistory: generateMockNFTPriceHistory(baseNFT.currentPrice),
      ownershipHistory: [
        {
          owner: baseNFT.owner,
          acquiredAt: "2023-01-15T10:30:00Z",
          acquiredPrice: 145,
          holdingPeriod: 300 // days
        }
      ],
      estimatedValue: baseNFT.currentPrice * 1.05,
      marketPosition: {
        percentileRank: 85,
        similarNFTs: [`${id}-similar-1`, `${id}-similar-2`],
        priceComparison: 'fairly_valued'
      }
    }

    return enhancedNFT
  } catch (error) {
    console.error("[v0] Failed to fetch NFT:", error)
    return null
  }
}

export async function getMarketActivity(limit = 50): Promise<MarketActivity[]> {
  try {
    // Mock activity data
    return Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
      type: ["sale", "listing", "transfer"][Math.floor(Math.random() * 3)] as "sale" | "listing" | "transfer",
      nftId: `nft-${i}`,
      nftName: `Moment #${1000 + i}`,
      collectionName: i % 2 === 0 ? "NBA Top Shot" : "NFL All Day",
      price: Math.random() * 100 + 10,
      from: `0x${Math.random().toString(16).substring(2, 10)}`,
      to: `0x${Math.random().toString(16).substring(2, 10)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }))
  } catch (error) {
    console.error("[v0] Failed to fetch market activity:", error)
    return []
  }
}

export async function getCollectionActivity(collectionId: string, limit = 50): Promise<MarketActivity[]> {
  return getMarketActivity(limit)
}

export async function getUserPortfolio(address: string): Promise<EnhancedFlowNFT[]> {
  // Try real Flow integration first, fallback to mock data
  try {
    const { getRealUserNFTs } = await import('./real-flow-api')
    return await getRealUserNFTs(address)
  } catch (error) {
    console.warn("Real Flow API failed for user portfolio, using mock data:", error)
    return getMockUserPortfolio(address)
  }
}

async function getMockUserPortfolio(address: string): Promise<EnhancedFlowNFT[]> {
  try {
    // Validate wallet address
    const validation = ValidationService.validateWalletAddress(address)
    if (!validation.isValid) {
      console.error("Invalid wallet address:", validation.errors)
      return []
    }

    // Mock enhanced portfolio data
    const portfolioNFTs = Array.from({ length: 5 }, (_, i) => {
      const baseNFT = {
        id: `nft-${i}`,
        collectionId: "nba-top-shot",
        collectionName: "NBA Top Shot",
        name: `Moment #${1000 + i}`,
        description: "Collectible NBA highlight",
        serialNumber: 1000 + i,
        rarity: ["Common", "Rare", "Legendary"][i % 3],
        currentPrice: Math.random() * 50 + 10,
        lastSalePrice: Math.random() * 45 + 8,
        owner: address,
        mintDate: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
        traits: [
          { name: "Player", value: `Player ${i}`, rarity: "Common" },
          { name: "Team", value: `Team ${i}`, rarity: "Common" }
        ],
        imageUrl: `/placeholder.svg?height=200&width=200&query=NBA+moment+${i}`,
      }

      // Enhance with additional data
      const enhancedNFT: EnhancedFlowNFT = {
        ...baseNFT,
        rarityAnalysis: {
          rarityScore: Math.random() * 100,
          rarityRank: Math.floor(Math.random() * 1000) + 1,
          totalSupply: 10000,
          traitBreakdown: baseNFT.traits.map(trait => ({
            traitType: trait.name,
            traitValue: trait.value,
            rarityPercentage: Math.random() * 30 + 5,
            floorPrice: Math.random() * 20 + 5,
            count: Math.floor(Math.random() * 1000) + 100
          })),
          estimatedValue: baseNFT.currentPrice,
          priceHistory: generateMockNFTPriceHistory(baseNFT.currentPrice)
        },
        priceHistory: generateMockNFTPriceHistory(baseNFT.currentPrice),
        ownershipHistory: [
          {
            owner: address,
            acquiredAt: baseNFT.mintDate,
            acquiredPrice: baseNFT.lastSalePrice,
            holdingPeriod: Math.floor((Date.now() - new Date(baseNFT.mintDate).getTime()) / (1000 * 60 * 60 * 24))
          }
        ],
        estimatedValue: baseNFT.currentPrice * (1 + (Math.random() - 0.5) * 0.2),
        marketPosition: {
          percentileRank: Math.floor(Math.random() * 100),
          similarNFTs: [`similar-${i}-1`, `similar-${i}-2`],
          priceComparison: ['undervalued', 'fairly_valued', 'overvalued'][Math.floor(Math.random() * 3)] as any
        }
      }

      return enhancedNFT
    })

    // Analyze wallet for whale status
    const whaleAnalysis = await WhaleTrackingService.analyzeWallet(address, portfolioNFTs)
    if (whaleAnalysis) {
      console.log(`Wallet ${address} identified as whale:`, whaleAnalysis)
    }

    return portfolioNFTs
  } catch (error) {
    console.error("[v0] Failed to fetch user portfolio:", error)
    return []
  }
}

export async function getFloorPriceHistory(
  collectionId: string,
  days = 30,
): Promise<Array<{ date: string; price: number }>> {
  try {
    // Mock price history
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toISOString().split("T")[0],
      price: Math.random() * 5 + 2,
    }))
  } catch (error) {
    console.error("[v0] Failed to fetch floor price history:", error)
    return []
  }
}

export async function getVolumeHistory(
  collectionId: string,
  days = 30,
): Promise<Array<{ date: string; volume: number }>> {
  try {
    // Mock volume history
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 86400000).toISOString().split("T")[0],
      volume: Math.random() * 50000 + 10000,
    }))
  } catch (error) {
    console.error("[v0] Failed to fetch volume history:", error)
    return []
  }
}

// Utility functions
export function formatFlowAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export function calculatePriceChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatFlowAmount(amount: number): string {
  return `${amount.toFixed(2)} FLOW`
}

// Enhanced API functions for new features

/**
 * Get Disney Pinnacle NFTs with proper image rendering
 */
export async function getDisneyPinnacleNFTs(limit: number = 20): Promise<DisneyPinnacleNFT[]> {
  try {
    // Mock Disney Pinnacle NFT data
    const mockNFTs = Array.from({ length: limit }, (_, i) => ({
      id: `disney-${i}`,
      collectionId: "disney-pinnacle",
      collectionName: "Disney Pinnacle",
      name: `Disney Pin #${i + 1}`,
      description: "Official Disney collectible pin",
      serialNumber: i + 1,
      rarity: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][i % 5],
      currentPrice: Math.random() * 100 + 10,
      lastSalePrice: Math.random() * 95 + 8,
      owner: `0x${Math.random().toString(16).substring(2, 18)}`,
      mintDate: new Date(Date.now() - Math.random() * 31536000000).toISOString(),
      traits: [
        { name: "Character", value: ["Mickey", "Elsa", "Simba", "Buzz", "Woody"][i % 5], rarity: "Common" },
        { name: "Series", value: `S${(i % 3) + 1}`, rarity: "Common" }
      ],
      character: ["Mickey", "Elsa", "Simba", "Buzz", "Woody"][i % 5],
      series: `S${(i % 3) + 1}`,
      pinType: 'character' as const
    }))

    // Transform to Disney Pinnacle NFTs
    const disneyNFTs = await DisneyPinnacleService.batchProcessDisneyNFTs(mockNFTs)
    return disneyNFTs
  } catch (error) {
    console.error("[v0] Failed to fetch Disney Pinnacle NFTs:", error)
    return []
  }
}

/**
 * Get whale activities with filtering
 */
export async function getWhaleActivities(filters: any = {}): Promise<WhaleActivity[]> {
  try {
    return WhaleTrackingService.getWhaleActivities(filters)
  } catch (error) {
    console.error("[v0] Failed to fetch whale activities:", error)
    return []
  }
}

/**
 * Get top whales by various metrics
 */
export async function getTopWhales(metric: 'value' | 'count' | 'activity' | 'influence' = 'value', limit: number = 10): Promise<WhaleWallet[]> {
  try {
    return WhaleTrackingService.getTopWhales(metric, limit)
  } catch (error) {
    console.error("[v0] Failed to fetch top whales:", error)
    return []
  }
}

// Helper functions for generating mock enhanced data

function generateMockRarityDistribution(): RarityTier[] {
  return [
    { tier: 'Common', count: 5000, percentage: 50, floorPrice: 1.5 },
    { tier: 'Uncommon', count: 3000, percentage: 30, floorPrice: 3.0 },
    { tier: 'Rare', count: 1500, percentage: 15, floorPrice: 8.0 },
    { tier: 'Epic', count: 400, percentage: 4, floorPrice: 25.0 },
    { tier: 'Legendary', count: 100, percentage: 1, floorPrice: 100.0 }
  ]
}

function generateMockPriceHistory(currentPrice: number): any[] {
  return Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    price: currentPrice * (0.8 + Math.random() * 0.4),
    volume: Math.random() * 10000 + 1000,
    sales: Math.floor(Math.random() * 100) + 10
  }))
}

function generateMockVolumeHistory(currentVolume: number): any[] {
  return Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    volume: currentVolume * (0.5 + Math.random() * 1.0),
    sales: Math.floor(Math.random() * 200) + 50,
    uniqueBuyers: Math.floor(Math.random() * 100) + 20,
    uniqueSellers: Math.floor(Math.random() * 80) + 15
  }))
}

function generateMockTopTraits(): any[] {
  return [
    { traitType: 'Player', traitValue: 'LeBron James', count: 150, percentage: 1.5, floorPrice: 25.0 },
    { traitType: 'Team', traitValue: 'Lakers', count: 800, percentage: 8.0, floorPrice: 5.0 },
    { traitType: 'Play Type', traitValue: 'Dunk', count: 500, percentage: 5.0, floorPrice: 8.0 },
    { traitType: 'Season', traitValue: '2023-24', count: 2000, percentage: 20.0, floorPrice: 3.0 },
    { traitType: 'Rarity', traitValue: 'Legendary', count: 100, percentage: 1.0, floorPrice: 100.0 }
  ]
}

function generateMockMarketHealth(): MarketHealthScore {
  return {
    liquidityScore: Math.floor(Math.random() * 40) + 60, // 60-100
    volatilityScore: Math.floor(Math.random() * 60) + 20, // 20-80
    whaleInfluence: Math.floor(Math.random() * 50) + 25, // 25-75
    overallHealth: ['healthy', 'volatile', 'illiquid'][Math.floor(Math.random() * 3)] as any
  }
}

function generateMockNFTPriceHistory(currentPrice: number): any[] {
  return Array.from({ length: 10 }, (_, i) => ({
    timestamp: new Date(Date.now() - (9 - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    price: currentPrice * (0.7 + Math.random() * 0.6),
    transactionType: ['sale', 'listing', 'offer'][Math.floor(Math.random() * 3)] as any
  }))
}
