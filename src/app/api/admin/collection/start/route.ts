import { NextRequest, NextResponse } from 'next/server'
import { CollectionTask, CollectionSettings, Platform } from '@/types/collection'
import { platformDetector } from '@/utils/platformDetector'
import { contentFilter } from '@/utils/contentFilter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { method, platform, urls, shopUrl, name, settings } = body

    // 验证输入
    if (!method || !settings) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 创建采集任务
    const task: CollectionTask = {
      id: `task-${Date.now()}`,
      name: name || `${method === 'single' ? '单链接' : method === 'batch' ? '批量' : '店铺'}采集-${new Date().toLocaleString()}`,
      platform: platform || 'taobao',
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

    // 这里应该将任务保存到数据库并启动后台采集进程
    console.log('创建采集任务:', task)

    // 模拟启动采集进程
    setTimeout(() => {
      processCollectionTask(task)
    }, 1000)

    return NextResponse.json({
      success: true,
      task,
      message: '采集任务已启动'
    })
  } catch (error) {
    console.error('启动采集任务失败:', error)
    return NextResponse.json(
      { success: false, message: '启动采集任务失败' },
      { status: 500 }
    )
  }
}

// 模拟采集处理函数
async function processCollectionTask(task: CollectionTask) {
  try {
    console.log(`开始处理采集任务: ${task.id}`)
    
    // 更新任务状态为处理中
    task.status = 'processing'
    
    if (task.method === 'single') {
      await processSingleUrl(task, task.urls[0])
    } else if (task.method === 'batch') {
      await processBatchUrls(task, task.urls)
    } else if (task.method === 'shop') {
      await processShopUrl(task, task.shopUrl!)
    }
    
    // 更新任务状态为完成
    task.status = 'completed'
    task.endTime = new Date().toISOString()
    task.progress = 100
    
    console.log(`采集任务完成: ${task.id}`)
  } catch (error) {
    console.error(`采集任务失败: ${task.id}`, error)
    task.status = 'failed'
    task.errorMessage = error instanceof Error ? error.message : '未知错误'
  }
}

// 处理单个URL
async function processSingleUrl(task: CollectionTask, url: string) {
  try {
    const detection = platformDetector.detectPlatform(url)
    if (!detection.platform) {
      throw new Error('无法识别商品链接')
    }

    // 模拟采集商品数据
    const productData = await mockCollectProduct(url, detection.platform)
    
    // 应用内容过滤
    const { filteredData, allResults } = contentFilter.filterProductData(productData)
    
    // 保存到采集箱
    const collectedProduct = {
      ...filteredData,
      id: `product-${Date.now()}`,
      taskId: task.id,
      platform: detection.platform,
      originalUrl: url,
      status: 'draft',
      filterResults: allResults,
      collectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    console.log('采集到商品:', collectedProduct.title)
    task.collectedProducts++
    task.progress = (task.collectedProducts / task.totalProducts) * 100
  } catch (error) {
    console.error('采集单个商品失败:', error)
    task.failedProducts++
  }
}

// 处理批量URL
async function processBatchUrls(task: CollectionTask, urls: string[]) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i].trim()
    if (!url) continue
    
    try {
      await processSingleUrl(task, url)
      
      // 添加延迟避免被限制
      if (task.settings.delay > 0) {
        await new Promise(resolve => setTimeout(resolve, task.settings.delay))
      }
    } catch (error) {
      console.error(`批量采集第${i + 1}个商品失败:`, error)
    }
    
    // 更新进度
    task.progress = ((i + 1) / urls.length) * 100
  }
}

// 处理店铺URL
async function processShopUrl(task: CollectionTask, shopUrl: string) {
  try {
    const detection = platformDetector.detectShop(shopUrl)
    if (!detection.platform) {
      throw new Error('无法识别店铺链接')
    }

    // 模拟获取店铺商品列表
    const productUrls = await mockGetShopProducts(shopUrl, detection.platform, task.settings.maxProducts)
    
    task.totalProducts = productUrls.length
    task.urls = productUrls
    
    // 批量采集店铺商品
    await processBatchUrls(task, productUrls)
  } catch (error) {
    console.error('采集店铺失败:', error)
    throw error
  }
}

// 模拟采集商品数据
async function mockCollectProduct(url: string, platform: Platform) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
  
  const mockProducts = {
    '1688': {
      title: '厂家直销优质T恤 纯棉短袖 多色可选 支持定制LOGO',
      description: '采用优质纯棉面料，舒适透气，做工精细，支持多种颜色和尺码选择。厂家直销，价格优惠，支持批发定制。',
      price: 15.8,
      originalPrice: 25.0,
      currency: 'CNY',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
      ],
      specifications: {
        '材质': '100%纯棉',
        '颜色': '白色/黑色/灰色',
        '尺码': 'S/M/L/XL/XXL',
        '产地': '广东省东莞市',
        '起订量': '50件'
      },
      variants: [
        { id: 'v1', name: '白色-M', price: 15.8, stock: 1000, sku: 'TSH-WHT-M', attributes: { '颜色': '白色', '尺码': 'M' } },
        { id: 'v2', name: '黑色-L', price: 15.8, stock: 800, sku: 'TSH-BLK-L', attributes: { '颜色': '黑色', '尺码': 'L' } }
      ],
      shopName: '优质服装厂',
      shopUrl: 'https://shop123.1688.com',
      sales: 5680,
      rating: 4.8,
      reviewCount: 1234
    },
    'taobao': {
      title: '【天猫超市】纯棉T恤男女同款 简约百搭 包邮到家',
      description: '天猫超市自营，品质保证。采用新疆长绒棉，柔软亲肤，版型修身，多色可选。全国包邮，7天无理由退换。',
      price: 39.9,
      originalPrice: 59.9,
      currency: 'CNY',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop'
      ],
      specifications: {
        '品牌': '优衣库',
        '材质': '100%棉',
        '颜色': '白色/黑色/灰色/蓝色',
        '尺码': 'XS/S/M/L/XL',
        '产地': '中国'
      },
      variants: [
        { id: 'v1', name: '白色-M', price: 39.9, stock: 500, sku: 'UNI-WHT-M', attributes: { '颜色': '白色', '尺码': 'M' } },
        { id: 'v2', name: '黑色-L', price: 39.9, stock: 300, sku: 'UNI-BLK-L', attributes: { '颜色': '黑色', '尺码': 'L' } }
      ],
      shopName: '天猫超市',
      shopUrl: 'https://chaoshi.tmall.com',
      sales: 12580,
      rating: 4.9,
      reviewCount: 3456
    }
  }
  
  const platformData = mockProducts[platform] || mockProducts['taobao']
  
  return {
    ...platformData,
    rawData: { url, platform, collectedAt: new Date().toISOString() }
  }
}

// 模拟获取店铺商品列表
async function mockGetShopProducts(shopUrl: string, platform: Platform, maxProducts: number): Promise<string[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const mockUrls: string[] = []
  const count = Math.min(maxProducts, 20) // 限制模拟数量
  
  for (let i = 1; i <= count; i++) {
    const productId = `${Date.now()}${i.toString().padStart(3, '0')}`
    let url = ''
    
    switch (platform) {
      case '1688':
        url = `https://detail.1688.com/offer/${productId}.html`
        break
      case 'taobao':
        url = `https://item.taobao.com/item.htm?id=${productId}`
        break
      case 'pdd':
        url = `https://mobile.yangkeduo.com/goods.html?goods_id=${productId}`
        break
      default:
        url = `https://example.com/product/${productId}`
    }
    
    mockUrls.push(url)
  }
  
  return mockUrls
}
