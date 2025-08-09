import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 模拟获取单个售后请求
    const mockRequest = {
      id,
      orderId: 'ORD-2024-001',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      type: 'refund',
      status: 'pending',
      reason: '商品质量问题',
      description: '收到的商品有明显的质量缺陷，颜色与描述不符，要求退款。',
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop'
      ],
      amount: 89.99,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      productInfo: {
        id: 'p1',
        name: '经典白色T恤',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
        sku: 'TSH-WHT-M',
        quantity: 2,
        price: 44.99
      }
    }

    return NextResponse.json({
      success: true,
      request: mockRequest
    })
  } catch (error) {
    console.error('获取售后请求详情失败:', error)
    return NextResponse.json(
      { success: false, message: '获取售后请求详情失败' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, handlerNotes } = body

    // 这里应该更新数据库中的售后请求状态
    console.log(`更新售后请求 ${id} 状态为: ${status}`)
    console.log(`处理备注: ${handlerNotes}`)

    // 模拟更新后的数据
    const updatedRequest = {
      id,
      status,
      handlerNotes,
      handlerName: '当前管理员', // 从session获取
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest,
      message: '售后请求状态更新成功'
    })
  } catch (error) {
    console.error('更新售后请求失败:', error)
    return NextResponse.json(
      { success: false, message: '更新售后请求失败' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 这里应该从数据库删除售后请求
    console.log(`删除售后请求: ${id}`)

    return NextResponse.json({
      success: true,
      message: '售后请求删除成功'
    })
  } catch (error) {
    console.error('删除售后请求失败:', error)
    return NextResponse.json(
      { success: false, message: '删除售后请求失败' },
      { status: 500 }
    )
  }
}
