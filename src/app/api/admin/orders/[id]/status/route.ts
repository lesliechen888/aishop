import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, message: '状态参数不能为空' },
        { status: 400 }
      )
    }

    // 验证状态值
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: '无效的状态值' },
        { status: 400 }
      )
    }

    // 这里应该更新数据库中的订单状态
    // 目前返回成功响应
    return NextResponse.json({
      success: true,
      message: '订单状态更新成功'
    })
  } catch (error) {
    console.error('更新订单状态失败:', error)
    return NextResponse.json(
      { success: false, message: '更新订单状态失败' },
      { status: 500 }
    )
  }
}
