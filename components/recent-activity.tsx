"use client"

import { Card } from "@/components/ui/card"

const activities = [
  {
    type: "Sale",
    collection: "NBA Top Shot",
    item: "LeBron James Dunk #1234",
    price: "12.5 FLOW",
    time: "2m ago",
  },
  {
    type: "Sale",
    collection: "NFL All Day",
    item: "Patrick Mahomes TD #5678",
    price: "8.3 FLOW",
    time: "5m ago",
  },
  {
    type: "Listing",
    collection: "UFC Strike",
    item: "Conor McGregor KO #9012",
    price: "15.0 FLOW",
    time: "8m ago",
  },
  {
    type: "Sale",
    collection: "Flovatar",
    item: "Flovatar #3456",
    price: "6.7 FLOW",
    time: "12m ago",
  },
  {
    type: "Sale",
    collection: "Gaia",
    item: "Gaia Land #7890",
    price: "4.2 FLOW",
    time: "15m ago",
  },
]

export function RecentActivity() {
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
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded" />
                <div>
                  <p className="font-medium">{activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.collection}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="font-mono font-medium">{activity.price}</p>
                  <p className="text-sm text-muted-foreground">{activity.type}</p>
                </div>
                <p className="text-sm text-muted-foreground w-16 text-right">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
