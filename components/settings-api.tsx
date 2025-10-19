"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy } from "lucide-react"

export function SettingsAPI() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">API Access</h2>
          <p className="text-sm text-muted-foreground">Manage your API keys</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input
                value="sk_live_••••••••••••••••"
                disabled
                className="bg-secondary border-border font-mono text-muted-foreground"
              />
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent">
            Generate New Key
          </Button>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Keep your API key secure. Do not share it publicly or commit it to version control.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
