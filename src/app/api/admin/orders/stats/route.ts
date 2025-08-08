import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 模拟统计数据
    const stats = {
      total: 156,
      pending: 12,
      processing: 8,
      shipped: 15,
      delivered: 118,
      cancelled: 3,
      totalRevenue: 45678.90,
      todayOrders: 5
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('获取订单统计失败:', error)
    return NextResponse.json(
      { success: false, message: '获取订单统计失败' },
      { status: 500 }
    )
  }
}
