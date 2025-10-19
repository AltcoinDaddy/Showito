import { NextResponse } from "next/server"
import { getCollection } from "@/lib/flow-api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const collection = await getCollection(params.id)

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("[v0] API error fetching collection:", error)
    return NextResponse.json({ error: "Failed to fetch collection" }, { status: 500 })
  }
}
