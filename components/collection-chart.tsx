"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const floorData = [
  { date: "Jan 1", floor: 2.1, volume: 320 },
  { date: "Jan 8", floor: 2.3, volume: 380 },
  { date: "Jan 15", floor: 2.2, volume: 410 },
  { date: "Jan 22", floor: 2.5, volume: 450 },
  { date: "Jan 29", floor: 2.4, volume: 420 },
  { date: "Feb 5", floor: 2.6, volume: 480 },
  { date: "Feb 12", floor: 2.5, volume: 456 },
]

export function CollectionChart() {
  const [metric, setMetric] = useState<"floor" | "volume">("floor")

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Price History</h2>
            <p className="text-sm text-muted-foreground">Floor price and volume over time</p>
          </div>
          <div className="flex gap-2">
            <Button variant={metric === "floor" ? "default" : "outline"} size="sm" onClick={() => setMetric("floor")}>
              Floor Price
            </Button>
            <Button variant={metric === "volume" ? "default" : "outline"} size="sm" onClick={() => setMetric("volume")}>
              Volume
            </Button>
          </div>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={floorData}>
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
              <Line type="monotone" dataKey={metric} stroke="#ffffff" strokeWidth={2} dot={{ fill: "#ffffff", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
