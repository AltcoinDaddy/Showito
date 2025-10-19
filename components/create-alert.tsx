"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CreateAlert() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Create Alert</h2>
          <p className="text-sm text-muted-foreground">Set up a new price alert</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection">Collection</Label>
            <Select>
              <SelectTrigger id="collection" className="bg-secondary border-border">
                <SelectValue placeholder="Select collection" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nba">NBA Top Shot</SelectItem>
                <SelectItem value="nfl">NFL All Day</SelectItem>
                <SelectItem value="ufc">UFC Strike</SelectItem>
                <SelectItem value="flovatar">Flovatar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select>
              <SelectTrigger id="condition" className="bg-secondary border-border">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="floor-below">Floor price below</SelectItem>
                <SelectItem value="floor-above">Floor price above</SelectItem>
                <SelectItem value="volume-above">Volume above</SelectItem>
                <SelectItem value="new-listing">New listing under</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (FLOW)</Label>
            <Input id="value" type="number" placeholder="0.00" className="bg-secondary border-border" />
          </div>

          <Button className="w-full">Create Alert</Button>
        </div>
      </div>
    </Card>
  )
}
