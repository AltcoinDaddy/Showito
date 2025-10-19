/**
 * Tests for Enhanced Flow API
 * Basic validation tests for the new data models and services
 */

import { DisneyPinnacleService } from '../disney-pinnacle-service'
import { WhaleTrackingService } from '../whale-tracking-service'
import { ValidationService } from '../validation-service'
import EnhancedFlowAPI from '../enhanced-flow-api'

describe('Enhanced Flow API', () => {
  describe('DisneyPinnacleService', () => {
    test('should validate render ID correctly', () => {
      expect(DisneyPinnacleService.validateRenderID('DP-S1-MICKEY-001')).toBe(true)
      expect(DisneyPinnacleService.validateRenderID('DP-S2-ELSA-042')).toBe(true)
      expect(DisneyPinnacleService.validateRenderID('invalid-id')).toBe(false)
      expect(DisneyPinnacleService.validateRenderID('')).toBe(false)
    })

    test('should generate image URL correctly', () => {
      const renderID = 'DP-S1-MICKEY-001'
      const imageUrl = DisneyPinnacleService.generateImageUrl(renderID)
      expect(imageUrl).toContain(renderID)
      expect(imageUrl).toContain('view=front')
      expect(imageUrl).toContain('format=webp')
    })

    test('should handle invalid render ID gracefully', () => {
      const imageUrl = DisneyPinnacleService.generateImageUrl('invalid')
      expect(imageUrl).toBe('/placeholder-disney.svg')
    })
  })

  describe('WhaleTrackingService', () => {
    test('should validate wallet address correctly', () => {
      expect(WhaleTrackingService.validateWalletAddress('0x1234567890abcdef')).toBe(true)
      expect(WhaleTrackingService.validateWalletAddress('0xfedcba0987654321')).toBe(true)
      expect(WhaleTrackingService.validateWalletAddress('invalid-address')).toBe(false)
      expect(WhaleTrackingService.validateWalletAddress('0x123')).toBe(false) // Too short
    })

    test('should identify whale wallets correctly', () => {
      expect(WhaleTrackingService.isWhaleWallet(150, 30000)).toBe(true) // High NFT count
      expect(WhaleTrackingService.isWhaleWallet(50, 60000)).toBe(true) // High value
      expect(WhaleTrackingService.isWhaleWallet(50, 30000)).toBe(false) // Neither threshold met
    })

    test('should create whale activity correctly', () => {
      const activity = WhaleTrackingService.createWhaleActivity(
        '0x1234567890abcdef',
        'buy',
        'nft-123',
        'collection-456',
        15000,
        'tx-hash-789'
      )

      expect(activity.walletAddress).toBe('0x1234567890abcdef')
      expect(activity.transactionType).toBe('buy')
      expect(activity.isLargeTransaction).toBe(true) // Above 10k threshold
      expect(activity.metadata.transactionHash).toBe('tx-hash-789')
    })
  })

  describe('ValidationService', () => {
    test('should validate wallet address', () => {
      const result = ValidationService.validateWalletAddress('0x1234567890abcdef')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)

      const invalidResult = ValidationService.validateWalletAddress('invalid')
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.errors).toHaveLength(1)
    })

    test('should sanitize input correctly', () => {
      expect(ValidationService.sanitizeInput('<script>alert("xss")</script>')).toBe('alert("xss")')
      expect(ValidationService.sanitizeInput('  normal text  ')).toBe('normal text')
      expect(ValidationService.sanitizeInput('javascript:void(0)')).toBe('void(0)')
    })

    test('should validate search query', () => {
      const validResult = ValidationService.validateSearchQuery('NBA Top Shot')
      expect(validResult.isValid).toBe(true)

      const emptyResult = ValidationService.validateSearchQuery('')
      expect(emptyResult.isValid).toBe(false)

      const suspiciousResult = ValidationService.validateSearchQuery('<script>alert(1)</script>')
      expect(suspiciousResult.isValid).toBe(false)
    })
  })

  describe('EnhancedFlowAPI', () => {
    test('should initialize without errors', () => {
      expect(() => {
        EnhancedFlowAPI.initialize({
          disneyApiKey: 'test-key',
          whaleThreshold: 100,
          cacheEnabled: true
        })
      }).not.toThrow()
    })

    test('should perform health check', async () => {
      const health = await EnhancedFlowAPI.healthCheck()
      expect(health).toHaveProperty('api')
      expect(health).toHaveProperty('disney')
      expect(health).toHaveProperty('whale')
      expect(health).toHaveProperty('validation')
    })

    test('should get cache stats', () => {
      const stats = EnhancedFlowAPI.getCacheStats()
      expect(stats).toHaveProperty('disney')
      expect(stats).toHaveProperty('whale')
    })

    test('should clear caches without errors', () => {
      expect(() => {
        EnhancedFlowAPI.clearAllCaches()
      }).not.toThrow()
    })
  })
})

// Mock data for testing
export const mockEnhancedCollection = {
  id: 'test-collection',
  name: 'Test Collection',
  description: 'A test collection',
  floorPrice: 10,
  volume24h: 50000,
  sales24h: 100,
  totalItems: 10000,
  uniqueOwners: 5000,
  change24h: 5.5,
  whaleCount: 25,
  averageHoldingPeriod: 120,
  marketCap: 100000,
  rarityDistribution: [
    { tier: 'Common', count: 5000, percentage: 50, floorPrice: 5 },
    { tier: 'Rare', count: 1000, percentage: 10, floorPrice: 25 }
  ],
  priceHistory: [],
  volumeHistory: [],
  topTraits: [],
  marketHealth: {
    liquidityScore: 75,
    volatilityScore: 45,
    whaleInfluence: 30,
    overallHealth: 'healthy' as const
  }
}

export const mockEnhancedNFT = {
  id: 'test-nft',
  collectionId: 'test-collection',
  collectionName: 'Test Collection',
  name: 'Test NFT',
  description: 'A test NFT',
  serialNumber: 1,
  rarity: 'Rare',
  currentPrice: 25,
  lastSalePrice: 20,
  owner: '0x1234567890abcdef',
  mintDate: '2023-01-01T00:00:00Z',
  traits: [],
  rarityAnalysis: {
    rarityScore: 85,
    rarityRank: 150,
    totalSupply: 10000,
    traitBreakdown: [],
    estimatedValue: 25,
    priceHistory: []
  },
  priceHistory: [],
  ownershipHistory: [],
  estimatedValue: 26,
  marketPosition: {
    percentileRank: 85,
    similarNFTs: [],
    priceComparison: 'fairly_valued' as const
  }
}