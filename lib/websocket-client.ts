import * as React from 'react'
import { WebSocketMessage } from './websocket-server'

export interface WebSocketClientOptions {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  pingInterval?: number
  subscriptions?: string[]
}

export interface WebSocketClientEvents {
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  onMessage?: (message: WebSocketMessage) => void
  onReconnect?: (attempt: number) => void
  onReconnectFailed?: () => void
}

export class FlowWebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private pingTimer: NodeJS.Timeout | null = null
  private subscriptions: Set<string> = new Set()
  private messageQueue: WebSocketMessage[] = []
  private isConnecting = false

  constructor(
    private options: WebSocketClientOptions,
    private events: WebSocketClientEvents = {}
  ) {
    if (options.subscriptions) {
      options.subscriptions.forEach(sub => this.subscriptions.add(sub))
    }
  }

  public connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return
    }

    this.isConnecting = true
    
    try {
      // Add subscriptions to URL query params
      const url = new URL(this.options.url)
      if (this.subscriptions.size > 0) {
        const collections = Array.from(this.subscriptions)
          .filter(sub => sub.startsWith('collection:'))
          .map(sub => sub.replace('collection:', ''))
        
        if (collections.length > 0) {
          collections.forEach(collection => {
            url.searchParams.append('collections', collection)
          })
        }
      }

      this.ws = new WebSocket(url.toString())
      this.setupEventHandlers()
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      this.isConnecting = false
      this.scheduleReconnect()
    }
  }

  public disconnect(): void {
    this.clearTimers()
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }
    
    this.isConnecting = false
    this.reconnectAttempts = 0
  }

  public subscribe(channels: string[]): void {
    channels.forEach(channel => this.subscriptions.add(channel))
    
    if (this.isConnected()) {
      this.send({
        type: 'subscribe',
        channels,
        timestamp: new Date().toISOString()
      })
    }
  }

  public unsubscribe(channels: string[]): void {
    channels.forEach(channel => this.subscriptions.delete(channel))
    
    if (this.isConnected()) {
      this.send({
        type: 'unsubscribe',
        channels,
        timestamp: new Date().toISOString()
      })
    }
  }

  public send(message: any): void {
    if (this.isConnected()) {
      try {
        this.ws!.send(JSON.stringify(message))
      } catch (error) {
        console.error('Failed to send WebSocket message:', error)
        this.messageQueue.push(message)
      }
    } else {
      this.messageQueue.push(message)
    }
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  public getConnectionState(): string {
    if (!this.ws) return 'disconnected'
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting'
      case WebSocket.OPEN: return 'connected'
      case WebSocket.CLOSING: return 'closing'
      case WebSocket.CLOSED: return 'closed'
      default: return 'unknown'
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.isConnecting = false
      this.reconnectAttempts = 0
      
      // Send queued messages
      this.sendQueuedMessages()
      
      // Start ping timer
      this.startPingTimer()
      
      this.events.onOpen?.()
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason)
      this.isConnecting = false
      this.clearTimers()
      
      this.events.onClose?.()
      
      // Attempt reconnection unless it was a clean close
      if (event.code !== 1000) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.isConnecting = false
      this.events.onError?.(error)
    }

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        this.handleMessage(message)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle system messages
    if (message.type === 'connection_status') {
      console.log('Connection status:', message.data)
      return
    }

    // Forward to application
    this.events.onMessage?.(message)
  }

  private scheduleReconnect(): void {
    const maxAttempts = this.options.maxReconnectAttempts ?? 10
    
    if (this.reconnectAttempts >= maxAttempts) {
      console.error('Max reconnection attempts reached')
      this.events.onReconnectFailed?.()
      return
    }

    const interval = this.options.reconnectInterval ?? 5000
    const backoffDelay = Math.min(interval * Math.pow(2, this.reconnectAttempts), 30000)
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${maxAttempts})`)
      
      this.events.onReconnect?.(this.reconnectAttempts)
      this.connect()
    }, backoffDelay)
  }

  private startPingTimer(): void {
    const interval = this.options.pingInterval ?? 25000
    
    this.pingTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: 'ping', timestamp: new Date().toISOString() })
      }
    }, interval)
  }

  private sendQueuedMessages(): void {
    while (this.messageQueue.length > 0 && this.isConnected()) {
      const message = this.messageQueue.shift()!
      this.send(message)
    }
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }
}

// React hook for WebSocket connection
export function useWebSocket(
  url: string, 
  subscriptions: string[] = [],
  events: WebSocketClientEvents = {}
) {
  const [client, setClient] = React.useState<FlowWebSocketClient | null>(null)
  const [connectionState, setConnectionState] = React.useState<string>('disconnected')
  const [lastMessage, setLastMessage] = React.useState<WebSocketMessage | null>(null)

  React.useEffect(() => {
    const wsClient = new FlowWebSocketClient(
      { url, subscriptions },
      {
        ...events,
        onOpen: () => {
          setConnectionState('connected')
          events.onOpen?.()
        },
        onClose: () => {
          setConnectionState('disconnected')
          events.onClose?.()
        },
        onError: (error) => {
          setConnectionState('error')
          events.onError?.(error)
        },
        onMessage: (message) => {
          setLastMessage(message)
          events.onMessage?.(message)
        },
        onReconnect: (attempt) => {
          setConnectionState('reconnecting')
          events.onReconnect?.(attempt)
        }
      }
    )

    setClient(wsClient)
    wsClient.connect()

    return () => {
      wsClient.disconnect()
    }
  }, [url])

  const subscribe = React.useCallback((channels: string[]) => {
    client?.subscribe(channels)
  }, [client])

  const unsubscribe = React.useCallback((channels: string[]) => {
    client?.unsubscribe(channels)
  }, [client])

  const sendMessage = React.useCallback((message: any) => {
    client?.send(message)
  }, [client])

  return {
    client,
    connectionState,
    lastMessage,
    isConnected: connectionState === 'connected',
    subscribe,
    unsubscribe,
    sendMessage
  }
}