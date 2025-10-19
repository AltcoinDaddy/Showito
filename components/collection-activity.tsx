"use client"

import { Card } from "@/components/ui/card"

const activities = [
  {
    type: "Sale",
    item: "LeBron James Dunk #1234",
    price: "12.5 FLOW",
    from: "0x1234...5678",
    to: "0x8765...4321",
    time: "2m ago",
  },
  {
    type: "Sale",
    item: "Stephen Curry 3PT #5678",
    price: "8.3 FLOW",
    from: "0x2345...6789",
    to: "0x9876...5432",
    time: "5m ago",
  },
  {
    type: "Listing",
    item: "Giannis Block #9012",
    price: "15.0 FLOW",
    from: "0x3456...7890",
    to: "Market",
    time: "8m ago",
  },
  {
    type: "Sale",
    item: "Luka Doncic Assist #3456",
    price: "6.7 FLOW",
    from: "0x4567...8901",
    to: "0x0987...6543",
    time: "12m ago",
  },
]

export function CollectionActivity() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Latest sales and listings</p>
        </div>

        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.item}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {activity.from} → {activity.to}
                </p>
              </div>

              <div className="flex items-center gap-4 ml-4">
                <div className="text-right">
                  <p className="font-mono text-sm">{activity.price}</p>
                  <p className="text-xs text-muted-foreground">{activity.type}</p>
                </div>
                <p className="text-xs text-muted-foreground w-12 text-right">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
