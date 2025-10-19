import { NextRequest, NextResponse } from 'next/server'
import { getRealTimeService } from '@/lib/real-time-service'

export async function GET() {
  try {
    const service = getRealTimeService()
    const status = service.getStatus()
    
    return NextResponse.json({
      success: true,
      status,
      message: 'Real-time service status retrieved'
    })
  } catch (error) {
    console.error('Error getting real-time service status:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get service status'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body
    const service = getRealTimeService()

    switch (action) {
      case 'start':
        service.start()
        return NextResponse.json({
          success: true,
          message: 'Real-time service started'
        })

      case 'stop':
        service.stop()
        return NextResponse.json({
          success: true,
          message: 'Real-time service stopped'
        })

      case 'ingest_price':
        if (!data.collectionId || !data.priceData) {
          return NextResponse.json({
            success: false,
            error: 'Missing collectionId or priceData'
          }, { status: 400 })
        }
        service.ingestPriceUpdate(data.collectionId, data.priceData)
        return NextResponse.json({
          success: true,
          message: 'Price update ingested'
        })

      case 'ingest_sale':
        if (!data.collectionId || !data.nftId || !data.saleData) {
          return NextResponse.json({
            success: false,
            error: 'Missing required sale data'
          }, { status: 400 })
        }
        service.ingestSaleData(data.collectionId, data.nftId, data.saleData)
        return NextResponse.json({
          success: true,
          message: 'Sale data ingested'
        })

      case 'ingest_whale':
        if (!data.whaleData) {
          return NextResponse.json({
            success: false,
            error: 'Missing whale data'
          }, { status: 400 })
        }
        service.ingestWhaleMovement(data.whaleData)
        return NextResponse.json({
          success: true,
          message: 'Whale movement ingested'
        })

      case 'trigger_alert':
        if (!data.alertData) {
          return NextResponse.json({
            success: false,
            error: 'Missing alert data'
          }, { status: 400 })
        }
        service.triggerAlert(data.alertData)
        return NextResponse.json({
          success: true,
          message: 'Alert triggered'
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Error handling real-time service request:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}