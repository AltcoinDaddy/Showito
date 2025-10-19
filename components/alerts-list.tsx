"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Trash2 } from "lucide-react"

const alerts = [
  {
    collection: "NBA Top Shot",
    condition: "Floor price below 2.0 FLOW",
    status: "Active",
    created: "Feb 1, 2024",
  },
  {
    collection: "Flovatar",
    condition: "Volume above 200 FLOW",
    status: "Active",
    created: "Jan 28, 2024",
  },
  {
    collection: "NFL All Day",
    condition: "New listing under 1.0 FLOW",
    status: "Triggered",
    created: "Jan 25, 2024",
  },
]

export function AlertsList() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Your Alerts</h2>
          <p className="text-sm text-muted-foreground">Manage your price alerts and notifications</p>
        </div>

        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{alert.collection}</p>
                  <p className="text-sm text-muted-foreground">{alert.condition}</p>
                  <p className="text-xs text-muted-foreground mt-1">Created {alert.created}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    alert.status === "Active" ? "bg-foreground text-background" : "bg-muted text-foreground"
                  }`}
                >
                  {alert.status}
                </span>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
