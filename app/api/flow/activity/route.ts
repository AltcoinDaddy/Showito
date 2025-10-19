import { NextResponse } from "next/server"
import { getMarketActivity } from "@/lib/flow-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const activity = await getMarketActivity(limit)
    return NextResponse.json({ activity })
  } catch (error) {
    console.error("[v0] API error fetching activity:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}
