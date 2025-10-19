"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", volume: 45 },
  { time: "04:00", volume: 52 },
  { time: "08:00", volume: 78 },
  { time: "12:00", volume: 95 },
  { time: "16:00", volume: 123 },
  { time: "20:00", volume: 108 },
  { time: "24:00", volume: 134 },
]

export function MarketOverview() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Market Volume</h2>
          <p className="text-sm text-muted-foreground">24-hour trading volume</p>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="time" stroke="#a3a3a3" style={{ fontSize: "12px" }} />
              <YAxis stroke="#a3a3a3" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Line type="monotone" dataKey="volume" stroke="#ffffff" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
