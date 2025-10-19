"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function MarketSentiment() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Market Sentiment</h2>
          <p className="text-sm text-muted-foreground">Overall market health indicators</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div>
              <p className="text-sm text-muted-foreground">Buyer Activity</p>
              <p className="text-2xl font-bold">High</p>
            </div>
            <TrendingUp className="h-8 w-8 text-foreground" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div>
              <p className="text-sm text-muted-foreground">Seller Activity</p>
              <p className="text-2xl font-bold">Medium</p>
            </div>
            <TrendingDown className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
            <div>
              <p className="text-sm text-muted-foreground">Market Momentum</p>
              <p className="text-2xl font-bold">Bullish</p>
            </div>
            <TrendingUp className="h-8 w-8 text-foreground" />
          </div>
        </div>
      </div>
    </Card>
  )
}
