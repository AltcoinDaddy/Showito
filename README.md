# Showito - Flow NFT Analytics Platform

<div align="center">
  <img src="/public/showito-logo.png" alt="Showito Logo" width="200" height="200" />
  
  **Real-time analytics and portfolio tracking for the Flow blockchain NFT ecosystem**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Flow](https://img.shields.io/badge/Flow-Blockchain-green?style=flat-square&logo=flow)](https://flow.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.9-blue?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
</div>

## 🌟 Overview

Showito is a comprehensive Flow blockchain NFT analytics platform that provides real-time insights, portfolio tracking, and market intelligence for the Flow ecosystem. Built with a brutalist design philosophy and performance-first approach, Showito delivers professional-grade analytics for NFT traders, collectors, and market researchers.

### 🎯 Key Features

- **📊 Real-time Analytics** - Live floor prices, volumes, and market health across Flow collections
- **💼 Portfolio Tracking** - Connect wallets to monitor NFT holdings and P&L calculations
- **🐋 Whale Tracking** - Monitor large wallet movements and market influence
- **🔔 Price Alerts** - Custom alerts for floor price changes and volume spikes
- **📈 Market Intelligence** - Discover trending collections and analyze market sentiment
- **🎨 Multi-Collection Support** - NBA Top Shot, NFL All Day, UFC Strike, Flovatar, and more
- **📱 Responsive Design** - Optimized for desktop and mobile experiences

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Flow wallet (for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/showito.git
   cd showito
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   NEXT_PUBLIC_FLOW_NETWORK=mainnet
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4.1.9** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization library

#### Blockchain Integration
- **Flow Client Library (FCL)** - Flow blockchain interaction
- **Cadence Scripts** - Smart contract queries
- **Find Labs API** - Real marketplace data
- **Flow REST API** - Blockchain data access

#### State Management
- **React Context** - Wallet and app state
- **React Hook Form** - Form handling
- **Zod** - Schema validation

#### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package management

### Project Structure

```
showito/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── collections/       # Collection browsing
│   ├── portfolio/         # User portfolio
│   ├── alerts/           # Price alerts
│   └── api/              # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── charts/           # Data visualization
│   └── widgets/          # Dashboard widgets
├── lib/                  # Utilities and services
│   ├── flow-api.ts       # Flow blockchain API
│   ├── real-flow-api.ts  # Real data integration
│   ├── cadence/          # Cadence scripts
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── .kiro/               # Kiro IDE specifications
│   └── specs/           # Feature specifications
└── public/              # Static assets
```

## 🔧 Configuration

### Flow Network Configuration

The app supports both mainnet and testnet configurations:

```typescript
// lib/flow-config.ts
export const FLOW_CONFIG = {
  mainnet: {
    accessNode: "https://rest-mainnet.onflow.org",
    contracts: {
      topShot: "0x0b2a3299cc857e29",
      allDay: "0xe4cf4bdc1751c65d",
      // ... other contracts
    }
  },
  testnet: {
    // Testnet configuration
  }
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_FLOW_NETWORK` | Flow network (mainnet/testnet) | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `SUPABASE_URL` | Supabase project URL | Optional |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

## 📊 Features Deep Dive

### Real-time Analytics Dashboard

The dashboard provides comprehensive market insights:

- **Collection Overview** - Floor prices, 24h volume, sales count
- **Market Health Indicators** - Liquidity, volatility, whale influence
- **Price Charts** - Interactive historical price data
- **Volume Analysis** - Trading volume trends and patterns

### Portfolio Tracking

Connect your Flow wallet to access:

- **Holdings Overview** - All NFTs across supported collections
- **P&L Calculations** - Realized and unrealized gains/losses
- **Rarity Analysis** - NFT rarity scores and rankings
- **Value Tracking** - Portfolio value changes over time

### Whale Tracking System

Monitor large wallet activities:

- **Whale Identification** - Wallets with 100+ NFTs
- **Transaction Monitoring** - Large movements ($10k+)
- **Market Impact Analysis** - Whale influence on prices
- **Activity Feeds** - Real-time whale transaction updates

### Price Alert System

Stay informed with custom alerts:

- **Floor Price Alerts** - Percentage or absolute thresholds
- **Volume Spike Notifications** - Unusual trading activity
- **Whale Movement Alerts** - Large wallet transactions
- **Collection-specific Alerts** - Targeted notifications

## 🎨 Design System

Showito follows a brutalist design philosophy:

### Visual Principles
- **High Contrast** - Black backgrounds with white borders
- **Monospace Typography** - JetBrains Mono for technical feel
- **Sharp Edges** - Minimal rounded corners
- **Bold Elements** - Thick borders and strong visual hierarchy

### Color Palette
```css
/* Primary Colors */
--background: 0 0% 3.9%;
--foreground: 0 0% 98%;
--card: 0 0% 3.9%;
--border: 0 0% 14.9%;

/* Accent Colors */
--primary: 0 0% 98%;
--secondary: 0 0% 14.9%;
--muted: 0 0% 14.9%;
```

### Typography
- **Primary Font** - Geist (sans-serif)
- **Display Font** - Space Grotesk
- **Monospace Font** - JetBrains Mono

## 🔌 API Integration

### Flow Blockchain APIs

#### Collection Data
```typescript
// Get real-time collection data
const collections = await getCollections()

// Get specific collection
const collection = await getCollection('nba-top-shot')
```

#### User Portfolio
```typescript
// Get user's NFT portfolio
const portfolio = await getUserPortfolio(walletAddress)

// Get Flow balance
const balance = await getUserFlowBalance(walletAddress)
```

#### Market Activity
```typescript
// Get recent market activity
const activity = await getMarketActivity(50)

// Get collection-specific activity
const collectionActivity = await getCollectionActivity('nba-top-shot')
```

### External APIs

#### Find Labs Integration
```typescript
// Real marketplace data
const marketData = await fetchFromFindLabsAPI()
```

#### Disney Pinnacle Support
```typescript
// Disney NFT image rendering
const disneyNFTs = await getDisneyPinnacleNFTs(20)
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

```
tests/
├── components/           # Component tests
├── lib/                 # Utility function tests
├── integration/         # Integration tests
└── e2e/                # End-to-end tests
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Configure environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   npx vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Start production server**
   ```bash
   pnpm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |
| `pnpm type-check` | Run TypeScript checks |

### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

### Git Hooks

Pre-commit hooks ensure code quality:

- **Lint-staged** - Lint only staged files
- **Type checking** - Ensure TypeScript compliance
- **Test validation** - Run relevant tests

## 📈 Performance

### Optimization Strategies

- **Code Splitting** - Dynamic imports for large components
- **Image Optimization** - Next.js Image component
- **Caching** - API response caching (30s TTL)
- **Virtual Scrolling** - Large NFT lists
- **Memoization** - Expensive calculations

### Performance Metrics

- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🔒 Security

### Security Measures

- **Wallet Security** - Minimal permission requests
- **API Rate Limiting** - Prevent abuse
- **Input Validation** - Zod schema validation
- **CORS Configuration** - Proper cross-origin setup
- **Environment Variables** - Sensitive data protection

### Privacy Protection

- **Address Anonymization** - Truncated wallet addresses
- **Data Encryption** - Sensitive alert conditions
- **GDPR Compliance** - Data deletion capabilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Guidelines

- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Add JSDoc comments for public APIs

## 📚 Documentation

### Additional Resources

- [Flow Blockchain Documentation](https://docs.onflow.org/)
- [FCL (Flow Client Library)](https://docs.onflow.org/fcl/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### API Documentation

Detailed API documentation is available at `/docs/api` when running the development server.

## 🐛 Troubleshooting

### Common Issues

#### Flow Connection Issues
```bash
# Clear FCL cache
localStorage.clear()

# Check network configuration
console.log(fcl.config())
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
pnpm install
```

#### TypeScript Errors
```bash
# Check TypeScript configuration
pnpm type-check

# Restart TypeScript server in VS Code
Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
```

## 📊 Analytics & Monitoring

### Performance Monitoring

- **Vercel Analytics** - Core Web Vitals tracking
- **Error Tracking** - Sentry integration (optional)
- **User Analytics** - Privacy-focused analytics

### Health Checks

- **API Health** - `/api/health` endpoint
- **Database Health** - Connection monitoring
- **External API Status** - Find Labs API monitoring

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Advanced Charting** - TradingView integration
- [ ] **Social Features** - Collection discussions
- [ ] **Mobile App** - React Native version
- [ ] **API Access** - Public API for developers
- [ ] **Machine Learning** - Price prediction models
- [ ] **Multi-chain Support** - Ethereum, Polygon integration

### Version History

- **v1.0.0** - Initial release with basic analytics
- **v1.1.0** - Added whale tracking and alerts
- **v1.2.0** - Enhanced portfolio tracking
- **v1.3.0** - Real-time data integration
- **v2.0.0** - Complete UI redesign (current)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Flow Team** - For the amazing blockchain platform
- **NBA Top Shot** - Pioneering Flow NFTs
- **Find Labs** - Marketplace data API
- **Vercel** - Hosting and deployment platform
- **Open Source Community** - For the incredible tools and libraries

## 📞 Support

### Getting Help

- **Documentation** - Check this README and `/docs`
- **GitHub Issues** - Report bugs and request features
- **Discord** - Join our community server
- **Email** - support@showito.app

### Community

- **Discord** - [Join our server](https://discord.gg/showito)
- **Twitter** - [@ShowitoApp](https://twitter.com/ShowitoApp)
- **GitHub** - [Star the repo](https://github.com/your-username/showito)

---

<div align="center">
  <p>Built with ❤️ for the Flow NFT community</p>
  <p>
    <a href="https://showito.app">Website</a> •
    <a href="https://docs.showito.app">Documentation</a> •
    <a href="https://discord.gg/showito">Discord</a> •
    <a href="https://twitter.com/ShowitoApp">Twitter</a>
  </p>
</div>