"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SettingsNotifications() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Price Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for price alerts</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Listings</Label>
              <p className="text-sm text-muted-foreground">Get notified of new listings</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Market Updates</Label>
              <p className="text-sm text-muted-foreground">Daily market summary emails</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Portfolio Changes</Label>
              <p className="text-sm text-muted-foreground">Track your portfolio value changes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </Card>
  )
}
