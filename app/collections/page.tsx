import { CollectionFilters } from "@/components/collection-filters"
import { CollectionGrid } from "@/components/collection-grid"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { GitCompare } from "lucide-react"
import Link from "next/link"

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Collections</h1>
            <p className="text-muted-foreground text-lg">Explore and analyze NFT collections on Flow blockchain</p>
          </div>
          <Link href="/collections/compare">
            <Button className="gap-2">
              <GitCompare className="h-4 w-4" />
              Compare Collections
            </Button>
          </Link>
        </div>

        <CollectionFilters />
        <CollectionGrid />
      </main>
    </div>
  )
}
