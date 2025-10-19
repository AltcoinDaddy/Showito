# Design Document

## Overview

The Enhanced Analytics Dashboard builds upon the existing Showito platform to provide comprehensive multi-collection NFT analytics for Flow blockchain. The design focuses on real-time data visualization, whale tracking, and advanced portfolio management while maintaining the platform's brutalist aesthetic and performance-first approach.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │  External APIs  │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│  (Flow/Find)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   Supabase       │    │   Disney API    │
│   Connection    │    │   (Cache/DB)     │    │   (Images)      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Data Flow Architecture

1. **Real-time Updates**: WebSocket connections for live price feeds
2. **API Aggregation**: Backend service aggregates data from multiple sources
3. **Caching Layer**: Supabase for optimized query performance
4. **Client State**: React Context for real-time UI updates

## Components and Interfaces

### Core Dashboard Components

#### 1. Multi-Collection Overview Widget
```typescript
interface CollectionOverviewProps {
  collections: FlowCollection[]
  selectedCollection?: string
  onCollectionSelect: (id: string) => void
}

interface CollectionMetrics {
  floorPrice: number
  volume24h: number
  sales24h: number
  marketCap: number
  change24h: number
  whaleActivity: number
}
```

#### 2. Advanced Chart Components
```typescript
interface ChartData {
  timestamp: string
  value: number
  volume?: number
  metadata?: Record<string, any>
}

interface PriceChartProps {
  data: ChartData[]
  timeRange: '24h' | '7d' | '30d' | '90d'
  collection?: string
  showVolume?: boolean
}

interface HeatmapProps {
  data: TradeActivity[]
  dimensions: 'price-time' | 'wallet-volume' | 'rarity-price'
  colorScheme: 'intensity' | 'profit-loss'
}
```

#### 3. Whale Tracking Components
```typescript
interface WhaleActivity {
  walletAddress: string
  transactionType: 'buy' | 'sell' | 'transfer'
  nftId: string
  collectionId: string
  amount: number
  timestamp: string
  isLargeTransaction: boolean
}

interface WhaleTrackerProps {
  activities: WhaleActivity[]
  filters: WhaleFilters
  onFilterChange: (filters: WhaleFilters) => void
}
```

#### 4. Alert Management System
```typescript
interface PriceAlert {
  id: string
  userId: string
  collectionId?: string
  nftId?: string
  alertType: 'floor_price' | 'volume_spike' | 'whale_movement' | 'specific_sale'
  condition: AlertCondition
  isActive: boolean
  createdAt: string
}

interface AlertCondition {
  operator: 'above' | 'below' | 'change_percent'
  value: number
  timeframe?: string
}
```

### Enhanced Portfolio Components

#### 1. Portfolio Analytics Dashboard
```typescript
interface PortfolioMetrics {
  totalValue: number
  totalCost: number
  unrealizedPnL: number
  realizedPnL: number
  portfolioChange24h: number
  collectionBreakdown: CollectionHolding[]
  rarityDistribution: RarityBreakdown[]
}

interface CollectionHolding {
  collectionId: string
  collectionName: string
  nftCount: number
  totalValue: number
  averageRarity: number
  topNFT: FlowNFT
}
```

#### 2. NFT Rarity Analysis
```typescript
interface RarityAnalysis {
  rarityScore: number
  rarityRank: number
  totalSupply: number
  traitBreakdown: TraitRarity[]
  estimatedValue: number
  priceHistory: PricePoint[]
}

interface TraitRarity {
  traitType: string
  traitValue: string
  rarityPercentage: number
  floorPrice: number
}
```

## Data Models

### Enhanced Collection Model
```typescript
interface EnhancedFlowCollection extends FlowCollection {
  // Existing fields from base FlowCollection
  whaleCount: number
  averageHoldingPeriod: number
  rarityDistribution: RarityTier[]
  priceHistory: PriceHistoryPoint[]
  volumeHistory: VolumeHistoryPoint[]
  topTraits: TraitInfo[]
  marketHealth: MarketHealthScore
}

interface MarketHealthScore {
  liquidityScore: number // 0-100
  volatilityScore: number // 0-100
  whaleInfluence: number // 0-100
  overallHealth: 'healthy' | 'volatile' | 'illiquid' | 'manipulated'
}
```

### Disney Pinnacle Integration Model
```typescript
interface DisneyPinnacleNFT extends FlowNFT {
  renderID: string
  pinType: 'character' | 'moment' | 'collectible'
  series: string
  character?: string
  editionNumber: number
  totalEditions: number
  imageUrl: string // Generated from Disney endpoint
}

interface DisneyImageService {
  generateImageUrl(renderID: string, view: 'front' | 'back'): string
  validateRenderID(renderID: string): boolean
  getCachedImage(renderID: string): string | null
}
```

### Real-time Data Models
```typescript
interface WebSocketMessage {
  type: 'price_update' | 'new_sale' | 'whale_movement' | 'alert_trigger'
  collectionId?: string
  nftId?: string
  data: any
  timestamp: string
}

interface RealTimeUpdate {
  entityType: 'collection' | 'nft' | 'wallet'
  entityId: string
  updateType: 'price' | 'volume' | 'ownership' | 'metadata'
  newValue: any
  previousValue?: any
  timestamp: string
}
```

## Error Handling

### API Error Management
```typescript
interface APIErrorHandler {
  handleFlowAPIError(error: FlowAPIError): void
  handleDisneyAPIError(error: DisneyAPIError): void
  handleWebSocketError(error: WebSocketError): void
  fallbackToPolling(): void
  retryWithBackoff(operation: () => Promise<any>, maxRetries: number): Promise<any>
}

interface ErrorBoundaryState {
  hasError: boolean
  errorType: 'network' | 'data' | 'rendering' | 'websocket'
  fallbackMode: boolean
  lastSuccessfulUpdate: string
}
```

### Data Validation and Sanitization
```typescript
interface DataValidator {
  validateCollectionData(data: any): FlowCollection | null
  validateNFTData(data: any): FlowNFT | null
  validatePriceData(data: any): number | null
  sanitizeWalletAddress(address: string): string
  validateAlertConditions(alert: PriceAlert): boolean
}
```

## Testing Strategy

### Unit Testing
- **Component Testing**: Test all dashboard widgets with mock data
- **Utility Testing**: Validate data transformation and calculation functions
- **API Integration**: Mock external API responses for consistent testing
- **WebSocket Testing**: Simulate real-time data flows and connection failures

### Integration Testing
- **End-to-End Flows**: Test complete user journeys from wallet connection to alert creation
- **Cross-Collection Data**: Verify data consistency across multiple NFT collections
- **Real-time Updates**: Test WebSocket connections and fallback mechanisms
- **Performance Testing**: Validate dashboard performance with large datasets

### Visual Testing
- **Chart Rendering**: Verify Recharts visualizations render correctly with various data sets
- **Responsive Design**: Test dashboard layouts across different screen sizes
- **Theme Consistency**: Ensure brutalist design system is maintained across new components
- **Accessibility**: Validate color contrast and keyboard navigation for all interactive elements

### Load Testing
- **Concurrent Users**: Test dashboard performance with multiple simultaneous users
- **Data Volume**: Validate performance with large collections (500k+ NFTs)
- **Real-time Throughput**: Test WebSocket message handling under high frequency updates
- **Cache Performance**: Verify Supabase caching effectiveness under load

## Performance Considerations

### Frontend Optimization
- **Virtual Scrolling**: Implement for large NFT lists and transaction histories
- **Chart Optimization**: Use canvas rendering for complex visualizations
- **Data Pagination**: Implement infinite scroll for historical data
- **Memoization**: Cache expensive calculations and API responses
- **Bundle Splitting**: Code split dashboard components for faster initial loads

### Backend Optimization
- **Database Indexing**: Optimize Supabase queries for collection and NFT lookups
- **API Rate Limiting**: Implement intelligent rate limiting for external API calls
- **Data Aggregation**: Pre-calculate common metrics to reduce real-time computation
- **Caching Strategy**: Multi-layer caching (Redis, Supabase, CDN) for different data types

### Real-time Performance
- **WebSocket Connection Pooling**: Efficiently manage multiple client connections
- **Message Batching**: Group related updates to reduce UI thrashing
- **Selective Updates**: Only update UI components affected by data changes
- **Connection Management**: Implement reconnection logic with exponential backoff

## Security Considerations

### Wallet Integration Security
- **Address Validation**: Verify Flow wallet addresses before API calls
- **Permission Scoping**: Request minimal wallet permissions required
- **Session Management**: Secure handling of wallet connection state
- **Privacy Protection**: Hash or truncate sensitive wallet information in logs

### API Security
- **Rate Limiting**: Protect against API abuse and DoS attacks
- **Input Validation**: Sanitize all user inputs and API parameters
- **CORS Configuration**: Properly configure cross-origin requests
- **API Key Management**: Secure storage and rotation of external API keys

### Data Privacy
- **Wallet Address Anonymization**: Display truncated addresses in public views
- **Alert Data Protection**: Encrypt sensitive alert conditions
- **Analytics Privacy**: Aggregate user behavior data without personal identification
- **GDPR Compliance**: Implement data deletion and export capabilities