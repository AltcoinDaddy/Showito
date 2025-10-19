# Technology Stack

## Framework & Runtime
- **Next.js 15.2.4** with App Router
- **React 19** with TypeScript
- **Node.js** runtime environment

## Styling & UI
- **Tailwind CSS 4.1.9** for styling
- **Radix UI** components for accessibility and behavior
- **Class Variance Authority (CVA)** for component variants
- **Lucide React** for icons
- **Geist** and **Space Grotesk** fonts
- **JetBrains Mono** for monospace text

## State Management & Forms
- **React Hook Form** with **Zod** validation
- **React Context** for wallet state management
- **Next Themes** for theme switching

## Data Visualization
- **Recharts** for charts and analytics
- **Embla Carousel** for image carousels

## Flow Blockchain Integration
- **Flow REST API** for blockchain data
- **FCL (Flow Client Library)** patterns for wallet integration
- Mock data implementation (production would use real Flow APIs)

## Development Tools
- **TypeScript 5** with strict mode
- **ESLint** for code linting
- **PostCSS** for CSS processing
- **pnpm** for package management

## Common Commands
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Package management
pnpm install          # Install dependencies
pnpm add <package>    # Add new dependency
```

## Configuration Notes
- TypeScript errors ignored during builds (development setup)
- ESLint errors ignored during builds (development setup)
- Images unoptimized for static export compatibility
- Absolute imports configured with `@/*` alias