import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 模拟售后统计数据
    const stats = {
      total: 25,
      pending: 8,
      processing: 5,
      approved: 4,
      rejected: 3,
      completed: 5,
      totalRefundAmount: 1250.75,
      avgProcessingTime: 2.5 // 平均处理时间（天）
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('获取售后统计失败:', error)
    return NextResponse.json(
      { success: false, message: '获取售后统计失败' },
      { status: 500 }
    )
  }
}
