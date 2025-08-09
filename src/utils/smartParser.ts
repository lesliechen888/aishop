// 智能采集解析引擎
import { Platform, PlatformDetection } from '@/types/collection'
import { platformDetector } from './platformDetector'

// 采集意图类型
export type CollectionIntent = 'product' | 'shop' | 'batch'

// URL解析结果
export interface ParsedUrl {
  id: string
  originalUrl: string
  cleanUrl: string
  platform: Platform | null
  intent: CollectionIntent
  confidence: number
  productId?: string
  shopId?: string
  isValid: boolean
  error?: string
  suggestions?: string[]
}

// 智能解析结果
export interface SmartParseResult {
  urls: ParsedUrl[]
  summary: {
    total: number
    valid: number
    invalid: number
    byPlatform: Record<Platform, number>
    byIntent: Record<CollectionIntent, number>
  }
  errors: string[]
  warnings: string[]
}

// URL意图识别模式
const intentPatterns = {
  // 商品详情页模式
  product: [
    // 淘宝/天猫商品页
    /item\.(taobao|tmall)\.com\/item\.htm/,
    // 1688商品页
    /detail\.1688\.com\/offer\/\d+\.html/,
    /1688\.com\/offer\/\d+\.html/,
    // 拼多多商品页
    /(pinduoduo|yangkeduo)\.com\/goods\.html/,
    // 抖音小店商品页
    /jinritemai\.com\/views\/product\/item/,
    // Temu商品页
    /temu\.com\/goods\.html/,
    /temu\.com\/.*_g_\d+/
  ],
  
  // 店铺页面模式
  shop: [
    // 淘宝店铺
    /shop\d+\.taobao\.com/,
    /.*\.taobao\.com\/shop/,
    // 天猫店铺
    /.*\.tmall\.com\/shop/,
    /.*\.tmall\.com$/,
    // 1688店铺
    /.*\.1688\.com$/,
    /shop\.1688\.com/,
    // 拼多多店铺
    /pinduoduo\.com\/mall/,
    // 抖音小店店铺
    /jinritemai\.com\/views\/shop/
  ]
}

export class SmartParser {
  // 智能解析URL列表
  parseUrls(input: string): SmartParseResult {
    const urls = this.preprocessUrls(input)
    const parsedUrls: ParsedUrl[] = []
    const errors: string[] = []
    const warnings: string[] = []

    urls.forEach((url, index) => {
      try {
        const parsed = this.parseUrl(url, index)
        parsedUrls.push(parsed)
        
        if (!parsed.isValid && parsed.error) {
          errors.push(`第${index + 1}行: ${parsed.error}`)
        }
        
        if (parsed.confidence < 0.7) {
          warnings.push(`第${index + 1}行: 识别置信度较低 (${Math.round(parsed.confidence * 100)}%)`)
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : '未知错误'
        errors.push(`第${index + 1}行: ${errorMsg}`)
        
        parsedUrls.push({
          id: `url-${index}`,
          originalUrl: url,
          cleanUrl: url,
          platform: null,
          intent: 'product',
          confidence: 0,
          isValid: false,
          error: errorMsg
        })
      }
    })

    return {
      urls: parsedUrls,
      summary: this.generateSummary(parsedUrls),
      errors,
      warnings
    }
  }

  // URL预处理
  private preprocessUrls(input: string): string[] {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => !line.startsWith('#')) // 过滤注释行
      .filter(line => !line.startsWith('//')) // 过滤注释行
      .filter((url, index, array) => array.indexOf(url) === index) // 去重
  }

  // 解析单个URL
  private parseUrl(url: string, index: number): ParsedUrl {
    const id = `url-${index}`
    
    // 基础URL验证
    if (!this.isValidUrl(url)) {
      return {
        id,
        originalUrl: url,
        cleanUrl: url,
        platform: null,
        intent: 'product',
        confidence: 0,
        isValid: false,
        error: 'URL格式无效',
        suggestions: this.generateUrlSuggestions(url)
      }
    }

    // 平台检测
    const detection = platformDetector.detectPlatform(url)
    
    if (!detection.platform) {
      return {
        id,
        originalUrl: url,
        cleanUrl: detection.url,
        platform: null,
        intent: 'product',
        confidence: 0,
        isValid: false,
        error: '无法识别电商平台',
        suggestions: ['请检查URL是否来自支持的电商平台']
      }
    }

    // 意图识别
    const intent = this.detectIntent(detection.url)
    
    // 参数提取
    const productId = detection.productId
    const shopId = this.extractShopId(detection.url, detection.platform)

    return {
      id,
      originalUrl: url,
      cleanUrl: detection.url,
      platform: detection.platform,
      intent,
      confidence: this.calculateConfidence(detection, intent, productId, shopId),
      productId,
      shopId,
      isValid: true
    }
  }

  // URL有效性验证
  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      // 尝试添加协议
      try {
        new URL(`https://${url}`)
        return true
      } catch {
        return false
      }
    }
  }

  // 意图检测
  private detectIntent(url: string): CollectionIntent {
    // 检查是否为商品页面
    for (const pattern of intentPatterns.product) {
      if (pattern.test(url)) {
        return 'product'
      }
    }

    // 检查是否为店铺页面
    for (const pattern of intentPatterns.shop) {
      if (pattern.test(url)) {
        return 'shop'
      }
    }

    // 默认为商品采集
    return 'product'
  }

  // 提取店铺ID
  private extractShopId(url: string, platform: Platform): string | undefined {
    const shopPatterns: Record<Platform, RegExp[]> = {
      'taobao': [/shop(\d+)\.taobao\.com/, /taobao\.com\/shop\/view_shop\.htm\?user_number_id=(\d+)/],
      '1688': [/(\w+)\.1688\.com/, /shop\.1688\.com\/(\w+)/],
      'pdd': [/pinduoduo\.com\/mall\?mall_id=(\d+)/],
      'douyin': [/jinritemai\.com\/views\/shop\/(\w+)/],
      'temu': [/temu\.com\/store\/(\w+)/]
    }

    const patterns = shopPatterns[platform] || []
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return undefined
  }

  // 计算置信度
  private calculateConfidence(
    detection: PlatformDetection,
    intent: CollectionIntent,
    productId?: string,
    shopId?: string
  ): number {
    let confidence = detection.confidence

    // 根据意图和参数调整置信度
    if (intent === 'product' && productId) {
      confidence = Math.min(confidence + 0.1, 1.0)
    }
    
    if (intent === 'shop' && shopId) {
      confidence = Math.min(confidence + 0.1, 1.0)
    }

    // 如果没有提取到关键参数，降低置信度
    if (intent === 'product' && !productId) {
      confidence = Math.max(confidence - 0.2, 0.3)
    }
    
    if (intent === 'shop' && !shopId) {
      confidence = Math.max(confidence - 0.2, 0.3)
    }

    return Math.round(confidence * 100) / 100
  }

  // 生成URL建议
  private generateUrlSuggestions(url: string): string[] {
    const suggestions: string[] = []

    // 检查是否缺少协议
    if (!url.startsWith('http')) {
      suggestions.push(`尝试添加协议: https://${url}`)
    }

    // 检查常见错误
    if (url.includes('taobao') && !url.includes('.com')) {
      suggestions.push('淘宝URL应包含 .taobao.com')
    }

    if (url.includes('1688') && !url.includes('.com')) {
      suggestions.push('1688URL应包含 .1688.com')
    }

    return suggestions
  }



  // 批量修正URL
  updateUrl(urlId: string, updates: Partial<ParsedUrl>, urls: ParsedUrl[]): ParsedUrl[] {
    return urls.map(url => {
      if (url.id === urlId) {
        const updated = { ...url, ...updates }
        // 重新计算置信度
        if (updates.platform || updates.intent) {
          updated.confidence = this.calculateConfidence(
            { platform: updated.platform, confidence: 0.8, url: updated.cleanUrl, isValid: true },
            updated.intent,
            updated.productId,
            updated.shopId
          )
        }
        return updated
      }
      return url
    })
  }

  // 删除URL
  removeUrl(urlId: string, urls: ParsedUrl[]): ParsedUrl[] {
    return urls.filter(url => url.id !== urlId)
  }

  // 验证所有URL是否可以开始采集
  validateForCollection(urls: ParsedUrl[]): { canStart: boolean; errors: string[] } {
    const errors: string[] = []
    const validUrls = urls.filter(url => url.isValid)

    if (validUrls.length === 0) {
      errors.push('没有有效的URL可以采集')
    }

    // 检查低置信度URL
    const lowConfidenceUrls = validUrls.filter(url => url.confidence < 0.5)
    if (lowConfidenceUrls.length > 0) {
      errors.push(`${lowConfidenceUrls.length}个URL识别置信度过低，建议手动确认`)
    }

    return {
      canStart: errors.length === 0,
      errors
    }
  }

  // 生成统计摘要（公开方法）
  generateSummary(urls: ParsedUrl[]): SmartParseResult['summary'] {
    const summary = {
      total: urls.length,
      valid: 0,
      invalid: 0,
      byPlatform: {} as Record<Platform, number>,
      byIntent: {} as Record<CollectionIntent, number>
    }

    urls.forEach(url => {
      if (url.isValid) {
        summary.valid++

        if (url.platform) {
          summary.byPlatform[url.platform] = (summary.byPlatform[url.platform] || 0) + 1
        }

        summary.byIntent[url.intent] = (summary.byIntent[url.intent] || 0) + 1
      } else {
        summary.invalid++
      }
    })

    return summary
  }
}

// 创建默认解析器实例
export const smartParser = new SmartParser()

// 导出工具函数
export const parseUrls = (input: string) => smartParser.parseUrls(input)
export const updateUrl = (urlId: string, updates: Partial<ParsedUrl>, urls: ParsedUrl[]) => 
  smartParser.updateUrl(urlId, updates, urls)
export const removeUrl = (urlId: string, urls: ParsedUrl[]) => 
  smartParser.removeUrl(urlId, urls)
export const validateForCollection = (urls: ParsedUrl[]) => 
  smartParser.validateForCollection(urls)
