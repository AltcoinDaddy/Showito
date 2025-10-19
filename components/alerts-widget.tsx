"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Bell, Plus } from "lucide-react"

export function AlertsWidget() {
  const activeAlerts = 3
  const recentAlerts = [
    { collection: "NBA Top Shot", message: "Floor price dropped below 5 FLOW", time: "2h ago" },
    { collection: "NFL All Day", message: "Volume spike detected", time: "5h ago" },
  ]

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg relative">
            <Bell className="h-5 w-5 text-foreground" />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeAlerts}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-lg">Alerts</h3>
        </div>
        <Link href="/alerts">
          <Button variant="ghost" size="sm">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold">{activeAlerts}</p>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/alerts">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Link>
          </Button>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground font-medium">Recent Notifications</p>
          {recentAlerts.map((alert, index) => (
            <div key={index} className="p-2 bg-muted rounded-lg space-y-1">
              <p className="text-xs font-medium">{alert.collection}</p>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
              <p className="text-[10px] text-muted-foreground">{alert.time}</p>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
          <Link href="/alerts">
            Manage Alerts
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
