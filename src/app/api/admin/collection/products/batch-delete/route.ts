import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productIds } = body

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: '请选择要删除的商品' },
        { status: 400 }
      )
    }

    // 这里应该从数据库删除商品
    console.log('批量删除商品:', productIds)

    // 模拟删除操作
    const deletedCount = productIds.length

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `成功删除 ${deletedCount} 个商品`
    })
  } catch (error) {
    console.error('批量删除商品失败:', error)
    return NextResponse.json(
      { success: false, message: '批量删除商品失败' },
      { status: 500 }
    )
  }
}
