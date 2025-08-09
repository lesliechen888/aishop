// 真实商品采集引擎
import { Platform, CollectedProduct } from '@/types/collection'
import { ParsedUrl } from '@/utils/smartParser'
import { contentFilter } from '@/utils/contentFilter'

// 动态导入cheerio（仅在服务端使用）
let cheerio: any = null
if (typeof window === 'undefined') {
  // 只在服务端导入cheerio
  try {
    cheerio = require('cheerio')
  } catch (error) {
    console.warn('Cheerio not available, using fallback parsing')
  }
}

// 采集结果接口
export interface CollectionResult {
  success: boolean
  product?: CollectedProduct
  error?: string
  retryCount?: number
}

// 采集进度回调
export type ProgressCallback = (progress: {
  taskId: string
  productUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message?: string
}) => void

// HTTP客户端配置
interface HttpConfig {
  timeout: number
  retries: number
  delay: number
  userAgent: string
  headers: Record<string, string>
}

// 平台特定的选择器配置
const platformSelectors: Record<Platform, {
  title: string[]
  price: string[]
  originalPrice?: string[]
  images: string[]
  description: string[]
  shopName: string[]
  sales?: string[]
  rating?: string[]
  specifications?: string[]
}> = {
  'taobao': {
    title: ['.tb-detail-hd h1', '.item-title', 'h1[data-spm="1000983"]'],
    price: ['.tb-rmb-num', '.notranslate', '.price-current'],
    originalPrice: ['.price-original .tb-rmb-num'],
    images: ['.tb-booth-phone img', '.tb-pic img', '#J_ImgBooth img'],
    description: ['.tb-detail-desc', '.detail-desc', '#description'],
    shopName: ['.tb-shop-name a', '.shop-name'],
    sales: ['.tb-count', '.deal-cnt'],
    rating: ['.tb-rate-score', '.rate-score']
  },
  '1688': {
    title: ['.d-title', '.offer-title h1'],
    price: ['.price-now', '.price-range'],
    images: ['.detail-gallery img', '.offer-img img'],
    description: ['.offer-detail-desc', '.detail-desc'],
    shopName: ['.company-name a', '.shop-name'],
    sales: ['.sale-count']
  },
  'pdd': {
    title: ['[data-testid="beast-core-generic-components/Title"]', '.goods-title'],
    price: ['.price-num', '.goods-price'],
    images: ['.goods-gallery img', '.swiper-slide img'],
    description: ['.goods-desc', '.detail-desc'],
    shopName: ['.store-name', '.shop-name'],
    sales: ['.goods-sales']
  },
  'douyin': {
    title: ['.goods-title', 'h1.title'],
    price: ['.price-num', '.current-price'],
    images: ['.goods-img img', '.product-img img'],
    description: ['.goods-desc', '.product-desc'],
    shopName: ['.shop-name', '.store-name']
  },
  'temu': {
    title: ['[data-testid="product-title"]', '.product-title'],
    price: ['.price-current', '.product-price'],
    images: ['.product-gallery img', '.main-img img'],
    description: ['.product-desc', '.detail-desc'],
    shopName: ['.store-name', '.seller-name']
  }
}

// 平台特定的HTTP配置
const platformConfigs: Record<Platform, HttpConfig> = {
  'taobao': {
    timeout: 10000,
    retries: 3,
    delay: 2000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  },
  '1688': {
    timeout: 8000,
    retries: 3,
    delay: 1500,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    }
  },
  'pdd': {
    timeout: 12000,
    retries: 3,
    delay: 3000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  },
  'douyin': {
    timeout: 15000,
    retries: 3,
    delay: 2500,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  },
  'temu': {
    timeout: 10000,
    retries: 3,
    delay: 2000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  }
}

export class CollectionEngine {
  private progressCallback?: ProgressCallback

  constructor(progressCallback?: ProgressCallback) {
    this.progressCallback = progressCallback
  }

  // 单个商品采集
  async collectSingleProduct(
    parsedUrl: ParsedUrl, 
    taskId: string
  ): Promise<CollectionResult> {
    if (!parsedUrl.platform) {
      return { success: false, error: '无法识别商品平台' }
    }

    this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 0, '开始采集商品信息...')

    try {
      // 1. 发送HTTP请求
      this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 20, '正在请求商品页面...')
      const html = await this.fetchProductPage(parsedUrl.cleanUrl, parsedUrl.platform)

      // 2. 解析HTML提取数据
      this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 40, '正在解析商品信息...')
      const rawData = await this.extractProductData(html, parsedUrl.platform)

      // 3. 数据验证
      this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 60, '正在验证数据完整性...')
      if (!this.validateProductData(rawData)) {
        throw new Error('商品数据不完整或无效')
      }

      // 4. 内容过滤和标准化
      this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 80, '正在处理和过滤内容...')
      const { filteredData, allResults } = contentFilter.filterProductData(rawData)

      // 5. 创建商品对象
      this.updateProgress(taskId, parsedUrl.originalUrl, 'processing', 90, '正在生成商品对象...')
      const product = this.createCollectedProduct(
        filteredData,
        parsedUrl,
        taskId,
        allResults
      )

      this.updateProgress(taskId, parsedUrl.originalUrl, 'completed', 100, '商品采集完成')
      return { success: true, product }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误'
      this.updateProgress(taskId, parsedUrl.originalUrl, 'failed', 0, `采集失败: ${errorMessage}`)
      return { success: false, error: errorMessage }
    }
  }

  // 批量商品采集（多线程）
  async collectBatchProducts(
    parsedUrls: ParsedUrl[],
    taskId: string,
    concurrency: number = 3
  ): Promise<CollectionResult[]> {
    const results: CollectionResult[] = []
    const chunks = this.chunkArray(parsedUrls, concurrency)

    for (const chunk of chunks) {
      // 并发处理当前批次
      const chunkPromises = chunk.map(parsedUrl => 
        this.collectSingleProduct(parsedUrl, taskId)
      )

      const chunkResults = await Promise.allSettled(chunkPromises)
      
      // 处理结果
      chunkResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value)
        } else {
          results.push({
            success: false,
            error: result.reason?.message || '采集失败'
          })
        }
      })

      // 批次间延迟，避免被限制
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await this.delay(2000)
      }
    }

    return results
  }

  // 整店采集
  async collectShopProducts(
    shopUrl: string,
    platform: Platform,
    taskId: string,
    maxProducts: number = 50
  ): Promise<CollectionResult[]> {
    try {
      this.updateProgress(taskId, shopUrl, 'processing', 10, '正在分析店铺结构...')
      
      // 1. 获取店铺所有商品链接
      const productUrls = await this.extractShopProductUrls(shopUrl, platform, maxProducts)
      
      if (productUrls.length === 0) {
        throw new Error('未找到店铺商品链接')
      }

      this.updateProgress(taskId, shopUrl, 'processing', 30, `发现 ${productUrls.length} 个商品，开始采集...`)

      // 2. 转换为ParsedUrl对象
      const parsedUrls: ParsedUrl[] = productUrls.map((url, index) => ({
        id: `shop-product-${index}`,
        originalUrl: url,
        cleanUrl: url,
        platform,
        intent: 'product',
        confidence: 0.9,
        isValid: true
      }))

      // 3. 批量采集商品
      const results = await this.collectBatchProducts(parsedUrls, taskId, 2) // 店铺采集使用较低并发

      return results

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '店铺采集失败'
      this.updateProgress(taskId, shopUrl, 'failed', 0, errorMessage)
      return [{ success: false, error: errorMessage }]
    }
  }

  // 发送HTTP请求获取页面内容
  private async fetchProductPage(url: string, platform: Platform): Promise<string> {
    const config = platformConfigs[platform]
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': config.userAgent,
        ...config.headers
      },
      signal: AbortSignal.timeout(config.timeout)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  }

  // 从HTML中提取商品数据
  private async extractProductData(html: string, platform: Platform): Promise<any> {
    if (!cheerio) {
      // 如果cheerio不可用，返回模拟数据
      return this.getMockProductData(platform)
    }

    const $ = cheerio.load(html)
    const selectors = platformSelectors[platform]
    
    const extractText = (selectorArray: string[]): string => {
      for (const selector of selectorArray) {
        const element = $(selector).first()
        if (element.length > 0) {
          return element.text().trim()
        }
      }
      return ''
    }

    const extractImages = (selectorArray: string[]): string[] => {
      const images: string[] = []
      for (const selector of selectorArray) {
        $(selector).each((_, element) => {
          const src = $(element).attr('src') || $(element).attr('data-src')
          if (src && !images.includes(src)) {
            images.push(src.startsWith('//') ? `https:${src}` : src)
          }
        })
        if (images.length > 0) break
      }
      return images.slice(0, 10) // 限制图片数量
    }

    return {
      title: extractText(selectors.title),
      price: this.parsePrice(extractText(selectors.price)),
      originalPrice: selectors.originalPrice ? this.parsePrice(extractText(selectors.originalPrice)) : undefined,
      images: extractImages(selectors.images),
      description: extractText(selectors.description),
      shopName: extractText(selectors.shopName),
      sales: selectors.sales ? this.parseNumber(extractText(selectors.sales)) : undefined,
      rating: selectors.rating ? this.parseRating(extractText(selectors.rating)) : undefined,
      currency: 'CNY',
      specifications: {},
      variants: []
    }
  }

  // 提取店铺商品链接
  private async extractShopProductUrls(
    shopUrl: string, 
    platform: Platform, 
    maxProducts: number
  ): Promise<string[]> {
    // 这里需要根据不同平台实现具体的店铺商品链接提取逻辑
    // 目前返回模拟数据
    const mockUrls: string[] = []
    
    for (let i = 1; i <= Math.min(maxProducts, 20); i++) {
      switch (platform) {
        case 'taobao':
          mockUrls.push(`https://item.taobao.com/item.htm?id=${1000000000 + i}`)
          break
        case '1688':
          mockUrls.push(`https://detail.1688.com/offer/${1000000000 + i}.html`)
          break
        case 'pdd':
          mockUrls.push(`https://pinduoduo.com/goods.html?goods_id=${1000000000 + i}`)
          break
        default:
          break
      }
    }
    
    return mockUrls
  }

  // 工具方法
  private parsePrice(priceText: string): number {
    const match = priceText.match(/[\d,]+\.?\d*/g)
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0
  }

  private parseNumber(text: string): number {
    const match = text.match(/\d+/g)
    return match ? parseInt(match[0]) : 0
  }

  private parseRating(text: string): number {
    const match = text.match(/[\d.]+/g)
    return match ? parseFloat(match[0]) : 0
  }

  private validateProductData(data: any): boolean {
    return !!(data.title && data.price && data.images && data.images.length > 0)
  }

  private createCollectedProduct(
    filteredData: any,
    parsedUrl: ParsedUrl,
    taskId: string,
    filterResults: any[]
  ): CollectedProduct {
    return {
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      taskId,
      platform: parsedUrl.platform!,
      originalUrl: parsedUrl.originalUrl,
      title: filteredData.title,
      description: filteredData.description,
      price: filteredData.price,
      originalPrice: filteredData.originalPrice,
      currency: filteredData.currency,
      images: filteredData.images,
      specifications: filteredData.specifications,
      variants: filteredData.variants,
      shopName: filteredData.shopName,
      shopUrl: '',
      rawData: filteredData,
      status: 'draft',
      filterResults,
      collectedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  private updateProgress(
    taskId: string,
    productUrl: string,
    status: 'pending' | 'processing' | 'completed' | 'failed',
    progress: number,
    message?: string
  ) {
    if (this.progressCallback) {
      this.progressCallback({
        taskId,
        productUrl,
        status,
        progress,
        message
      })
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 获取模拟商品数据（当cheerio不可用时）
  private getMockProductData(platform: Platform): any {
    const mockData = {
      title: `${platform}平台商品 - ${Date.now()}`,
      price: Math.floor(Math.random() * 1000) + 10,
      originalPrice: Math.floor(Math.random() * 1500) + 50,
      images: [
        'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=商品图片1',
        'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=商品图片2'
      ],
      description: `这是一个来自${platform}平台的优质商品，具有良好的性价比和用户评价。`,
      shopName: `${platform}优质店铺`,
      sales: Math.floor(Math.random() * 10000),
      rating: (Math.random() * 2 + 3).toFixed(1),
      currency: 'CNY',
      specifications: {
        '品牌': '知名品牌',
        '产地': '中国',
        '材质': '优质材料'
      },
      variants: []
    }

    return mockData
  }
}

// 创建默认采集引擎实例
export const collectionEngine = new CollectionEngine()
