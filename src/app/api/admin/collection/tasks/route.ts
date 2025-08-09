import { NextRequest, NextResponse } from 'next/server'
import { CollectionTask } from '@/types/collection'

// 模拟任务存储
let mockTasks: CollectionTask[] = [
  {
    id: 'task-1',
    name: '淘宝T恤采集',
    platform: 'taobao',
    method: 'single',
    status: 'completed',
    urls: ['https://item.taobao.com/item.htm?id=123456789'],
    totalProducts: 1,
    collectedProducts: 1,
    failedProducts: 0,
    progress: 100,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T10:02:30Z',
    settings: {
      maxProducts: 100,
      timeout: 30000,
      retryCount: 3,
      delay: 1000,
      enableContentFilter: true,
      filterKeywords: [],
      filterRegions: true,
      filterPlatforms: true,
      filterShipping: true,
      priceRange: { min: 0, max: 10000 },
      downloadImages: true,
      maxImages: 10,
      imageQuality: 'medium',
      includeVariants: true,
      includeReviews: false,
      includeShipping: true
    },
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:02:30Z'
  },
  {
    id: 'task-2',
    name: '1688批量采集',
    platform: '1688',
    method: 'batch',
    status: 'processing',
    urls: [
      'https://detail.1688.com/offer/123456.html',
      'https://detail.1688.com/offer/123457.html',
      'https://detail.1688.com/offer/123458.html'
    ],
    totalProducts: 3,
    collectedProducts: 2,
    failedProducts: 0,
    progress: 67,
    startTime: '2024-01-15T11:00:00Z',
    settings: {
      maxProducts: 100,
      timeout: 30000,
      retryCount: 3,
      delay: 2000,
      enableContentFilter: true,
      filterKeywords: [],
      filterRegions: true,
      filterPlatforms: true,
      filterShipping: true,
      priceRange: { min: 0, max: 10000 },
      downloadImages: true,
      maxImages: 8,
      imageQuality: 'medium',
      includeVariants: true,
      includeReviews: false,
      includeShipping: true
    },
    createdBy: 'admin',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:15:00Z'
  },
  {
    id: 'task-3',
    name: '拼多多店铺采集',
    platform: 'pdd',
    method: 'shop',
    status: 'pending',
    urls: [],
    shopUrl: 'https://yangkeduo.com/shop/123456',
    totalProducts: 0,
    collectedProducts: 0,
    failedProducts: 0,
    progress: 0,
    startTime: '2024-01-15T12:00:00Z',
    settings: {
      maxProducts: 50,
      timeout: 30000,
      retryCount: 3,
      delay: 1500,
      enableContentFilter: true,
      filterKeywords: [],
      filterRegions: true,
      filterPlatforms: true,
      filterShipping: true,
      priceRange: { min: 10, max: 500 },
      downloadImages: true,
      maxImages: 5,
      imageQuality: 'low',
      includeVariants: false,
      includeReviews: true,
      includeShipping: false
    },
    createdBy: 'admin',
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const method = searchParams.get('method')

    // 过滤任务
    let filteredTasks = mockTasks

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status)
    }

    if (platform) {
      filteredTasks = filteredTasks.filter(task => task.platform === platform)
    }

    if (method) {
      filteredTasks = filteredTasks.filter(task => task.method === method)
    }

    // 排序（按创建时间倒序）
    filteredTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // 分页
    const total = filteredTasks.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      tasks: paginatedTasks,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('获取采集任务失败:', error)
    return NextResponse.json(
      { success: false, message: '获取采集任务失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, platform, method, urls, shopUrl, settings } = body

    const newTask: CollectionTask = {
      id: `task-${Date.now()}`,
      name: name || `${method}采集-${new Date().toLocaleString()}`,
      platform,
      method,
      status: 'pending',
      urls: urls || [],
      shopUrl,
      totalProducts: method === 'single' ? 1 : urls?.length || 0,
      collectedProducts: 0,
      failedProducts: 0,
      progress: 0,
      startTime: new Date().toISOString(),
      settings,
      createdBy: 'admin', // 从session获取
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockTasks.unshift(newTask)

    return NextResponse.json({
      success: true,
      task: newTask,
      message: '采集任务创建成功'
    })
  } catch (error) {
    console.error('创建采集任务失败:', error)
    return NextResponse.json(
      { success: false, message: '创建采集任务失败' },
      { status: 500 }
    )
  }
}
