"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as fcl from "@onflow/fcl"
import { configureFlow } from "./real-flow-integration"

interface RealWalletContextType {
  user: any | null
  address: string | null
  isConnected: boolean
  isLoading: boolean
  connect: () => Promise<void>
  disconnect: () => void
  signTransaction: (cadence: string, args: any[]) => Promise<string>
}

const RealWalletContext = createContext<RealWalletContextType | undefined>(undefined)

export function RealWalletProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Configure Flow on mount
    configureFlow()

    // Subscribe to authentication state changes
    const unsubscribe = fcl.currentUser.subscribe((user: any) => {
      setUser(user)
      setAddress(user?.addr || null)
      setIsConnected(!!user?.addr)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const connect = async () => {
    try {
      setIsLoading(true)
      await fcl.authenticate()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      setIsLoading(false)
    }
  }

  const disconnect = async () => {
    try {
      await fcl.unauthenticate()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  const signTransaction = async (cadence: string, args: any[]): Promise<string> => {
    try {
      const transactionId = await fcl.mutate({
        cadence,
        args: (arg: any, t: any) => args,
        proposer: fcl.authz,
        payer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 1000
      })

      // Wait for transaction to be sealed
      const transaction = await fcl.tx(transactionId).onceSealed()
      return transaction.transactionId
    } catch (error) {
      console.error("Transaction failed:", error)
      throw error
    }
  }

  return (
    <RealWalletContext.Provider 
      value={{ 
        user, 
        address, 
        isConnected, 
        isLoading, 
        connect, 
        disconnect, 
        signTransaction 
      }}
    >
      {children}
    </RealWalletContext.Provider>
  )
}

export function useRealWallet() {
  const context = useContext(RealWalletContext)
  if (context === undefined) {
    throw new Error("useRealWallet must be used within a RealWalletProvider")
  }
  return context
}