'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useWebSocketStatus, useWebSocketSubscription } from '@/lib/websocket-context'
import { useRealTimeDataProcessor } from '@/lib/real-time-data-processor'
import { Wifi, WifiOff, Activity, Database, Users, Clock } from 'lucide-react'

export function RealTimeStatus() {
  const { connectionState, isConnected, statusColor, statusText, reconnect } = useWebSocketStatus()
  const { stats } = useRealTimeDataProcessor()
  
  return (
    <Card className="border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          {isConnected ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          Real-Time Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Connection:</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${statusColor} border-current`}>
              {statusText}
            </Badge>
            {!isConnected && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={reconnect}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Reconnect
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-white/50" />
            <span className="text-white/70">Queue:</span>
            <span className="text-white font-mono">{stats.queueSize}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-white/50" />
            <span className="text-white/70">Subscribers:</span>
            <span className="text-white font-mono">{stats.subscriberCount}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-white/50" />
            <span className="text-white/70">Throttled:</span>
            <span className="text-white font-mono">{stats.throttledEntities}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/50" />
            <span className="text-white/70">Last Update:</span>
            <span className="text-white font-mono text-xs">
              {stats.lastProcessedTime 
                ? new Date(stats.lastProcessedTime).toLocaleTimeString()
                : 'Never'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function RealTimeUpdates() {
  const { messages } = useWebSocketSubscription(['collection:nba-top-shot', 'collection:nfl-all-day', 'whale_activity'])
  const recentMessages = messages.slice(-10) // Show last 10 messages

  return (
    <Card className="border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {recentMessages.length === 0 ? (
            <p className="text-white/50 text-sm">No recent updates</p>
          ) : (
            recentMessages.map((message, index) => (
              <div key={index} className="border border-white/10 rounded p-2 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {message.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-white/50 text-xs font-mono">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-white/70">
                  {message.collectionId && (
                    <span className="text-white font-mono">{message.collectionId}</span>
                  )}
                  {message.type === 'price_update' && message.data?.floorPrice && (
                    <span className="ml-2">Floor: ${message.data.floorPrice.toFixed(2)}</span>
                  )}
                  {message.type === 'new_sale' && message.data?.price && (
                    <span className="ml-2">Sale: ${message.data.price.toFixed(2)}</span>
                  )}
                  {message.type === 'whale_movement' && message.data?.amount && (
                    <span className="ml-2">Amount: ${message.data.amount.toFixed(2)}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}