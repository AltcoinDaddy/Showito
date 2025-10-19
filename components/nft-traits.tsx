"use client"

import { Card } from "@/components/ui/card"

const traits = [
  { name: "Player", value: "LeBron James", rarity: "5%" },
  { name: "Play Type", value: "Dunk", rarity: "12%" },
  { name: "Season", value: "2023", rarity: "8%" },
  { name: "Team", value: "Lakers", rarity: "15%" },
  { name: "Rarity", value: "Legendary", rarity: "2%" },
]

export function NFTTraits() {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Traits</h2>

        <div className="space-y-2">
          {traits.map((trait) => (
            <div key={trait.name} className="p-3 rounded-lg bg-secondary">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{trait.name}</p>
                <p className="text-xs text-muted-foreground">{trait.rarity}</p>
              </div>
              <p className="font-medium">{trait.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
