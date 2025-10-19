"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsProfile() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Profile</h2>
          <p className="text-sm text-muted-foreground">Manage your account information</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Enter username" className="bg-secondary border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter email" className="bg-secondary border-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wallet">Connected Wallet</Label>
            <Input
              id="wallet"
              value="0x1234...5678"
              disabled
              className="bg-secondary border-border font-mono text-muted-foreground"
            />
          </div>

          <Button>Save Changes</Button>
        </div>
      </div>
    </Card>
  )
}
