import { NextResponse } from "next/server"
import { getCollections } from "@/lib/flow-api"

export async function GET() {
  try {
    const collections = await getCollections()
    return NextResponse.json({ collections })
  } catch (error) {
    console.error("[v0] API error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
