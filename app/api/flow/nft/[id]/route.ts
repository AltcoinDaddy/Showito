import { NextResponse } from "next/server"
import { getNFT } from "@/lib/flow-api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const nft = await getNFT(params.id)

    if (!nft) {
      return NextResponse.json({ error: "NFT not found" }, { status: 404 })
    }

    return NextResponse.json({ nft })
  } catch (error) {
    console.error("[v0] API error fetching NFT:", error)
    return NextResponse.json({ error: "Failed to fetch NFT" }, { status: 500 })
  }
}
