// Base interfaces
export interface BaseFlowCollection {
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
}

export interface BaseFlowNFT {
  id: string
  collectionId: string
  collectionName: string
  name: string
  description: string
  serialNumber: number
  rarity: string
  currentPrice: number
  lastSalePrice: number
  owner: string
  mintDate: string
  traits: Array<{ name: string; value: string; rarity: string }>
  imageUrl?: string
}

export interface MarketActivity {
  type: "sale" | "listing" | "transfer"
  nftId: string
  nftName: string
  collectionName: string
  price: number
  from: string
  to: string
  timestamp: string
}

// Enhanced Collection Model with whale tracking and market health
export interface EnhancedFlowCollection extends BaseFlowCollection {
  whaleCount: number
  averageHoldingPeriod: number
  rarityDistribution: RarityTier[]
  priceHistory: PriceHistoryPoint[]
  volumeHistory: VolumeHistoryPoint[]
  topTraits: TraitInfo[]
  marketHealth: MarketHealthScore
  marketCap: number
}

export interface RarityTier {
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  count: number
  percentage: number
  floorPrice: number
}

export interface PriceHistoryPoint {
  timestamp: string
  price: number
  volume: number
  sales: number
}

export interface VolumeHistoryPoint {
  timestamp: string
  volume: number
  sales: number
  uniqueBuyers: number
  uniqueSellers: number
}

export interface TraitInfo {
  traitType: string
  traitValue: string
  count: number
  percentage: number
  floorPrice: number
}

export interface MarketHealthScore {
  liquidityScore: number // 0-100
  volatilityScore: number // 0-100
  whaleInfluence: number // 0-100
  overallHealth: 'healthy' | 'volatile' | 'illiquid' | 'manipulated'
}

// Enhanced NFT Model with rarity analysis
export interface EnhancedFlowNFT extends BaseFlowNFT {
  rarityAnalysis: RarityAnalysis
  priceHistory: PricePoint[]
  ownershipHistory: OwnershipRecord[]
  estimatedValue: number
  marketPosition: MarketPosition
}

export interface RarityAnalysis {
  rarityScore: number
  rarityRank: number
  totalSupply: number
  traitBreakdown: TraitRarity[]
  estimatedValue: number
  priceHistory: PricePoint[]
}

export interface TraitRarity {
  traitType: string
  traitValue: string
  rarityPercentage: number
  floorPrice: number
  count: number
}

export interface PricePoint {
  timestamp: string
  price: number
  transactionType: 'sale' | 'listing' | 'offer'
}

export interface OwnershipRecord {
  owner: string
  acquiredAt: string
  acquiredPrice: number
  holdingPeriod?: number
}

export interface MarketPosition {
  percentileRank: number // 0-100, where 100 is most valuable
  similarNFTs: string[] // NFT IDs of similar items
  priceComparison: 'undervalued' | 'fairly_valued' | 'overvalued'
}

// Disney Pinnacle Integration Models
export interface DisneyPinnacleNFT extends EnhancedFlowNFT {
  renderID: string
  pinType: 'character' | 'moment' | 'collectible'
  series: string
  character?: string
  editionNumber: number
  totalEditions: number
  imageUrl: string // Generated from Disney endpoint
  disneyMetadata: DisneyMetadata
}

export interface DisneyMetadata {
  character: string
  series: string
  pinType: string
  rarity: DisneyRarity
  attributes: DisneyAttribute[]
  releaseDate: string
}

export interface DisneyRarity {
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary'
  score: number
  rank: number
}

export interface DisneyAttribute {
  trait_type: string
  value: string
  display_type?: string
}

// Whale Tracking Models
export interface WhaleWallet {
  address: string
  nftCount: number
  totalValue: number
  collections: WhaleCollectionHolding[]
  activityScore: number
  influence: WhaleInfluence
  lastActivity: string
  isVerified: boolean
}

export interface WhaleCollectionHolding {
  collectionId: string
  collectionName: string
  nftCount: number
  totalValue: number
  averageRarity: number
  topNFTs: string[] // NFT IDs
}

export interface WhaleInfluence {
  marketImpactScore: number // 0-100
  priceInfluence: number // How much their trades affect floor prices
  volumeContribution: number // Percentage of total volume
  followersCount: number // Other wallets that copy their trades
}

export interface WhaleActivity {
  id: string
  walletAddress: string
  transactionType: 'buy' | 'sell' | 'transfer' | 'mint'
  nftId: string
  collectionId: string
  amount: number
  timestamp: string
  isLargeTransaction: boolean
  marketImpact: MarketImpact
  metadata: WhaleActivityMetadata
}

export interface MarketImpact {
  priceChange: number // Percentage change in floor price after transaction
  volumeSpike: number // Percentage increase in volume
  copyTrades: number // Number of similar trades that followed
  sentiment: 'bullish' | 'bearish' | 'neutral'
}

export interface WhaleActivityMetadata {
  transactionHash: string
  gasUsed: number
  blockHeight: number
  previousOwner?: string
  bundleSize?: number // If part of a bulk transaction
}

// Alert System Models
export interface PriceAlert {
  id: string
  userId: string
  collectionId?: string
  nftId?: string
  alertType: 'floor_price' | 'volume_spike' | 'whale_movement' | 'specific_sale' | 'rarity_change'
  condition: AlertCondition
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  triggerCount: number
  metadata: AlertMetadata
}

export interface AlertCondition {
  operator: 'above' | 'below' | 'change_percent' | 'equals'
  value: number
  timeframe?: string
  comparisonType: 'absolute' | 'percentage' | 'moving_average'
}

export interface AlertMetadata {
  name: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  notificationMethods: ('browser' | 'email' | 'webhook')[]
  cooldownPeriod: number // Minutes between triggers
}

// Portfolio Analytics Models
export interface PortfolioMetrics {
  totalValue: number
  totalCost: number
  unrealizedPnL: number
  realizedPnL: number
  portfolioChange24h: number
  portfolioChange7d: number
  portfolioChange30d: number
  collectionBreakdown: CollectionHolding[]
  rarityDistribution: RarityBreakdown[]
  performanceMetrics: PerformanceMetrics
}

export interface CollectionHolding {
  collectionId: string
  collectionName: string
  nftCount: number
  totalValue: number
  totalCost: number
  unrealizedPnL: number
  averageRarity: number
  topNFT: EnhancedFlowNFT
  allocation: number // Percentage of total portfolio
}

export interface RarityBreakdown {
  tier: string
  count: number
  percentage: number
  totalValue: number
  averageValue: number
}

export interface PerformanceMetrics {
  bestPerformer: {
    nftId: string
    gainPercent: number
    gainAmount: number
  }
  worstPerformer: {
    nftId: string
    lossPercent: number
    lossAmount: number
  }
  averageHoldingPeriod: number
  turnoverRate: number // Trades per month
  diversificationScore: number // 0-100
}

// Real-time Data Models
export interface WebSocketMessage {
  type: 'price_update' | 'new_sale' | 'whale_movement' | 'alert_trigger' | 'volume_spike'
  collectionId?: string
  nftId?: string
  data: any
  timestamp: string
  priority: 'low' | 'medium' | 'high'
}

export interface RealTimeUpdate {
  entityType: 'collection' | 'nft' | 'wallet' | 'market'
  entityId: string
  updateType: 'price' | 'volume' | 'ownership' | 'metadata' | 'whale_activity'
  newValue: any
  previousValue?: any
  timestamp: string
  confidence: number // 0-1, reliability of the data
}

// Chart and Visualization Data Models
export interface ChartData {
  timestamp: string
  value: number
  volume?: number
  metadata?: Record<string, any>
}

export interface HeatmapData {
  x: string | number
  y: string | number
  value: number
  intensity: number
  metadata?: Record<string, any>
}

export interface TradeActivity {
  timestamp: string
  price: number
  volume: number
  walletSize: 'small' | 'medium' | 'large' | 'whale'
  transactionType: 'buy' | 'sell'
  rarity: string
}

// Filter and Search Models
export interface CollectionFilters {
  priceRange?: [number, number]
  volumeRange?: [number, number]
  rarityTiers?: string[]
  collections?: string[]
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y'
  sortBy?: 'price' | 'volume' | 'rarity' | 'age' | 'whale_activity'
  sortOrder?: 'asc' | 'desc'
}

export interface WhaleFilters {
  minNFTCount?: number
  minValue?: number
  collections?: string[]
  activityTimeRange?: '24h' | '7d' | '30d'
  transactionTypes?: ('buy' | 'sell' | 'transfer')[]
  minTransactionValue?: number
}

// Validation and Error Models
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  field: string
  message: string
  suggestion?: string
}

// API Response Models
export interface APIResponse<T> {
  data: T
  success: boolean
  error?: APIError
  metadata: ResponseMetadata
}

export interface APIError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}

export interface ResponseMetadata {
  timestamp: string
  requestId: string
  processingTime: number
  dataSource: 'cache' | 'api' | 'websocket'
  cacheAge?: number
}
