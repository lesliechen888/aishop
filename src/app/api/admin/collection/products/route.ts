import { NextRequest, NextResponse } from 'next/server'
import { CollectedProduct } from '@/types/collection'
import {
  getCollectedProducts,
  updateProduct,
  deleteProduct,
  deleteProducts,
  addProductToCollection,
  getCollectionStats
} from '@/utils/productStorage'

// 模拟采集商品存储（备用数据）
let backupMockProducts: CollectedProduct[] = [
  {
    id: 'product-1',
    taskId: 'task-1',
    platform: 'taobao',
    originalUrl: 'https://item.taobao.com/item.htm?id=123456789',
    title: '纯棉T恤男女同款 简约百搭',
    description: '采用优质纯棉面料，舒适透气，做工精细，支持多种颜色和尺码选择。',
    price: 39.9,
    originalPrice: 59.9,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
    ],
    specifications: {
      '材质': '100%棉',
      '颜色': '白色/黑色/灰色',
      '尺码': 'S/M/L/XL'
    },
    variants: [
      { id: 'v1', name: '白色-M', price: 39.9, stock: 500, sku: 'TSH-WHT-M', attributes: { '颜色': '白色', '尺码': 'M' } },
      { id: 'v2', name: '黑色-L', price: 39.9, stock: 300, sku: 'TSH-BLK-L', attributes: { '颜色': '黑色', '尺码': 'L' } }
    ],
    shopName: '优质服装店',
    shopUrl: 'https://shop123.taobao.com',
    sales: 12580,
    rating: 4.9,
    reviewCount: 3456,
    rawData: {},
    status: 'draft',
    filterResults: [
      {
        type: 'platform',
        field: 'title',
        originalValue: '淘宝纯棉T恤',
        filteredValue: '纯棉T恤',
        action: 'replaced'
      }
    ],
    collectedAt: '2024-01-15T10:01:00Z',
    updatedAt: '2024-01-15T10:01:00Z'
  },
  {
    id: 'product-2',
    taskId: 'task-2',
    platform: '1688',
    originalUrl: 'https://detail.1688.com/offer/123456.html',
    title: '厂家直销优质T恤 纯棉短袖',
    description: '厂家直销，价格优惠，支持批发定制。采用优质纯棉面料，舒适透气。',
    price: 15.8,
    originalPrice: 25.0,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
    ],
    specifications: {
      '材质': '100%纯棉',
      '颜色': '白色/黑色',
      '起订量': '50件'
    },
    variants: [
      { id: 'v1', name: '白色-M', price: 15.8, stock: 1000, sku: 'TSH-WHT-M', attributes: { '颜色': '白色', '尺码': 'M' } }
    ],
    shopName: '优质服装厂',
    shopUrl: 'https://shop123.1688.com',
    sales: 5680,
    rating: 4.8,
    reviewCount: 1234,
    rawData: {},
    status: 'approved',
    filterResults: [
      {
        type: 'region',
        field: 'description',
        originalValue: '广东省东莞市厂家直销',
        filteredValue: '厂家直销',
        action: 'replaced'
      }
    ],
    collectedAt: '2024-01-15T11:05:00Z',
    updatedAt: '2024-01-15T11:05:00Z'
  },
  {
    id: 'product-3',
    taskId: 'task-2',
    platform: '1688',
    originalUrl: 'https://detail.1688.com/offer/123457.html',
    title: '休闲牛仔裤 男女款 多尺码',
    description: '经典牛仔面料，版型修身，适合日常穿着。支持多种尺码选择。',
    price: 45.0,
    originalPrice: 68.0,
    currency: 'CNY',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'
    ],
    specifications: {
      '材质': '棉+聚酯纤维',
      '颜色': '蓝色/黑色',
      '尺码': '28/30/32/34/36'
    },
    variants: [
      { id: 'v1', name: '蓝色-32', price: 45.0, stock: 200, sku: 'JNS-BLU-32', attributes: { '颜色': '蓝色', '尺码': '32' } }
    ],
    shopName: '时尚牛仔厂',
    shopUrl: 'https://shop456.1688.com',
    sales: 3200,
    rating: 4.7,
    reviewCount: 890,
    rawData: {},
    status: 'draft',
    filterResults: [],
    collectedAt: '2024-01-15T11:10:00Z',
    updatedAt: '2024-01-15T11:10:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const taskId = searchParams.get('taskId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'collectedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // 获取真实采集的商品数据
    let filteredProducts = getCollectedProducts()

    if (platform) {
      filteredProducts = filteredProducts.filter(product => product.platform === platform)
    }

    if (status) {
      filteredProducts = filteredProducts.filter(product => product.status === status)
    }

    if (taskId) {
      filteredProducts = filteredProducts.filter(product => product.taskId === taskId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    }

    // 排序
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof CollectedProduct]
      let bValue: any = b[sortBy as keyof CollectedProduct]

      if (sortBy === 'price') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortBy === 'collectedAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // 分页
    const total = filteredProducts.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('获取采集商品失败:', error)
    return NextResponse.json(
      { success: false, message: '获取采集商品失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, images, platform, specifications } = body

    const newProduct: CollectedProduct = {
      id: `product-${Date.now()}`,
      taskId: 'manual',
      platform: platform || 'taobao',
      originalUrl: '',
      title,
      description,
      price,
      currency: 'CNY',
      images: images || [],
      specifications: specifications || {},
      variants: [],
      shopName: '手动添加',
      shopUrl: '',
      rawData: {},
      status: 'draft',
      filterResults: [],
      collectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    addProductToCollection(newProduct)

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: '商品添加成功'
    })
  } catch (error) {
    console.error('添加商品失败:', error)
    return NextResponse.json(
      { success: false, message: '添加商品失败' },
      { status: 500 }
    )
  }
}
