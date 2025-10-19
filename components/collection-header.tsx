"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Bell } from "lucide-react"

export function CollectionHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-6">
        <div className="h-24 w-24 bg-muted rounded-lg flex-shrink-0" />
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">NBA Top Shot</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Officially licensed NBA collectible highlights. Own iconic basketball moments as NFTs.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Created Jan 2021</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">125,432 items</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">45,678 owners</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Set Alert
        </Button>
        <Button variant="outline" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View on Flow
        </Button>
      </div>
    </div>
  )
}
