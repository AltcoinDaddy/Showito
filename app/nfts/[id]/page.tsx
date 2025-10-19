"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { NFTHeader } from "@/components/nft-header"
import { NFTDetails } from "@/components/nft-details"
import { NFTTraits } from "@/components/nft-traits"
import { NFTPriceHistory } from "@/components/nft-price-history"
import { NFTOwnershipHistory } from "@/components/nft-ownership-history"
import { SimilarNFTs } from "@/components/similar-nfts"

export default function NFTDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <NFTHeader />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <NFTDetails />
            <NFTPriceHistory />
            <NFTOwnershipHistory />
          </div>
          <div className="space-y-8">
            <NFTTraits />
            <SimilarNFTs />
          </div>
        </div>
      </main>
    </div>
  )
}
