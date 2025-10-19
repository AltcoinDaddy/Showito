import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { parse } from 'url'

export interface WebSocketMessage {
  type: 'price_update' | 'new_sale' | 'whale_movement' | 'alert_trigger' | 'connection_status'
  collectionId?: string
  nftId?: string
  data: any
  timestamp: string
}

export interface ClientConnection {
  id: string
  ws: WebSocket
  subscriptions: Set<string>
  lastPing: number
  isAlive: boolean
}

export class FlowWebSocketServer {
  private wss: WebSocketServer | null = null
  private clients: Map<string, ClientConnection> = new Map()
  private pingInterval: NodeJS.Timeout | null = null
  private messageQueue: Map<string, WebSocketMessage[]> = new Map()

  constructor(private port: number = 8080) {}

  public start(): void {
    this.wss = new WebSocketServer({ 
      port: this.port,
      verifyClient: this.verifyClient.bind(this)
    })

    this.wss.on('connection', this.handleConnection.bind(this))
    this.startPingInterval()
    
    console.log(`WebSocket server started on port ${this.port}`)
  }

  public stop(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    this.clients.forEach(client => {
      client.ws.terminate()
    })
    this.clients.clear()

    if (this.wss) {
      this.wss.close()
      this.wss = null
    }

    console.log('WebSocket server stopped')
  }

  private verifyClient(info: { origin: string; secure: boolean; req: IncomingMessage }): boolean {
    // In production, implement proper origin verification
    // For development, allow all connections
    return true
  }

  private handleConnection(ws: WebSocket, request: IncomingMessage): void {
    const clientId = this.generateClientId()
    const url = parse(request.url || '', true)
    
    const client: ClientConnection = {
      id: clientId,
      ws,
      subscriptions: new Set(),
      lastPing: Date.now(),
      isAlive: true
    }

    this.clients.set(clientId, client)

    // Handle initial subscriptions from query params
    if (url.query.collections) {
      const collections = Array.isArray(url.query.collections) 
        ? url.query.collections 
        : [url.query.collections]
      
      collections.forEach(collectionId => {
        if (typeof collectionId === 'string') {
          client.subscriptions.add(`collection:${collectionId}`)
        }
      })
    }

    ws.on('message', (data) => this.handleMessage(clientId, data))
    ws.on('pong', () => this.handlePong(clientId))
    ws.on('close', () => this.handleDisconnection(clientId))
    ws.on('error', (error) => this.handleError(clientId, error))

    // Send connection confirmation
    this.sendToClient(clientId, {
      type: 'connection_status',
      data: { 
        status: 'connected', 
        clientId,
        subscriptions: Array.from(client.subscriptions)
      },
      timestamp: new Date().toISOString()
    })

    // Send any queued messages for this client's subscriptions
    this.sendQueuedMessages(clientId)
  }

  private handleMessage(clientId: string, data: Buffer | ArrayBuffer | Buffer[]): void {
    const client = this.clients.get(clientId)
    if (!client) return

    try {
      const messageStr = Array.isArray(data) 
        ? Buffer.concat(data).toString()
        : data instanceof ArrayBuffer 
          ? Buffer.from(data).toString()
          : data.toString()
      const message = JSON.parse(messageStr)
      
      switch (message.type) {
        case 'subscribe':
          this.handleSubscription(clientId, message.channels)
          break
        case 'unsubscribe':
          this.handleUnsubscription(clientId, message.channels)
          break
        case 'ping':
          client.lastPing = Date.now()
          client.isAlive = true
          break
        default:
          console.warn(`Unknown message type: ${message.type}`)
      }
    } catch (error) {
      console.error(`Error parsing message from client ${clientId}:`, error)
    }
  }

  private handleSubscription(clientId: string, channels: string[]): void {
    const client = this.clients.get(clientId)
    if (!client) return

    channels.forEach(channel => {
      client.subscriptions.add(channel)
    })

    this.sendToClient(clientId, {
      type: 'connection_status',
      data: { 
        status: 'subscribed', 
        subscriptions: Array.from(client.subscriptions)
      },
      timestamp: new Date().toISOString()
    })
  }

  private handleUnsubscription(clientId: string, channels: string[]): void {
    const client = this.clients.get(clientId)
    if (!client) return

    channels.forEach(channel => {
      client.subscriptions.delete(channel)
    })

    this.sendToClient(clientId, {
      type: 'connection_status',
      data: { 
        status: 'unsubscribed', 
        subscriptions: Array.from(client.subscriptions)
      },
      timestamp: new Date().toISOString()
    })
  }

  private handlePong(clientId: string): void {
    const client = this.clients.get(clientId)
    if (client) {
      client.isAlive = true
      client.lastPing = Date.now()
    }
  }

  private handleDisconnection(clientId: string): void {
    this.clients.delete(clientId)
    console.log(`Client ${clientId} disconnected`)
  }

  private handleError(clientId: string, error: Error): void {
    console.error(`WebSocket error for client ${clientId}:`, error)
    this.clients.delete(clientId)
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (!client.isAlive) {
          client.ws.terminate()
          this.clients.delete(clientId)
          return
        }

        client.isAlive = false
        client.ws.ping()
      })
    }, 30000) // Ping every 30 seconds
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId)
    if (!client || client.ws.readyState !== WebSocket.OPEN) {
      // Queue message for later delivery
      if (!this.messageQueue.has(clientId)) {
        this.messageQueue.set(clientId, [])
      }
      this.messageQueue.get(clientId)!.push(message)
      return
    }

    try {
      client.ws.send(JSON.stringify(message))
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error)
    }
  }

  private sendQueuedMessages(clientId: string): void {
    const queuedMessages = this.messageQueue.get(clientId)
    if (!queuedMessages || queuedMessages.length === 0) return

    queuedMessages.forEach(message => {
      this.sendToClient(clientId, message)
    })

    this.messageQueue.delete(clientId)
  }

  // Public methods for broadcasting messages
  public broadcastToChannel(channel: string, message: Omit<WebSocketMessage, 'timestamp'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: new Date().toISOString()
    }

    this.clients.forEach(client => {
      if (client.subscriptions.has(channel)) {
        this.sendToClient(client.id, fullMessage)
      }
    })
  }

  public broadcastPriceUpdate(collectionId: string, data: any): void {
    this.broadcastToChannel(`collection:${collectionId}`, {
      type: 'price_update',
      collectionId,
      data
    })
  }

  public broadcastNewSale(collectionId: string, nftId: string, data: any): void {
    this.broadcastToChannel(`collection:${collectionId}`, {
      type: 'new_sale',
      collectionId,
      nftId,
      data
    })
  }

  public broadcastWhaleMovement(data: any): void {
    this.broadcastToChannel('whale_activity', {
      type: 'whale_movement',
      data
    })
  }

  public getConnectedClientsCount(): number {
    return this.clients.size
  }

  public getClientSubscriptions(clientId: string): string[] {
    const client = this.clients.get(clientId)
    return client ? Array.from(client.subscriptions) : []
  }
}

// Singleton instance for the application
let wsServer: FlowWebSocketServer | null = null

export function getWebSocketServer(): FlowWebSocketServer {
  if (!wsServer) {
    wsServer = new FlowWebSocketServer(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 8080)
  }
  return wsServer
}

export function startWebSocketServer(): void {
  const server = getWebSocketServer()
  server.start()
}

export function stopWebSocketServer(): void {
  if (wsServer) {
    wsServer.stop()
    wsServer = null
  }
}