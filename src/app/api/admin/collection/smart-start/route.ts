import { NextRequest, NextResponse } from 'next/server'
import { CollectionTask, CollectionSettings, CollectedProduct } from '@/types/collection'
import { ParsedUrl, CollectionIntent } from '@/utils/smartParser'
import { progressMonitor, initializeTask, updateProductProgress } from '@/utils/progressMonitor'
import { addCompletedProducts } from '../completed-products/route'

// 动态导入采集引擎（仅在服务端使用）
async function getCollectionEngine() {
  const { CollectionEngine } = await import('@/utils/collectionEngine')
  return CollectionEngine
}

// 智能采集请求接口
interface SmartCollectionRequest {
  urls: ParsedUrl[]
  settings: CollectionSettings
}

// 任务组接口
interface TaskGroup {
  intent: CollectionIntent
  urls: ParsedUrl[]
  priority: number
}

// 模拟任务存储
let mockTasks: CollectionTask[] = []

export async function POST(request: NextRequest) {
  try {
    const body: SmartCollectionRequest = await request.json()
    const { urls, settings } = body

    // 验证输入
    if (!urls || urls.length === 0) {
      return NextResponse.json({
        success: false,
        message: '没有提供有效的URL'
      }, { status: 400 })
    }

    // 过滤有效URL
    const validUrls = urls.filter(url => url.isValid && url.platform)

    if (validUrls.length === 0) {
      return NextResponse.json({
        success: false,
        message: '没有有效的URL可以采集'
      }, { status: 400 })
    }

    // 按意图分组URL
    const taskGroups = groupUrlsByIntent(validUrls)

    // 创建采集任务
    const createdTasks: CollectionTask[] = []
    
    for (const group of taskGroups) {
      const task = await createCollectionTask(group, settings)
      createdTasks.push(task)
      mockTasks.unshift(task)
    }

    // 启动采集进程
    createdTasks.forEach(task => {
      setTimeout(() => {
        processRealCollectionTask(task)
      }, 1000)
    })

    return NextResponse.json({
      success: true,
      message: `成功创建 ${createdTasks.length} 个采集任务`,
      tasksCreated: createdTasks.length,
      tasks: createdTasks.map(task => ({
        id: task.id,
        name: task.name,
        method: task.method,
        platform: task.platform,
        totalProducts: task.totalProducts
      }))
    })

  } catch (error) {
    console.error('智能采集启动失败:', error)
    return NextResponse.json({
      success: false,
      message: '智能采集启动失败'
    }, { status: 500 })
  }
}

// 按意图分组URL
function groupUrlsByIntent(urls: ParsedUrl[]): TaskGroup[] {
  const groups: Record<CollectionIntent, ParsedUrl[]> = {
    product: [],
    shop: [],
    batch: []
  }

  // 按意图分组
  urls.forEach(url => {
    groups[url.intent].push(url)
  })

  // 转换为任务组，设置优先级
  const taskGroups: TaskGroup[] = []
  
  if (groups.product.length > 0) {
    taskGroups.push({
      intent: 'product',
      urls: groups.product,
      priority: 1 // 最高优先级
    })
  }

  if (groups.batch.length > 0) {
    taskGroups.push({
      intent: 'batch',
      urls: groups.batch,
      priority: 2 // 中等优先级
    })
  }

  if (groups.shop.length > 0) {
    taskGroups.push({
      intent: 'shop',
      urls: groups.shop,
      priority: 3 // 最低优先级
    })
  }

  return taskGroups.sort((a, b) => a.priority - b.priority)
}

// 创建采集任务
async function createCollectionTask(group: TaskGroup, settings: CollectionSettings): Promise<CollectionTask> {
  const { intent, urls } = group
  
  // 确定主要平台（取最多的平台）
  const platformCounts: Record<string, number> = {}
  urls.forEach(url => {
    if (url.platform) {
      platformCounts[url.platform] = (platformCounts[url.platform] || 0) + 1
    }
  })
  
  const mainPlatform = Object.entries(platformCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as any || 'taobao'

  // 生成任务名称
  const taskName = generateTaskName(intent, urls.length, mainPlatform)

  // 计算总商品数
  let totalProducts = 0
  if (intent === 'product' || intent === 'batch') {
    totalProducts = urls.length
  } else if (intent === 'shop') {
    // 店铺采集：估算每个店铺的商品数
    totalProducts = urls.length * (settings.maxProducts || 50)
  }

  const task: CollectionTask = {
    id: `smart-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: taskName,
    platform: mainPlatform,
    method: intent === 'shop' ? 'shop' : intent === 'product' ? 'single' : 'batch',
    status: 'pending',
    urls: urls.map(url => url.originalUrl),
    shopUrl: intent === 'shop' ? urls[0]?.originalUrl : undefined,
    totalProducts,
    collectedProducts: 0,
    failedProducts: 0,
    progress: 0,
    startTime: new Date().toISOString(),
    settings: {
      ...settings,
      smartParsedUrls: urls // 保存解析结果
    },
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return task
}

// 生成任务名称
function generateTaskName(intent: CollectionIntent, urlCount: number, platform: string): string {
  const platformNames: Record<string, string> = {
    'taobao': '淘宝',
    '1688': '1688',
    'pdd': '拼多多',
    'douyin': '抖音小店',
    'temu': 'Temu'
  }

  const platformName = platformNames[platform] || platform
  const timestamp = new Date().toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  switch (intent) {
    case 'product':
      return `${platformName}单品采集-${urlCount}个商品-${timestamp}`
    case 'shop':
      return `${platformName}店铺采集-${urlCount}个店铺-${timestamp}`
    case 'batch':
      return `${platformName}批量采集-${urlCount}个商品-${timestamp}`
    default:
      return `智能采集任务-${timestamp}`
  }
}

// 处理真实采集任务
async function processRealCollectionTask(task: CollectionTask) {
  try {
    console.log(`开始处理真实采集任务: ${task.id}`)

    // 更新任务状态
    task.status = 'processing'
    task.updatedAt = new Date().toISOString()

    const smartParsedUrls = task.settings.smartParsedUrls as ParsedUrl[] || []

    // 初始化进度监控
    initializeTask(task.id, task.totalProducts)

    // 创建采集引擎实例，传入进度回调
    const CollectionEngineClass = await getCollectionEngine()
    const collectionEngine = new CollectionEngineClass((progress) => {
      updateProductProgress(progress)
    })

    let collectionResults: any[] = []

    // 根据意图处理不同类型的采集
    if (task.method === 'single') {
      // 单品采集
      if (smartParsedUrls.length > 0) {
        const result = await collectionEngine.collectSingleProduct(smartParsedUrls[0], task.id)
        collectionResults = [result]
      }
    } else if (task.method === 'batch') {
      // 批量采集
      collectionResults = await collectionEngine.collectBatchProducts(smartParsedUrls, task.id, 3)
    } else if (task.method === 'shop') {
      // 整店采集
      if (smartParsedUrls.length > 0) {
        const shopUrl = smartParsedUrls[0]
        collectionResults = await collectionEngine.collectShopProducts(
          shopUrl.originalUrl,
          shopUrl.platform!,
          task.id,
          task.settings.maxProducts || 50
        )
      }
    }

    // 处理采集结果，保存成功的商品到采集箱
    const successfulProducts = collectionResults
      .filter(result => result.success && result.product)
      .map(result => result.product!)

    // 保存到服务端临时存储，供前端获取
    addCompletedProducts(successfulProducts)

    // 更新任务统计
    task.collectedProducts = successfulProducts.length
    task.failedProducts = collectionResults.length - successfulProducts.length
    task.progress = 100

    // 完成任务
    task.status = 'completed'
    task.endTime = new Date().toISOString()
    task.updatedAt = new Date().toISOString()

    console.log(`采集任务完成: ${task.id}, 成功: ${task.collectedProducts}, 失败: ${task.failedProducts}`)

  } catch (error) {
    console.error('真实采集任务处理失败:', error)
    task.status = 'failed'
    task.errorMessage = error instanceof Error ? error.message : '未知错误'
    task.updatedAt = new Date().toISOString()
  }
}



// 获取任务列表（用于任务监控）
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      tasks: mockTasks.slice(0, 50) // 返回最近50个任务
    })
  } catch (error) {
    console.error('获取智能采集任务失败:', error)
    return NextResponse.json({
      success: false,
      message: '获取任务列表失败'
    }, { status: 500 })
  }
}
