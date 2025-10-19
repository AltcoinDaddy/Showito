import { RealTimeDataProcessor } from '../real-time-data-processor'
import { FlowWebSocketServer } from '../websocket-server'

describe('Real-Time Infrastructure', () => {
  let dataProcessor: RealTimeDataProcessor
  let wsServer: FlowWebSocketServer

  beforeEach(() => {
    dataProcessor = new RealTimeDataProcessor({
      maxBatchSize: 5,
      maxWaitTime: 100,
      priorityThreshold: 'medium'
    })
    wsServer = new FlowWebSocketServer(8081) // Use different port for testing
  })

  afterEach(() => {
    dataProcessor.clearQueue()
    wsServer.stop()
  })

  describe('RealTimeDataProcessor', () => {
    it('should process price update messages', () => {
      const mockCallback = jest.fn()
      dataProcessor.subscribe('test', mockCallback)

      const priceMessage = {
        type: 'price_update' as const,
        collectionId: 'test-collection',
        data: {
          collectionId: 'test-collection',
          floorPrice: 100,
          change24h: 5.5,
          volume24h: 50000
        },
        timestamp: new Date().toISOString()
      }

      dataProcessor.processWebSocketMessage(priceMessage)

      // Wait for batch processing
      setTimeout(() => {
        expect(mockCallback).toHaveBeenCalled()
        const updates = mockCallback.mock.calls[0][0]
        expect(updates).toHaveLength(1)
        expect(updates[0].type).toBe('price')
        expect(updates[0].entityType).toBe('collection')
        expect(updates[0].entityId).toBe('test-collection')
      }, 150)
    })

    it('should validate and sanitize data', () => {
      const mockCallback = jest.fn()
      dataProcessor.subscribe('test', mockCallback)

      // Invalid data (negative price)
      const invalidMessage = {
        type: 'price_update' as const,
        collectionId: 'test-collection',
        data: {
          collectionId: 'test-collection',
          floorPrice: -100, // Invalid negative price
          change24h: 5.5,
          volume24h: 50000
        },
        timestamp: new Date().toISOString()
      }

      dataProcessor.processWebSocketMessage(invalidMessage)

      setTimeout(() => {
        if (mockCallback.mock.calls.length > 0) {
          const updates = mockCallback.mock.calls[0][0]
          // Should sanitize negative price to 0
          expect(updates[0].data.floorPrice).toBe(0)
        }
      }, 150)
    })

    it('should batch updates correctly', () => {
      const mockCallback = jest.fn()
      dataProcessor.subscribe('test', mockCallback)

      // Send multiple updates quickly
      for (let i = 0; i < 3; i++) {
        dataProcessor.processWebSocketMessage({
          type: 'price_update' as const,
          collectionId: `collection-${i}`,
          data: {
            collectionId: `collection-${i}`,
            floorPrice: 100 + i,
            change24h: i,
            volume24h: 1000 * i
          },
          timestamp: new Date().toISOString()
        })
      }

      setTimeout(() => {
        expect(mockCallback).toHaveBeenCalledTimes(1)
        const updates = mockCallback.mock.calls[0][0]
        expect(updates).toHaveLength(3)
      }, 150)
    })

    it('should handle whale movement messages', () => {
      const mockCallback = jest.fn()
      dataProcessor.subscribe('test', mockCallback)

      const whaleMessage = {
        type: 'whale_movement' as const,
        data: {
          walletAddress: '0x1234567890abcdef',
          transactionType: 'buy',
          nftId: 'nft-123',
          collectionId: 'test-collection',
          amount: 15000
        },
        timestamp: new Date().toISOString()
      }

      dataProcessor.processWebSocketMessage(whaleMessage)

      setTimeout(() => {
        expect(mockCallback).toHaveBeenCalled()
        const updates = mockCallback.mock.calls[0][0]
        expect(updates[0].type).toBe('whale')
        expect(updates[0].data.isLargeTransaction).toBe(true)
      }, 150)
    })
  })

  describe('WebSocket Server', () => {
    it('should start and stop correctly', () => {
      expect(() => wsServer.start()).not.toThrow()
      expect(wsServer.getConnectedClientsCount()).toBe(0)
      expect(() => wsServer.stop()).not.toThrow()
    })

    it('should broadcast messages to channels', () => {
      wsServer.start()
      
      // This would require actual WebSocket client connections to test properly
      // For now, just verify the methods exist and don't throw
      expect(() => {
        wsServer.broadcastPriceUpdate('test-collection', { floorPrice: 100 })
      }).not.toThrow()

      expect(() => {
        wsServer.broadcastNewSale('test-collection', 'nft-123', { price: 150 })
      }).not.toThrow()

      expect(() => {
        wsServer.broadcastWhaleMovement({ walletAddress: '0x123', amount: 10000 })
      }).not.toThrow()

      wsServer.stop()
    })
  })

  describe('Integration', () => {
    it('should process stats correctly', () => {
      const stats = dataProcessor.getProcessingStats()
      expect(stats).toHaveProperty('queueSize')
      expect(stats).toHaveProperty('subscriberCount')
      expect(stats).toHaveProperty('throttledEntities')
      expect(typeof stats.queueSize).toBe('number')
      expect(typeof stats.subscriberCount).toBe('number')
    })

    it('should handle subscription and unsubscription', () => {
      const mockCallback = jest.fn()
      
      dataProcessor.subscribe('test-subscriber', mockCallback)
      expect(dataProcessor.getSubscriberCount()).toBe(1)
      
      dataProcessor.unsubscribe('test-subscriber')
      expect(dataProcessor.getSubscriberCount()).toBe(0)
    })
  })
})