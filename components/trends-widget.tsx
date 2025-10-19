import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react"

export function TrendsWidget() {
  const topMovers = [
    { name: "NBA Top Shot", change: 45.2, direction: "up" },
    { name: "NFL All Day", change: 32.8, direction: "up" },
    { name: "UFC Strike", change: -12.4, direction: "down" },
  ]

  return (
    <Card className="bg-card border-border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg">
            <TrendingUp className="h-5 w-5 text-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Market Trends</h3>
        </div>
        <Link href="/trends">
          <Button variant="ghost" size="sm">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Market Sentiment</p>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[68%]" />
            </div>
            <span className="text-sm font-medium">Bullish</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground font-medium">Top Movers (24h)</p>
          {topMovers.map((mover) => (
            <div key={mover.name} className="flex items-center justify-between">
              <span className="text-sm">{mover.name}</span>
              <div className="flex items-center gap-1">
                {mover.direction === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-sm font-medium ${mover.direction === "up" ? "text-green-500" : "text-red-500"}`}>
                  {mover.change > 0 ? "+" : ""}
                  {mover.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
          <Link href="/trends">
            View All Trends
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  )
}
