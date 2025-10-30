"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/wallet-context"
import { WalletModal } from "@/components/wallet-modal"
import { useState } from "react"
import { usePathname } from "next/navigation"

export function DashboardHeader() {
  const { address, isConnected, isLoading, disconnect } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const pathname = usePathname()

  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="h-8 w-8 bg-foreground" />
                <span className="text-xl font-bold">Showito</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/dashboard") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/collections"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/collections") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Collections
                </Link>
                <Link
                  href="/settings"
                  className={`text-sm font-medium transition-colors ${
                    isActive("/settings") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Settings
                </Link>
              </nav>
            </div>

            {isLoading ? (
              <Button variant="outline" size="sm" disabled>
                Connecting...
              </Button>
            ) : isConnected ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-mono bg-transparent">
                  {formatAddress(address!)}
                </Button>
                <Button variant="ghost" size="sm" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setShowWalletModal(true)}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <WalletModal open={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  )
}
