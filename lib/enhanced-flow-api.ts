/**
 * Enhanced Flow API - Main export file
 * Provides access to all enhanced data models, services, and utilities
 */

// Export all enhanced types
export * from './enhanced-flow-types'

// Import services
import { DisneyPinnacleService } from './disney-pinnacle-service'
import { WhaleTrackingService } from './whale-tracking-service'
import { ValidationService } from './validation-service'

// Export services
export { DisneyPinnacleService, WhaleTrackingService, ValidationService }

// Export enhanced API functions
export * from './flow-api'

// Utility functions for working with enhanced data
export class EnhancedFlowAPI {
  /**
   * Initialize services with configuration
   */
  static initialize(config: {
    disneyApiKey?: string
    whaleThreshold?: number
    cacheEnabled?: boolean
  } = {}) {
    console.log('Enhanced Flow API initialized with config:', config)
    
    // In a real implementation, this would configure the services
    // with API keys, thresholds, and other settings
  }

  /**
   * Health check for all services
   */
  static async healthCheck(): Promise<{
    api: boolean
    disney: boolean
    whale: boolean
    validation: boolean
  }> {
    try {
      // Test basic API functionality
      const collections = await import('./flow-api').then(api => api.getCollections())
      const apiHealthy = collections.length > 0

      // Test Disney service
      const disneyHealthy = DisneyPinnacleService.validateRenderID('DP-S1-MICKEY-001')

      // Test whale service
      const whaleHealthy = WhaleTrackingService.validateWalletAddress('0x1234567890abcdef')

      // Test validation service
      const validationHealthy = ValidationService.validateWalletAddress('0x1234567890abcdef').isValid

      return {
        api: apiHealthy,
        disney: disneyHealthy,
        whale: whaleHealthy,
        validation: validationHealthy
      }
    } catch (error) {
      console.error('Health check failed:', error)
      return {
        api: false,
        disney: false,
        whale: false,
        validation: false
      }
    }
  }

  /**
   * Get cache statistics from all services
   */
  static getCacheStats() {
    return {
      disney: DisneyPinnacleService.getCacheStats(),
      whale: WhaleTrackingService.getCacheStats()
    }
  }

  /**
   * Clear all caches
   */
  static clearAllCaches() {
    DisneyPinnacleService.clearImageCache()
    WhaleTrackingService.clearCaches()
    console.log('All caches cleared')
  }
}

// Default export for convenience
export default EnhancedFlowAPI