import { NextResponse } from "next/server"
import { getUserPortfolio } from "@/lib/flow-api"

export async function GET(request: Request, { params }: { params: { address: string } }) {
  try {
    const portfolio = await getUserPortfolio(params.address)
    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error("[v0] API error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
