"use client"

import { Card } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan", value: 1200 },
  { date: "Feb", value: 1450 },
  { date: "Mar", value: 1380 },
  { date: "Apr", value: 1680 },
  { date: "May", value: 1920 },
  { date: "Jun", value: 2100 },
  { date: "Jul", value: 2456 },
]

export function PortfolioChart() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Portfolio Value</h2>
          <p className="text-sm text-muted-foreground">Historical portfolio value over time</p>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="date" stroke="#a3a3a3" style={{ fontSize: "12px" }} />
              <YAxis stroke="#a3a3a3" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} fill="url(#valueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
