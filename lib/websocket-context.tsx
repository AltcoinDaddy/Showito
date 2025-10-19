'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { FlowWebSocketClient, WebSocketClientEvents } from './websocket-client'
import { WebSocketMessage } from './websocket-server'

interface WebSocketContextType {
  client: FlowWebSocketClient | null
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'
  lastMessage: WebSocketMessage | null
  isConnected: boolean
  subscribe: (channels: string[]) => void
  unsubscribe: (channels: string[]) => void
  sendMessage: (message: any) => void
  reconnect: () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
  url?: string
  initialSubscriptions?: string[]
  autoConnect?: boolean
}

export function WebSocketProvider({ 
  children, 
  url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080',
  initialSubscriptions = [],
  autoConnect = true
}: WebSocketProviderProps) {
  const [client, setClient] = useState<FlowWebSocketClient | null>(null)
  const [connectionState, setConnectionState] = useState<WebSocketContextType['connectionState']>('disconnected')
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const handleMessage = useCallback((message: WebSocketMessage) => {
    setLastMessage(message)
    
    // Log different message types for debugging
    switch (message.type) {
      case 'price_update':
        console.log('Price update received:', message.collectionId, message.data)
        break
      case 'new_sale':
        console.log('New sale received:', message.collectionId, message.nftId, message.data)
        break
      case 'whale_movement':
        console.log('Whale movement detected:', message.data)
        break
      case 'alert_trigger':
        console.log('Alert triggered:', message.data)
        break
    }
  }, [])

  const events: WebSocketClientEvents = {
    onOpen: () => {
      console.log('WebSocket connection established')
      setConnectionState('connected')
      setReconnectAttempts(0)
    },
    onClose: () => {
      console.log('WebSocket connection closed')
      setConnectionState('disconnected')
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
      setConnectionState('error')
    },
    onMessage: handleMessage,
    onReconnect: (attempt) => {
      console.log(`WebSocket reconnection attempt ${attempt}`)
      setConnectionState('reconnecting')
      setReconnectAttempts(attempt)
    },
    onReconnectFailed: () => {
      console.error('WebSocket reconnection failed')
      setConnectionState('error')
    }
  }

  useEffect(() => {
    if (!autoConnect) return

    const wsClient = new FlowWebSocketClient(
      {
        url,
        subscriptions: initialSubscriptions,
        reconnectInterval: 5000,
        maxReconnectAttempts: 10,
        pingInterval: 25000
      },
      events
    )

    setClient(wsClient)
    setConnectionState('connecting')
    wsClient.connect()

    return () => {
      wsClient.disconnect()
      setClient(null)
      setConnectionState('disconnected')
    }
  }, [url, autoConnect])

  const subscribe = useCallback((channels: string[]) => {
    client?.subscribe(channels)
  }, [client])

  const unsubscribe = useCallback((channels: string[]) => {
    client?.unsubscribe(channels)
  }, [client])

  const sendMessage = useCallback((message: any) => {
    client?.send(message)
  }, [client])

  const reconnect = useCallback(() => {
    if (client) {
      client.disconnect()
      setTimeout(() => {
        client.connect()
      }, 1000)
    }
  }, [client])

  const value: WebSocketContextType = {
    client,
    connectionState,
    lastMessage,
    isConnected: connectionState === 'connected',
    subscribe,
    unsubscribe,
    sendMessage,
    reconnect
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocketContext(): WebSocketContextType {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider')
  }
  return context
}

// Hook for subscribing to specific channels
export function useWebSocketSubscription(channels: string[]) {
  const { subscribe, unsubscribe, lastMessage, isConnected } = useWebSocketContext()
  const [messages, setMessages] = useState<WebSocketMessage[]>([])

  useEffect(() => {
    if (isConnected && channels.length > 0) {
      subscribe(channels)
      
      return () => {
        unsubscribe(channels)
      }
    }
  }, [channels, isConnected, subscribe, unsubscribe])

  useEffect(() => {
    if (lastMessage) {
      // Filter messages for subscribed channels
      const isRelevant = channels.some(channel => {
        if (channel.startsWith('collection:') && lastMessage.collectionId) {
          return channel === `collection:${lastMessage.collectionId}`
        }
        if (channel === 'whale_activity' && lastMessage.type === 'whale_movement') {
          return true
        }
        return false
      })

      if (isRelevant) {
        setMessages(prev => [...prev.slice(-99), lastMessage]) // Keep last 100 messages
      }
    }
  }, [lastMessage, channels])

  return {
    messages,
    lastMessage: messages[messages.length - 1] || null,
    clearMessages: () => setMessages([])
  }
}

// Hook for connection status with visual indicator
export function useWebSocketStatus() {
  const { connectionState, isConnected, reconnect } = useWebSocketContext()
  
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected': return 'text-green-500'
      case 'connecting': 
      case 'reconnecting': return 'text-yellow-500'
      case 'error':
      case 'disconnected': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected': return 'Connected'
      case 'connecting': return 'Connecting...'
      case 'reconnecting': return 'Reconnecting...'
      case 'error': return 'Connection Error'
      case 'disconnected': return 'Disconnected'
      default: return 'Unknown'
    }
  }

  return {
    connectionState,
    isConnected,
    statusColor: getStatusColor(),
    statusText: getStatusText(),
    reconnect
  }
}