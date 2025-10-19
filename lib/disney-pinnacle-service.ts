import { DisneyPinnacleNFT, DisneyMetadata, ValidationResult, APIResponse } from './enhanced-flow-types'

/**
 * Disney Pinnacle Image Service
 * Handles image rendering and metadata for Disney Pinnacle NFTs
 */
export class DisneyPinnacleService {
  private static readonly BASE_IMAGE_URL = 'https://assets.disney.pinnacle.com/render'
  private static readonly METADATA_CACHE = new Map<string, DisneyMetadata>()
  private static readonly IMAGE_CACHE = new Map<string, string>()
  private static readonly CACHE_TTL = 1000 * 60 * 60 // 1 hour

  /**
   * Generate image URL for Disney Pinnacle NFT
   */
  static generateImageUrl(renderID: string, view: 'front' | 'back' = 'front'): string {
    if (!this.validateRenderID(renderID)) {
      return this.getPlaceholderImageUrl()
    }

    const cacheKey = `${renderID}-${view}`
    const cached = this.IMAGE_CACHE.get(cacheKey)
    
    if (cached) {
      return cached
    }

    const imageUrl = `${this.BASE_IMAGE_URL}/${renderID}?view=${view}&format=webp&quality=85`
    
    // Cache the URL
    this.IMAGE_CACHE.set(cacheKey, imageUrl)
    
    // Set cache expiration
    setTimeout(() => {
      this.IMAGE_CACHE.delete(cacheKey)
    }, this.CACHE_TTL)

    return imageUrl
  }

  /**
   * Validate Disney Pinnacle render ID format
   */
  static validateRenderID(renderID: string): boolean {
    if (!renderID || typeof renderID !== 'string') {
      return false
    }

    // Disney Pinnacle render IDs follow pattern: DP-SERIES-CHARACTER-EDITION
    // Example: DP-S1-MICKEY-001, DP-S2-ELSA-042
    const renderIDPattern = /^DP-S\d+-[A-Z0-9]+-\d{3,4}$/
    return renderIDPattern.test(renderID)
  }

  /**
   * Get cached image URL if available
   */
  static getCachedImage(renderID: string, view: 'front' | 'back' = 'front'): string | null {
    const cacheKey = `${renderID}-${view}`
    return this.IMAGE_CACHE.get(cacheKey) || null
  }

  /**
   * Parse Disney Pinnacle metadata from NFT data
   */
  static parseDisneyMetadata(nftData: any): DisneyMetadata {
    const metadata: DisneyMetadata = {
      character: nftData.character || 'Unknown',
      series: nftData.series || 'Unknown',
      pinType: nftData.pinType || 'collectible',
      rarity: {
        tier: nftData.rarity?.tier || 'Common',
        score: nftData.rarity?.score || 0,
        rank: nftData.rarity?.rank || 0
      },
      attributes: nftData.attributes || [],
      releaseDate: nftData.releaseDate || new Date().toISOString()
    }

    return metadata
  }

  /**
   * Transform regular FlowNFT to DisneyPinnacleNFT
   */
  static transformToDisneyNFT(nft: any, renderID: string): DisneyPinnacleNFT {
    const disneyMetadata = this.parseDisneyMetadata(nft)
    
    return {
      ...nft,
      renderID,
      pinType: disneyMetadata.pinType as 'character' | 'moment' | 'collectible',
      series: disneyMetadata.series,
      character: disneyMetadata.character,
      editionNumber: nft.serialNumber || 1,
      totalEditions: nft.totalSupply || 1000,
      imageUrl: this.generateImageUrl(renderID),
      disneyMetadata,
      rarityAnalysis: {
        rarityScore: disneyMetadata.rarity.score,
        rarityRank: disneyMetadata.rarity.rank,
        totalSupply: nft.totalSupply || 1000,
        traitBreakdown: nft.traits?.map((trait: any) => ({
          traitType: trait.name,
          traitValue: trait.value,
          rarityPercentage: this.calculateTraitRarity(trait.value, nft.totalSupply),
          floorPrice: 0, // Would be calculated from market data
          count: 1
        })) || [],
        estimatedValue: nft.currentPrice || 0,
        priceHistory: []
      },
      priceHistory: [],
      ownershipHistory: [],
      estimatedValue: nft.currentPrice || 0,
      marketPosition: {
        percentileRank: 50,
        similarNFTs: [],
        priceComparison: 'fairly_valued'
      }
    }
  }

  /**
   * Validate Disney Pinnacle NFT data
   */
  static validateDisneyNFT(nft: DisneyPinnacleNFT): ValidationResult {
    const errors: any[] = []
    const warnings: any[] = []

    // Validate render ID
    if (!this.validateRenderID(nft.renderID)) {
      errors.push({
        field: 'renderID',
        message: 'Invalid Disney Pinnacle render ID format',
        code: 'INVALID_RENDER_ID'
      })
    }

    // Validate pin type
    if (!['character', 'moment', 'collectible'].includes(nft.pinType)) {
      errors.push({
        field: 'pinType',
        message: 'Invalid pin type. Must be character, moment, or collectible',
        code: 'INVALID_PIN_TYPE'
      })
    }

    // Validate edition numbers
    if (nft.editionNumber > nft.totalEditions) {
      errors.push({
        field: 'editionNumber',
        message: 'Edition number cannot exceed total editions',
        code: 'INVALID_EDITION'
      })
    }

    // Validate series format
    if (!nft.series.match(/^S\d+$/)) {
      warnings.push({
        field: 'series',
        message: 'Series format should follow pattern S1, S2, etc.',
        suggestion: 'Update series format to match Disney standards'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Get placeholder image URL for invalid or missing render IDs
   */
  private static getPlaceholderImageUrl(): string {
    return '/placeholder-disney.svg'
  }

  /**
   * Calculate trait rarity percentage
   */
  private static calculateTraitRarity(traitValue: string, totalSupply: number): number {
    // Mock calculation - in production this would query actual trait distribution
    const mockRarityMap: Record<string, number> = {
      'Mickey': 15.5,
      'Elsa': 8.2,
      'Simba': 12.1,
      'Buzz': 6.7,
      'Woody': 9.3
    }

    return mockRarityMap[traitValue] || 25.0
  }

  /**
   * Batch process multiple Disney NFTs
   */
  static async batchProcessDisneyNFTs(nfts: any[]): Promise<DisneyPinnacleNFT[]> {
    const processed: DisneyPinnacleNFT[] = []

    for (const nft of nfts) {
      try {
        // Extract render ID from NFT metadata or generate one
        const renderID = this.extractRenderID(nft) || this.generateRenderID(nft)
        const disneyNFT = this.transformToDisneyNFT(nft, renderID)
        
        // Validate the transformed NFT
        const validation = this.validateDisneyNFT(disneyNFT)
        if (validation.isValid) {
          processed.push(disneyNFT)
        } else {
          console.warn(`Invalid Disney NFT ${nft.id}:`, validation.errors)
        }
      } catch (error) {
        console.error(`Error processing Disney NFT ${nft.id}:`, error)
      }
    }

    return processed
  }

  /**
   * Extract render ID from NFT metadata
   */
  private static extractRenderID(nft: any): string | null {
    // Check various possible locations for render ID
    const possibleFields = [
      nft.renderID,
      nft.metadata?.renderID,
      nft.traits?.find((t: any) => t.name === 'Render ID')?.value,
      nft.attributes?.find((a: any) => a.trait_type === 'render_id')?.value
    ]

    for (const field of possibleFields) {
      if (field && this.validateRenderID(field)) {
        return field
      }
    }

    return null
  }

  /**
   * Generate render ID from NFT data (fallback)
   */
  private static generateRenderID(nft: any): string {
    const series = nft.series || 'S1'
    const character = (nft.character || 'UNKNOWN').toUpperCase().replace(/\s+/g, '')
    const edition = String(nft.serialNumber || 1).padStart(3, '0')
    
    return `DP-${series}-${character}-${edition}`
  }

  /**
   * Preload images for better UX
   */
  static preloadImages(renderIDs: string[]): Promise<void[]> {
    const preloadPromises = renderIDs.map(renderID => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // Don't fail on individual image errors
        img.src = this.generateImageUrl(renderID)
      })
    })

    return Promise.all(preloadPromises)
  }

  /**
   * Clear image cache (useful for memory management)
   */
  static clearImageCache(): void {
    this.IMAGE_CACHE.clear()
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { imageCache: number; metadataCache: number } {
    return {
      imageCache: this.IMAGE_CACHE.size,
      metadataCache: this.METADATA_CACHE.size
    }
  }
}