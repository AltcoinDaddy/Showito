# Project Structure

## Directory Organization

### `/app` - Next.js App Router
- **Route-based file structure** following Next.js 13+ conventions
- **Nested layouts** for consistent UI across route groups
- **API routes** in `/app/api` for backend functionality

```
app/
├── layout.tsx          # Root layout with fonts and providers
├── page.tsx           # Landing page
├── globals.css        # Global styles
├── dashboard/         # Dashboard section
├── collections/       # Collections browsing
├── nfts/             # Individual NFT pages
├── portfolio/        # User portfolio
├── alerts/           # Price alerts
├── trends/           # Market trends
├── settings/         # User settings
└── api/              # API endpoints
    └── flow/         # Flow blockchain API routes
```

### `/components` - Reusable Components
- **Feature components** for specific functionality
- **UI components** in `/components/ui` (shadcn/ui pattern)
- **Consistent naming**: kebab-case for files

```
components/
├── ui/               # Base UI components (buttons, cards, etc.)
├── app-sidebar.tsx   # Main navigation sidebar
├── *-widget.tsx      # Dashboard widgets
├── *-stats.tsx       # Statistics components
├── *-chart.tsx       # Data visualization
└── *-modal.tsx       # Modal dialogs
```

### `/lib` - Utilities & Configuration
- **Flow blockchain** integration and configuration
- **Utility functions** and shared logic
- **Context providers** for state management

```
lib/
├── utils.ts          # General utilities (cn, etc.)
├── flow-config.ts    # Flow network configuration
├── flow-api.ts       # Flow API functions and types
├── wallet-context.tsx # Wallet state management
└── cadence/          # Cadence scripts and transactions
```

### `/hooks` - Custom React Hooks
- **Reusable logic** extracted into custom hooks
- **UI-specific hooks** (mobile detection, toast, etc.)

## Naming Conventions

### Files & Directories
- **kebab-case** for all files and directories
- **Descriptive names** that indicate purpose
- **Consistent suffixes**: `-widget`, `-modal`, `-chart`, etc.

### Components
- **PascalCase** for component names
- **Descriptive prefixes** for related components
- **Export patterns**: Named exports for utilities, default for components

### API Routes
- **RESTful patterns** in `/app/api`
- **Nested structure** matching data hierarchy
- **Dynamic routes** using `[id]` syntax

## Import Patterns
- **Absolute imports** using `@/` alias
- **Grouped imports**: React, Next.js, then local imports
- **Type imports** using `import type` when possible

## Component Architecture
- **Composition over inheritance**
- **Props interfaces** defined inline or exported
- **Consistent prop patterns**: `className`, `children`, etc.
- **Error boundaries** and loading states where appropriate

## Flow Integration Patterns
- **Mock data** for development (real APIs in production)
- **Type-safe** Flow data structures
- **Consistent error handling** across Flow API calls
- **Address formatting** utilities for display