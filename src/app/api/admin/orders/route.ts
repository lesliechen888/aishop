import { NextRequest, NextResponse } from 'next/server'

// 模拟订单数据
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    customerPhone: '+1-555-0123',
    customerAddress: '123 Main St, New York, NY 10001, USA',
    items: [
      {
        id: '1',
        productId: 'p1',
        productName: '经典白色T恤',
        productImage: '/images/products/tshirt-white.jpg',
        sku: 'TSH-WHT-M',
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98
      }
    ],
    totalAmount: 59.98,
    currency: 'USD',
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    notes: '',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    type: 'retail'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerAddress: '456 Oak Ave, Los Angeles, CA 90210, USA',
    items: [
      {
        id: '2',
        productId: 'p2',
        productName: '牛仔裤',
        productImage: '/images/products/jeans-blue.jpg',
        sku: 'JNS-BLU-32',
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99
      }
    ],
    totalAmount: 79.99,
    currency: 'USD',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    shippingMethod: 'Express Shipping',
    trackingNumber: 'TRK123456789',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T16:00:00Z',
    type: 'retail'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Fashion Store Ltd',
    customerEmail: 'orders@fashionstore.com',
    customerAddress: '789 Business Blvd, Chicago, IL 60601, USA',
    items: [
      {
        id: '3',
        productId: 'p1',
        productName: '经典白色T恤',
        productImage: '/images/products/tshirt-white.jpg',
        sku: 'TSH-WHT-M',
        quantity: 50,
        unitPrice: 19.99,
        totalPrice: 999.50
      }
    ],
    totalAmount: 999.50,
    currency: 'USD',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Bank Transfer',
    shippingMethod: 'Freight',
    createdAt: '2024-01-13T09:00:00Z',
    updatedAt: '2024-01-14T10:30:00Z',
    type: 'wholesale'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''

    let filteredOrders = [...mockOrders]

    // 搜索过滤
    if (search) {
      filteredOrders = filteredOrders.filter(order => 
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.customerName.toLowerCase().includes(search.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 状态过滤
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    // 类型过滤
    if (type) {
      filteredOrders = filteredOrders.filter(order => order.type === type)
    }

    // 支付状态过滤
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(order => order.paymentStatus === paymentStatus)
    }

    // 日期范围过滤
    if (startDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) >= new Date(startDate)
      )
    }
    if (endDate) {
      filteredOrders = filteredOrders.filter(order => 
        new Date(order.createdAt) <= new Date(endDate + 'T23:59:59Z')
      )
    }

    // 分页
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit)
      }
    })
  } catch (error) {
    console.error('获取订单列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取订单列表失败' },
      { status: 500 }
    )
  }
}
