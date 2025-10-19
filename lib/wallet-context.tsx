"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  address: string | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const savedAddress = localStorage.getItem("wallet_address")
    if (savedAddress) {
      setAddress(savedAddress)
      setIsConnected(true)
    }
  }, [])

  const connect = async () => {
    try {
      // In production, this would integrate with Dapper, Blocto, or Lilico wallet SDKs
      // For now, simulating wallet connection
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 18)
      setAddress(mockAddress)
      setIsConnected(true)
      localStorage.setItem("wallet_address", mockAddress)
      console.log("[v0] Wallet connected successfully:", mockAddress)
    } catch (error) {
      console.error("[v0] Failed to connect wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("wallet_address")
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
