import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 这里应该取消采集任务
    console.log('取消采集任务:', id)

    // 模拟取消任务
    const cancelledTask = {
      id,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelledBy: 'admin' // 从session获取
    }

    return NextResponse.json({
      success: true,
      task: cancelledTask,
      message: '任务已取消'
    })
  } catch (error) {
    console.error('取消采集任务失败:', error)
    return NextResponse.json(
      { success: false, message: '取消采集任务失败' },
      { status: 500 }
    )
  }
}
