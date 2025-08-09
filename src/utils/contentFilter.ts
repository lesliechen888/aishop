// 内容过滤系统

import { FilterResult, ContentFilterConfig } from '@/types/collection'

// 默认过滤配置
export const defaultFilterConfig: ContentFilterConfig = {
  keywords: {
    platforms: [
      '淘宝', '天猫', 'taobao', 'tmall',
      '京东', 'jd.com', '京东商城',
      '拼多多', 'pdd', 'pinduoduo',
      '1688', 'alibaba', '阿里巴巴',
      '抖音', 'douyin', '抖音小店',
      'temu', 'Temu',
      '微信', 'wechat', '支付宝', 'alipay'
    ],
    regions: [
      '中国', '大陆', '内地', '国内',
      '北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '重庆', '天津',
      '江苏', '浙江', '广东', '山东', '河南', '四川', '湖北', '湖南', '安徽', '河北',
      '福建', '江西', '云南', '贵州', '山西', '陕西', '甘肃', '青海', '宁夏', '新疆',
      '西藏', '内蒙古', '广西', '海南', '黑龙江', '吉林', '辽宁',
      '省', '市', '区', '县', '镇', '村', '街道', '路', '号'
    ],
    shipping: [
      '包邮', '免邮', '顺丰', '申通', '圆通', '中通', '韵达', '百世', 'EMS',
      '快递', '物流', '配送', '发货', '到付', '货到付款',
      '次日达', '当日达', '48小时', '72小时',
      '运费', '邮费', '快递费'
    ],
    custom: []
  },
  patterns: {
    phoneNumbers: /1[3-9]\d{9}/g,
    emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    urls: /(https?:\/\/[^\s]+)/g,
    chineseRegions: /[北上广深杭南武成重天津][京海州圳州京汉都庆津]|[江浙广山河四湖安福云贵陕甘青宁新西内黑吉辽][苏江东东南川北南徽建南州西肃海夏疆藏蒙龙林宁][省市区]/g
  },
  replacements: {
    '中国': '',
    '大陆': '',
    '国内': '',
    '包邮': '免运费',
    '快递': '配送',
    '顺丰': '快速配送',
    '淘宝': '商城',
    '天猫': '商城',
    '京东': '商城',
    '拼多多': '商城'
  }
}

// 内容过滤器类
export class ContentFilter {
  private config: ContentFilterConfig

  constructor(config: ContentFilterConfig = defaultFilterConfig) {
    this.config = config
  }

  // 过滤文本内容
  filterText(text: string, enabledFilters: string[] = ['platforms', 'regions', 'shipping']): {
    filteredText: string
    results: FilterResult[]
  } {
    let filteredText = text
    const results: FilterResult[] = []

    // 关键词过滤
    enabledFilters.forEach(filterType => {
      if (this.config.keywords[filterType as keyof typeof this.config.keywords]) {
        const keywords = this.config.keywords[filterType as keyof typeof this.config.keywords]
        keywords.forEach(keyword => {
          if (filteredText.includes(keyword)) {
            const replacement = this.config.replacements[keyword] || ''
            const originalValue = keyword
            filteredText = filteredText.replace(new RegExp(keyword, 'gi'), replacement)
            
            results.push({
              type: filterType as any,
              field: 'text',
              originalValue,
              filteredValue: replacement,
              action: replacement ? 'replaced' : 'removed'
            })
          }
        })
      }
    })

    // 正则表达式过滤
    Object.entries(this.config.patterns).forEach(([patternName, pattern]) => {
      const matches = filteredText.match(pattern)
      if (matches) {
        matches.forEach(match => {
          filteredText = filteredText.replace(match, '')
          results.push({
            type: 'keyword',
            field: patternName,
            originalValue: match,
            filteredValue: '',
            action: 'removed'
          })
        })
      }
    })

    return {
      filteredText: filteredText.trim().replace(/\s+/g, ' '),
      results
    }
  }

  // 过滤商品标题
  filterTitle(title: string): { filteredTitle: string; results: FilterResult[] } {
    const { filteredText, results } = this.filterText(title, ['platforms', 'regions'])
    
    // 额外的标题优化
    let optimizedTitle = filteredText
    
    // 移除多余的符号
    optimizedTitle = optimizedTitle.replace(/[【】\[\]（）()]/g, ' ')
    optimizedTitle = optimizedTitle.replace(/\s+/g, ' ').trim()
    
    // 限制长度
    if (optimizedTitle.length > 60) {
      optimizedTitle = optimizedTitle.substring(0, 60) + '...'
      results.push({
        type: 'keyword',
        field: 'title',
        originalValue: filteredText,
        filteredValue: optimizedTitle,
        action: 'replaced'
      })
    }

    return {
      filteredTitle: optimizedTitle,
      results
    }
  }

  // 过滤商品描述
  filterDescription(description: string): { filteredDescription: string; results: FilterResult[] } {
    const { filteredText, results } = this.filterText(description, ['platforms', 'regions', 'shipping'])
    
    // 移除HTML标签
    let cleanDescription = filteredText.replace(/<[^>]*>/g, '')
    
    // 移除多余的换行和空格
    cleanDescription = cleanDescription.replace(/\n\s*\n/g, '\n').trim()

    return {
      filteredDescription: cleanDescription,
      results
    }
  }

  // 过滤图片URL
  filterImageUrls(urls: string[]): { filteredUrls: string[]; results: FilterResult[] } {
    const results: FilterResult[] = []
    const filteredUrls = urls.filter(url => {
      // 检查是否包含平台特定的域名
      const platformDomains = ['taobao.com', 'tmall.com', 'jd.com', 'pinduoduo.com', '1688.com']
      const containsPlatformDomain = platformDomains.some(domain => url.includes(domain))
      
      if (containsPlatformDomain) {
        results.push({
          type: 'platform',
          field: 'imageUrl',
          originalValue: url,
          filteredValue: '',
          action: 'flagged'
        })
        return false
      }
      
      return true
    })

    return { filteredUrls, results }
  }

  // 过滤商品规格
  filterSpecifications(specs: Record<string, any>): { 
    filteredSpecs: Record<string, any>; 
    results: FilterResult[] 
  } {
    const filteredSpecs: Record<string, any> = {}
    const results: FilterResult[] = []

    Object.entries(specs).forEach(([key, value]) => {
      const { filteredText: filteredKey, results: keyResults } = this.filterText(key, ['regions', 'shipping'])
      const { filteredText: filteredValue, results: valueResults } = this.filterText(String(value), ['regions', 'shipping'])
      
      if (filteredKey && filteredValue) {
        filteredSpecs[filteredKey] = filteredValue
      }
      
      results.push(...keyResults, ...valueResults)
    })

    return { filteredSpecs, results }
  }

  // 检测敏感内容
  detectSensitiveContent(text: string): {
    hasSensitiveContent: boolean
    sensitiveItems: string[]
    confidence: number
  } {
    const sensitiveItems: string[] = []
    let totalMatches = 0

    // 检查所有关键词
    Object.values(this.config.keywords).flat().forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        sensitiveItems.push(keyword)
        totalMatches++
      }
    })

    // 检查正则表达式
    Object.entries(this.config.patterns).forEach(([patternName, pattern]) => {
      const matches = text.match(pattern)
      if (matches) {
        sensitiveItems.push(...matches)
        totalMatches += matches.length
      }
    })

    const confidence = Math.min(totalMatches / 10, 1) // 最多10个匹配项为100%置信度

    return {
      hasSensitiveContent: sensitiveItems.length > 0,
      sensitiveItems: [...new Set(sensitiveItems)],
      confidence
    }
  }

  // 批量过滤商品数据
  filterProductData(productData: any): {
    filteredData: any
    allResults: FilterResult[]
  } {
    const allResults: FilterResult[] = []
    const filteredData = { ...productData }

    // 过滤标题
    if (productData.title) {
      const { filteredTitle, results } = this.filterTitle(productData.title)
      filteredData.title = filteredTitle
      allResults.push(...results)
    }

    // 过滤描述
    if (productData.description) {
      const { filteredDescription, results } = this.filterDescription(productData.description)
      filteredData.description = filteredDescription
      allResults.push(...results)
    }

    // 过滤图片URL
    if (productData.images && Array.isArray(productData.images)) {
      const { filteredUrls, results } = this.filterImageUrls(productData.images)
      filteredData.images = filteredUrls
      allResults.push(...results)
    }

    // 过滤规格
    if (productData.specifications) {
      const { filteredSpecs, results } = this.filterSpecifications(productData.specifications)
      filteredData.specifications = filteredSpecs
      allResults.push(...results)
    }

    return { filteredData, allResults }
  }

  // 更新过滤配置
  updateConfig(newConfig: Partial<ContentFilterConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  // 添加自定义关键词
  addCustomKeywords(keywords: string[]) {
    this.config.keywords.custom.push(...keywords)
  }

  // 添加自定义替换规则
  addReplacements(replacements: Record<string, string>) {
    this.config.replacements = { ...this.config.replacements, ...replacements }
  }
}

// 创建默认过滤器实例
export const contentFilter = new ContentFilter()

// 导出工具函数
export const filterProductTitle = (title: string) => contentFilter.filterTitle(title)
export const filterProductDescription = (description: string) => contentFilter.filterDescription(description)
export const detectSensitiveContent = (text: string) => contentFilter.detectSensitiveContent(text)
export const filterProductData = (productData: any) => contentFilter.filterProductData(productData)
