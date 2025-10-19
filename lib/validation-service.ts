import { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  EnhancedFlowCollection,
  EnhancedFlowNFT,
  DisneyPinnacleNFT,
  WhaleActivity,
  PriceAlert,
  PortfolioMetrics
} from './enhanced-flow-types'
import { DisneyPinnacleService } from './disney-pinnacle-service'
import { WhaleTrackingService } from './whale-tracking-service'

/**
 * Centralized validation service for all enhanced data models
 */
export class ValidationService {
  
  /**
   * Validate enhanced collection data
   */
  static validateEnhancedCollection(collection: EnhancedFlowCollection): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Basic collection validation
    if (!collection.id || collection.id.trim() === '') {
      errors.push({
        field: 'id',
        message: 'Collection ID is required',
        code: 'MISSING_ID'
      })
    }

    if (!collection.name || collection.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Collection name is required',
        code: 'MISSING_NAME'
      })
    }

    // Validate numeric fields
    if (collection.floorPrice < 0) {
      errors.push({
        field: 'floorPrice',
        message: 'Floor price cannot be negative',
        code: 'NEGATIVE_FLOOR_PRICE'
      })
    }

    if (collection.volume24h < 0) {
      errors.push({
        field: 'volume24h',
        message: '24h volume cannot be negative',
        code: 'NEGATIVE_VOLUME'
      })
    }

    if (collection.whaleCount < 0) {
      errors.push({
        field: 'whaleCount',
        message: 'Whale count cannot be negative',
        code: 'NEGATIVE_WHALE_COUNT'
      })
    }

    // Validate market health score
    if (collection.marketHealth) {
      const health = collection.marketHealth
      if (health.liquidityScore < 0 || health.liquidityScore > 100) {
        errors.push({
          field: 'marketHealth.liquidityScore',
          message: 'Liquidity score must be between 0 and 100',
          code: 'INVALID_LIQUIDITY_SCORE'
        })
      }

      if (health.volatilityScore < 0 || health.volatilityScore > 100) {
        errors.push({
          field: 'marketHealth.volatilityScore',
          message: 'Volatility score must be between 0 and 100',
          code: 'INVALID_VOLATILITY_SCORE'
        })
      }

      if (!['healthy', 'volatile', 'illiquid', 'manipulated'].includes(health.overallHealth)) {
        errors.push({
          field: 'marketHealth.overallHealth',
          message: 'Invalid overall health status',
          code: 'INVALID_HEALTH_STATUS'
        })
      }
    }

    // Validate rarity distribution
    if (collection.rarityDistribution) {
      const totalPercentage = collection.rarityDistribution.reduce((sum, tier) => sum + tier.percentage, 0)
      if (Math.abs(totalPercentage - 100) > 0.1) {
        warnings.push({
          field: 'rarityDistribution',
          message: 'Rarity distribution percentages should sum to 100%',
          suggestion: 'Verify rarity calculation logic'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate enhanced NFT data
   */
  static validateEnhancedNFT(nft: EnhancedFlowNFT): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Basic NFT validation
    if (!nft.id || nft.id.trim() === '') {
      errors.push({
        field: 'id',
        message: 'NFT ID is required',
        code: 'MISSING_ID'
      })
    }

    if (!nft.collectionId || nft.collectionId.trim() === '') {
      errors.push({
        field: 'collectionId',
        message: 'Collection ID is required',
        code: 'MISSING_COLLECTION_ID'
      })
    }

    if (nft.currentPrice < 0) {
      errors.push({
        field: 'currentPrice',
        message: 'Current price cannot be negative',
        code: 'NEGATIVE_PRICE'
      })
    }

    if (nft.serialNumber <= 0) {
      errors.push({
        field: 'serialNumber',
        message: 'Serial number must be positive',
        code: 'INVALID_SERIAL_NUMBER'
      })
    }

    // Validate wallet address format
    if (nft.owner && !WhaleTrackingService.validateWalletAddress(nft.owner)) {
      errors.push({
        field: 'owner',
        message: 'Invalid wallet address format',
        code: 'INVALID_WALLET_ADDRESS'
      })
    }

    // Validate rarity analysis
    if (nft.rarityAnalysis) {
      const rarity = nft.rarityAnalysis
      if (rarity.rarityScore < 0) {
        errors.push({
          field: 'rarityAnalysis.rarityScore',
          message: 'Rarity score cannot be negative',
          code: 'NEGATIVE_RARITY_SCORE'
        })
      }

      if (rarity.rarityRank <= 0) {
        errors.push({
          field: 'rarityAnalysis.rarityRank',
          message: 'Rarity rank must be positive',
          code: 'INVALID_RARITY_RANK'
        })
      }

      if (rarity.rarityRank > rarity.totalSupply) {
        errors.push({
          field: 'rarityAnalysis.rarityRank',
          message: 'Rarity rank cannot exceed total supply',
          code: 'RANK_EXCEEDS_SUPPLY'
        })
      }
    }

    // Validate market position
    if (nft.marketPosition) {
      const position = nft.marketPosition
      if (position.percentileRank < 0 || position.percentileRank > 100) {
        errors.push({
          field: 'marketPosition.percentileRank',
          message: 'Percentile rank must be between 0 and 100',
          code: 'INVALID_PERCENTILE_RANK'
        })
      }

      if (!['undervalued', 'fairly_valued', 'overvalued'].includes(position.priceComparison)) {
        errors.push({
          field: 'marketPosition.priceComparison',
          message: 'Invalid price comparison value',
          code: 'INVALID_PRICE_COMPARISON'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate Disney Pinnacle NFT (delegates to Disney service)
   */
  static validateDisneyNFT(nft: DisneyPinnacleNFT): ValidationResult {
    // First validate as enhanced NFT
    const baseValidation = this.validateEnhancedNFT(nft)
    
    // Then validate Disney-specific fields
    const disneyValidation = DisneyPinnacleService.validateDisneyNFT(nft)
    
    // Combine results
    return {
      isValid: baseValidation.isValid && disneyValidation.isValid,
      errors: [...baseValidation.errors, ...disneyValidation.errors],
      warnings: [...baseValidation.warnings, ...disneyValidation.warnings]
    }
  }

  /**
   * Validate whale activity (delegates to whale service)
   */
  static validateWhaleActivity(activity: WhaleActivity): ValidationResult {
    return WhaleTrackingService.validateWhaleActivity(activity)
  }

  /**
   * Validate price alert data
   */
  static validatePriceAlert(alert: PriceAlert): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Validate required fields
    if (!alert.id || alert.id.trim() === '') {
      errors.push({
        field: 'id',
        message: 'Alert ID is required',
        code: 'MISSING_ID'
      })
    }

    if (!alert.userId || alert.userId.trim() === '') {
      errors.push({
        field: 'userId',
        message: 'User ID is required',
        code: 'MISSING_USER_ID'
      })
    }

    // Validate alert type
    const validAlertTypes = ['floor_price', 'volume_spike', 'whale_movement', 'specific_sale', 'rarity_change']
    if (!validAlertTypes.includes(alert.alertType)) {
      errors.push({
        field: 'alertType',
        message: 'Invalid alert type',
        code: 'INVALID_ALERT_TYPE'
      })
    }

    // Validate condition
    if (alert.condition) {
      const condition = alert.condition
      const validOperators = ['above', 'below', 'change_percent', 'equals']
      if (!validOperators.includes(condition.operator)) {
        errors.push({
          field: 'condition.operator',
          message: 'Invalid condition operator',
          code: 'INVALID_OPERATOR'
        })
      }

      if (typeof condition.value !== 'number') {
        errors.push({
          field: 'condition.value',
          message: 'Condition value must be a number',
          code: 'INVALID_CONDITION_VALUE'
        })
      }

      const validComparisonTypes = ['absolute', 'percentage', 'moving_average']
      if (!validComparisonTypes.includes(condition.comparisonType)) {
        errors.push({
          field: 'condition.comparisonType',
          message: 'Invalid comparison type',
          code: 'INVALID_COMPARISON_TYPE'
        })
      }
    }

    // Validate metadata
    if (alert.metadata) {
      const metadata = alert.metadata
      if (!metadata.name || metadata.name.trim() === '') {
        errors.push({
          field: 'metadata.name',
          message: 'Alert name is required',
          code: 'MISSING_ALERT_NAME'
        })
      }

      const validPriorities = ['low', 'medium', 'high']
      if (!validPriorities.includes(metadata.priority)) {
        errors.push({
          field: 'metadata.priority',
          message: 'Invalid priority level',
          code: 'INVALID_PRIORITY'
        })
      }

      const validNotificationMethods = ['browser', 'email', 'webhook']
      if (metadata.notificationMethods) {
        const invalidMethods = metadata.notificationMethods.filter(
          method => !validNotificationMethods.includes(method)
        )
        if (invalidMethods.length > 0) {
          errors.push({
            field: 'metadata.notificationMethods',
            message: `Invalid notification methods: ${invalidMethods.join(', ')}`,
            code: 'INVALID_NOTIFICATION_METHODS'
          })
        }
      }

      if (metadata.cooldownPeriod < 0) {
        errors.push({
          field: 'metadata.cooldownPeriod',
          message: 'Cooldown period cannot be negative',
          code: 'NEGATIVE_COOLDOWN'
        })
      }
    }

    // Warnings
    if (alert.triggerCount > 100) {
      warnings.push({
        field: 'triggerCount',
        message: 'Alert has triggered many times',
        suggestion: 'Consider adjusting alert conditions to reduce noise'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate portfolio metrics
   */
  static validatePortfolioMetrics(metrics: PortfolioMetrics): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // Validate numeric fields
    if (metrics.totalValue < 0) {
      errors.push({
        field: 'totalValue',
        message: 'Total portfolio value cannot be negative',
        code: 'NEGATIVE_TOTAL_VALUE'
      })
    }

    if (metrics.totalCost < 0) {
      errors.push({
        field: 'totalCost',
        message: 'Total cost cannot be negative',
        code: 'NEGATIVE_TOTAL_COST'
      })
    }

    // Validate collection breakdown
    if (metrics.collectionBreakdown) {
      const totalAllocation = metrics.collectionBreakdown.reduce((sum, holding) => sum + holding.allocation, 0)
      if (Math.abs(totalAllocation - 100) > 0.1) {
        warnings.push({
          field: 'collectionBreakdown',
          message: 'Collection allocations should sum to 100%',
          suggestion: 'Verify allocation calculation logic'
        })
      }

      // Validate individual holdings
      metrics.collectionBreakdown.forEach((holding, index) => {
        if (holding.nftCount <= 0) {
          errors.push({
            field: `collectionBreakdown[${index}].nftCount`,
            message: 'NFT count must be positive',
            code: 'INVALID_NFT_COUNT'
          })
        }

        if (holding.allocation < 0 || holding.allocation > 100) {
          errors.push({
            field: `collectionBreakdown[${index}].allocation`,
            message: 'Allocation must be between 0 and 100',
            code: 'INVALID_ALLOCATION'
          })
        }
      })
    }

    // Validate performance metrics
    if (metrics.performanceMetrics) {
      const perf = metrics.performanceMetrics
      if (perf.averageHoldingPeriod < 0) {
        errors.push({
          field: 'performanceMetrics.averageHoldingPeriod',
          message: 'Average holding period cannot be negative',
          code: 'NEGATIVE_HOLDING_PERIOD'
        })
      }

      if (perf.turnoverRate < 0) {
        errors.push({
          field: 'performanceMetrics.turnoverRate',
          message: 'Turnover rate cannot be negative',
          code: 'NEGATIVE_TURNOVER_RATE'
        })
      }

      if (perf.diversificationScore < 0 || perf.diversificationScore > 100) {
        errors.push({
          field: 'performanceMetrics.diversificationScore',
          message: 'Diversification score must be between 0 and 100',
          code: 'INVALID_DIVERSIFICATION_SCORE'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Validate wallet address format
   */
  static validateWalletAddress(address: string): ValidationResult {
    const errors: ValidationError[] = []
    
    if (!WhaleTrackingService.validateWalletAddress(address)) {
      errors.push({
        field: 'address',
        message: 'Invalid Flow wallet address format',
        code: 'INVALID_WALLET_ADDRESS'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    }
  }

  /**
   * Validate collection ID format
   */
  static validateCollectionId(collectionId: string): ValidationResult {
    const errors: ValidationError[] = []
    
    if (!collectionId || collectionId.trim() === '') {
      errors.push({
        field: 'collectionId',
        message: 'Collection ID cannot be empty',
        code: 'EMPTY_COLLECTION_ID'
      })
    } else if (collectionId.length < 3) {
      errors.push({
        field: 'collectionId',
        message: 'Collection ID must be at least 3 characters long',
        code: 'COLLECTION_ID_TOO_SHORT'
      })
    } else if (collectionId.length > 100) {
      errors.push({
        field: 'collectionId',
        message: 'Collection ID cannot exceed 100 characters',
        code: 'COLLECTION_ID_TOO_LONG'
      })
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(collectionId)) {
      errors.push({
        field: 'collectionId',
        message: 'Collection ID can only contain letters, numbers, hyphens, and underscores',
        code: 'INVALID_COLLECTION_ID_FORMAT'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    }
  }

  /**
   * Validate NFT ID format
   */
  static validateNFTId(nftId: string): ValidationResult {
    const errors: ValidationError[] = []
    
    if (!nftId || nftId.trim() === '') {
      errors.push({
        field: 'nftId',
        message: 'NFT ID cannot be empty',
        code: 'EMPTY_NFT_ID'
      })
    } else if (nftId.length < 3) {
      errors.push({
        field: 'nftId',
        message: 'NFT ID must be at least 3 characters long',
        code: 'NFT_ID_TOO_SHORT'
      })
    } else if (nftId.length > 100) {
      errors.push({
        field: 'nftId',
        message: 'NFT ID cannot exceed 100 characters',
        code: 'NFT_ID_TOO_LONG'
      })
    } else if (!/^[a-zA-Z0-9\-_\.]+$/.test(nftId)) {
      errors.push({
        field: 'nftId',
        message: 'NFT ID can only contain letters, numbers, hyphens, underscores, and dots',
        code: 'INVALID_NFT_ID_FORMAT'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    }
  }

  /**
   * Sanitize user input data
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return ''
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/script/gi, '') // Remove script tags content
      .substring(0, 1000) // Limit length
  }

  /**
   * Validate and sanitize search query
   */
  static validateSearchQuery(query: string): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    if (!query || query.trim() === '') {
      errors.push({
        field: 'query',
        message: 'Search query cannot be empty',
        code: 'EMPTY_QUERY'
      })
    }

    if (query.length > 100) {
      warnings.push({
        field: 'query',
        message: 'Search query is very long',
        suggestion: 'Consider shortening the query for better results'
      })
    }

    // Check for potential injection attempts
    const suspiciousPatterns = [
      /script/i,
      /javascript/i,
      /vbscript/i,
      /onload/i,
      /onerror/i
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(query)) {
        errors.push({
          field: 'query',
          message: 'Query contains potentially malicious content',
          code: 'SUSPICIOUS_QUERY'
        })
        break
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Batch validate multiple items
   */
  static batchValidate<T>(
    items: T[],
    validator: (item: T) => ValidationResult
  ): { valid: T[]; invalid: Array<{ item: T; validation: ValidationResult }> } {
    const valid: T[] = []
    const invalid: Array<{ item: T; validation: ValidationResult }> = []

    for (const item of items) {
      const validation = validator(item)
      if (validation.isValid) {
        valid.push(item)
      } else {
        invalid.push({ item, validation })
      }
    }

    return { valid, invalid }
  }
}