"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const priceData = [
  { date: "Jan 15", price: 10.5 },
  { date: "Jan 22", price: 11.2 },
  { date: "Jan 29", price: 10.8 },
  { date: "Feb 5", price: 12.0 },
  { date: "Feb 12", price: 12.5 },
]

export function NFTPriceHistory() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Price History</h2>
          <p className="text-sm text-muted-foreground">Historical sale prices</p>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceData}>
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
              <Line type="monotone" dataKey="price" stroke="#ffffff" strokeWidth={2} dot={{ fill: "#ffffff", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
