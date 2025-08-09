import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // 模拟售后请求数据
    const mockRequests = [
      {
        id: 'as-001',
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
      },
      {
        id: 'as-002',
        orderId: 'ORD-2024-002',
        orderNumber: 'ORD-2024-002',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1234567891',
        type: 'exchange',
        status: 'processing',
        reason: '尺码不合适',
        description: '订购的L码太小了，希望能换成XL码。',
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop'
        ],
        amount: 120.00,
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T16:45:00Z',
        handlerName: '客服小王',
        handlerNotes: '已联系客户确认换货需求，正在安排换货流程。',
        productInfo: {
          id: 'p2',
          name: '牛仔裤',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
          sku: 'JNS-BLU-L',
          quantity: 1,
          price: 120.00
        }
      },
      {
        id: 'as-003',
        orderId: 'ORD-2024-003',
        orderNumber: 'ORD-2024-003',
        customerName: 'Mike Wilson',
        customerEmail: 'mike@example.com',
        type: 'complaint',
        status: 'approved',
        reason: '物流延误',
        description: '订单已经超过预期送达时间3天，严重影响使用计划。',
        images: [],
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T11:30:00Z',
        handlerName: '客服小李',
        handlerNotes: '已核实物流情况，确实存在延误。已为客户提供补偿方案。',
        productInfo: {
          id: 'p3',
          name: '运动鞋',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
          sku: 'SNK-BLK-42',
          quantity: 1,
          price: 159.50
        }
      },
      {
        id: 'as-004',
        orderId: 'ORD-2024-004',
        orderNumber: 'ORD-2024-004',
        customerName: 'Emily Davis',
        customerEmail: 'emily@example.com',
        type: 'repair',
        status: 'completed',
        reason: '商品损坏',
        description: '收到商品时发现拉链损坏，无法正常使用。',
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop'
        ],
        createdAt: '2024-01-12T16:45:00Z',
        updatedAt: '2024-01-12T18:20:00Z',
        handlerName: '客服小张',
        handlerNotes: '已安排维修服务，客户满意。',
        productInfo: {
          id: 'p4',
          name: '连帽卫衣',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop',
          sku: 'HDY-GRY-XL',
          quantity: 1,
          price: 89.99
        }
      },
      {
        id: 'as-005',
        orderId: 'ORD-2024-005',
        orderNumber: 'ORD-2024-005',
        customerName: 'David Brown',
        customerEmail: 'david@example.com',
        type: 'refund',
        status: 'rejected',
        reason: '不喜欢颜色',
        description: '颜色与期望不符，要求退款。',
        images: [],
        createdAt: '2024-01-11T13:30:00Z',
        updatedAt: '2024-01-11T15:45:00Z',
        handlerName: '客服主管',
        handlerNotes: '商品无质量问题，且已超过退货期限，按政策拒绝退款申请。',
        productInfo: {
          id: 'p5',
          name: '休闲短裤',
          image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=100&h=100&fit=crop',
          sku: 'SHT-KHK-M',
          quantity: 1,
          price: 39.99
        }
      }
    ]

    // 应用筛选条件
    let filteredRequests = mockRequests

    if (orderId) {
      filteredRequests = filteredRequests.filter(req => req.orderId === orderId)
    }

    if (type) {
      filteredRequests = filteredRequests.filter(req => req.type === type)
    }

    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredRequests = filteredRequests.filter(req => 
        req.orderNumber.toLowerCase().includes(searchLower) ||
        req.customerName.toLowerCase().includes(searchLower) ||
        req.customerEmail.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      requests: filteredRequests
    })
  } catch (error) {
    console.error('获取售后请求失败:', error)
    return NextResponse.json(
      { success: false, message: '获取售后请求失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, type, reason, description, images, amount, productInfo } = body

    // 这里应该保存到数据库
    const newRequest = {
      id: `as-${Date.now()}`,
      orderId,
      orderNumber: `ORD-${orderId}`,
      customerName: 'Customer Name', // 从订单获取
      customerEmail: 'customer@example.com', // 从订单获取
      type,
      status: 'pending',
      reason,
      description,
      images: images || [],
      amount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productInfo
    }

    return NextResponse.json({
      success: true,
      request: newRequest,
      message: '售后请求提交成功'
    })
  } catch (error) {
    console.error('创建售后请求失败:', error)
    return NextResponse.json(
      { success: false, message: '创建售后请求失败' },
      { status: 500 }
    )
  }
}
