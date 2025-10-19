/**
 * Validation script to verify the enhanced data models and services work correctly
 * Run this to test the implementation without a full test runner
 */

import { DisneyPinnacleService } from './disney-pinnacle-service'
import { WhaleTrackingService } from './whale-tracking-service'
import { ValidationService } from './validation-service'
import EnhancedFlowAPI from './enhanced-flow-api'

async function validateImplementation() {
  console.log('🚀 Starting Enhanced Flow API validation...\n')

  let passed = 0
  let failed = 0

  function test(name: string, testFn: () => boolean | Promise<boolean>) {
    try {
      const result = testFn()
      if (result instanceof Promise) {
        return result.then(res => {
          if (res) {
            console.log(`✅ ${name}`)
            passed++
          } else {
            console.log(`❌ ${name}`)
            failed++
          }
        }).catch(err => {
          console.log(`❌ ${name} - Error: ${err.message}`)
          failed++
        })
      } else {
        if (result) {
          console.log(`✅ ${name}`)
          passed++
        } else {
          console.log(`❌ ${name}`)
          failed++
        }
      }
    } catch (error: any) {
      console.log(`❌ ${name} - Error: ${error.message}`)
      failed++
    }
  }

  // Disney Pinnacle Service Tests
  console.log('🎭 Testing Disney Pinnacle Service:')
  
  test('Disney render ID validation (valid)', () => 
    DisneyPinnacleService.validateRenderID('DP-S1-MICKEY-001')
  )
  
  test('Disney render ID validation (invalid)', () => 
    !DisneyPinnacleService.validateRenderID('invalid-id')
  )
  
  test('Disney image URL generation', () => {
    const url = DisneyPinnacleService.generateImageUrl('DP-S1-MICKEY-001')
    return url.includes('DP-S1-MICKEY-001') && url.includes('view=front')
  })

  test('Disney placeholder for invalid ID', () => {
    const url = DisneyPinnacleService.generateImageUrl('invalid')
    return url === '/placeholder-disney.svg'
  })

  // Whale Tracking Service Tests
  console.log('\n🐋 Testing Whale Tracking Service:')
  
  test('Whale wallet address validation (valid)', () => 
    WhaleTrackingService.validateWalletAddress('0x1234567890abcdef')
  )
  
  test('Whale wallet address validation (invalid)', () => 
    !WhaleTrackingService.validateWalletAddress('invalid-address')
  )
  
  test('Whale identification (high NFT count)', () => 
    WhaleTrackingService.isWhaleWallet(150, 30000)
  )
  
  test('Whale identification (high value)', () => 
    WhaleTrackingService.isWhaleWallet(50, 60000)
  )
  
  test('Non-whale identification', () => 
    !WhaleTrackingService.isWhaleWallet(50, 30000)
  )

  test('Whale activity creation', () => {
    const activity = WhaleTrackingService.createWhaleActivity(
      '0x1234567890abcdef',
      'buy',
      'nft-123',
      'collection-456',
      15000,
      'tx-hash-789'
    )
    return activity.walletAddress === '0x1234567890abcdef' && 
           activity.isLargeTransaction === true &&
           activity.amount === 15000
  })

  // Validation Service Tests
  console.log('\n✅ Testing Validation Service:')
  
  test('Wallet address validation (valid)', () => {
    const result = ValidationService.validateWalletAddress('0x1234567890abcdef')
    return result.isValid && result.errors.length === 0
  })
  
  test('Wallet address validation (invalid)', () => {
    const result = ValidationService.validateWalletAddress('invalid')
    return !result.isValid && result.errors.length > 0
  })
  
  test('Input sanitization', () => {
    const sanitized = ValidationService.sanitizeInput('<script>alert("xss")</script>')
    console.log('    Sanitized output:', JSON.stringify(sanitized))
    // Should remove script tags and content
    return !sanitized.includes('<script>') && !sanitized.includes('</script>')
  })
  
  test('Search query validation (valid)', () => {
    const result = ValidationService.validateSearchQuery('NBA Top Shot')
    return result.isValid
  })
  
  test('Search query validation (empty)', () => {
    const result = ValidationService.validateSearchQuery('')
    return !result.isValid
  })

  // Enhanced Flow API Tests
  console.log('\n🔧 Testing Enhanced Flow API:')
  
  test('API initialization', () => {
    try {
      EnhancedFlowAPI.initialize({
        disneyApiKey: 'test-key',
        whaleThreshold: 100,
        cacheEnabled: true
      })
      return true
    } catch {
      return false
    }
  })

  await test('Health check', async () => {
    const health = await EnhancedFlowAPI.healthCheck()
    return typeof health === 'object' && 
           'api' in health && 
           'disney' in health && 
           'whale' in health && 
           'validation' in health
  })

  test('Cache stats retrieval', () => {
    const stats = EnhancedFlowAPI.getCacheStats()
    return typeof stats === 'object' && 'disney' in stats && 'whale' in stats
  })

  test('Cache clearing', () => {
    try {
      EnhancedFlowAPI.clearAllCaches()
      return true
    } catch {
      return false
    }
  })

  // Wait for async tests to complete
  await new Promise(resolve => setTimeout(resolve, 100))

  // Summary
  console.log('\n📊 Validation Summary:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`)

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Enhanced Flow API implementation is working correctly.')
  } else {
    console.log('\n⚠️  Some tests failed. Please review the implementation.')
  }

  return failed === 0
}

// Run validation if this file is executed directly
if (require.main === module) {
  validateImplementation().then(success => {
    process.exit(success ? 0 : 1)
  }).catch(error => {
    console.error('Validation failed with error:', error)
    process.exit(1)
  })
}

export default validateImplementation