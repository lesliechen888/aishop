// 平台检测和URL解析工具

import { Platform, PlatformDetection, PlatformConfig } from '@/types/collection'

// 平台配置
export const platformConfigs: Record<Platform, PlatformConfig> = {
  '1688': {
    id: '1688',
    name: '1688',
    icon: '/images/platforms/1688.png',
    baseUrl: 'https://www.1688.com',
    enabled: true,
    rateLimit: 60,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  'pdd': {
    id: 'pdd',
    name: '拼多多',
    icon: '/images/platforms/pinduoduo.png',
    baseUrl: 'https://www.pinduoduo.com',
    enabled: true,
    rateLimit: 30,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  'douyin': {
    id: 'douyin',
    name: '抖音小店',
    icon: '/images/platforms/douyin.png',
    baseUrl: 'https://haohuo.jinritemai.com',
    enabled: true,
    rateLimit: 20,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  'taobao': {
    id: 'taobao',
    name: '淘宝',
    icon: '/images/platforms/taobao.png',
    baseUrl: 'https://www.taobao.com',
    enabled: true,
    rateLimit: 40,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  'temu': {
    id: 'temu',
    name: 'Temu',
    icon: '/images/platforms/temu.png',
    baseUrl: 'https://www.temu.com',
    enabled: true,
    rateLimit: 50,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
}

// URL模式匹配
const urlPatterns: Record<Platform, RegExp[]> = {
  '1688': [
    /detail\.1688\.com\/offer\/(\d+)\.html/,
    /m\.1688\.com\/offer\/(\d+)\.html/,
    /www\.1688\.com\/.*\/(\d+)\.html/
  ],
  'pdd': [
    /mobile\.yangkeduo\.com\/goods\.html\?goods_id=(\d+)/,
    /www\.pinduoduo\.com\/.*goods_id=(\d+)/,
    /yangkeduo\.com\/.*goods_id=(\d+)/
  ],
  'douyin': [
    /haohuo\.jinritemai\.com\/views\/product\/item\?id=(\d+)/,
    /www\.douyin\.com\/.*\/(\d+)/,
    /jinritemai\.com\/.*id=(\d+)/
  ],
  'taobao': [
    /item\.taobao\.com\/item\.htm\?id=(\d+)/,
    /detail\.tmall\.com\/item\.htm\?id=(\d+)/,
    /m\.taobao\.com\/.*id=(\d+)/,
    /m\.tmall\.com\/.*id=(\d+)/
  ],
  'temu': [
    /www\.temu\.com\/.*goods\.html\?goods_id=(\d+)/,
    /temu\.com\/.*_g_(\d+)\.html/,
    /www\.temu\.com\/.*\/(\d+)\.html/
  ]
}

// 店铺URL模式
const shopPatterns: Record<Platform, RegExp[]> = {
  '1688': [
    /shop(\d+)\.1688\.com/,
    /(\w+)\.1688\.com/
  ],
  'pdd': [
    /yangkeduo\.com\/.*mall_id=(\d+)/,
    /pinduoduo\.com\/.*mall_id=(\d+)/
  ],
  'douyin': [
    /jinritemai\.com\/.*shop_id=(\d+)/,
    /douyin\.com\/.*shop\/(\d+)/
  ],
  'taobao': [
    /shop(\d+)\.taobao\.com/,
    /(\w+)\.taobao\.com/,
    /(\w+)\.tmall\.com/
  ],
  'temu': [
    /temu\.com\/.*store\/(\d+)/,
    /temu\.com\/.*shop\/(\d+)/
  ]
}

// 平台检测器类
export class PlatformDetector {
  // 检测URL所属平台
  detectPlatform(url: string): PlatformDetection {
    const cleanUrl = this.cleanUrl(url)
    
    for (const [platform, patterns] of Object.entries(urlPatterns)) {
      for (const pattern of patterns) {
        const match = cleanUrl.match(pattern)
        if (match) {
          return {
            platform: platform as Platform,
            confidence: 0.9,
            url: cleanUrl,
            isValid: true,
            productId: match[1] || this.extractProductId(cleanUrl, platform as Platform)
          }
        }
      }
    }

    // 尝试通过域名检测
    const domainDetection = this.detectByDomain(cleanUrl)
    if (domainDetection.platform) {
      return domainDetection
    }

    return {
      platform: null,
      confidence: 0,
      url: cleanUrl,
      isValid: false
    }
  }

  // 检测店铺URL
  detectShop(url: string): PlatformDetection {
    const cleanUrl = this.cleanUrl(url)
    
    for (const [platform, patterns] of Object.entries(shopPatterns)) {
      for (const pattern of patterns) {
        const match = cleanUrl.match(pattern)
        if (match) {
          return {
            platform: platform as Platform,
            confidence: 0.8,
            url: cleanUrl,
            isValid: true,
            shopId: match[1] || match[0]
          }
        }
      }
    }

    return {
      platform: null,
      confidence: 0,
      url: cleanUrl,
      isValid: false
    }
  }

  // 批量检测URL
  detectBatch(urls: string[]): PlatformDetection[] {
    return urls.map(url => this.detectPlatform(url))
  }

  // 验证URL是否有效
  validateUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  // 清理URL
  private cleanUrl(url: string): string {
    // 移除多余的参数和片段
    try {
      const urlObj = new URL(url)
      
      // 保留重要参数
      const importantParams = ['id', 'goods_id', 'item_id', 'shop_id', 'mall_id']
      const newSearchParams = new URLSearchParams()
      
      importantParams.forEach(param => {
        const value = urlObj.searchParams.get(param)
        if (value) {
          newSearchParams.set(param, value)
        }
      })
      
      urlObj.search = newSearchParams.toString()
      urlObj.hash = ''
      
      return urlObj.toString()
    } catch {
      return url
    }
  }

  // 通过域名检测平台
  private detectByDomain(url: string): PlatformDetection {
    const domainMap: Record<string, Platform> = {
      '1688.com': '1688',
      'pinduoduo.com': 'pdd',
      'yangkeduo.com': 'pdd',
      'jinritemai.com': 'douyin',
      'douyin.com': 'douyin',
      'taobao.com': 'taobao',
      'tmall.com': 'taobao',
      'temu.com': 'temu'
    }

    for (const [domain, platform] of Object.entries(domainMap)) {
      if (url.includes(domain)) {
        return {
          platform,
          confidence: 0.7,
          url,
          isValid: true
        }
      }
    }

    return {
      platform: null,
      confidence: 0,
      url,
      isValid: false
    }
  }

  // 提取商品ID
  private extractProductId(url: string, platform: Platform): string | undefined {
    const idPatterns: Record<Platform, RegExp[]> = {
      '1688': [/(\d{10,})/],
      'pdd': [/goods_id=(\d+)/, /(\d{10,})/],
      'douyin': [/id=(\d+)/, /(\d{8,})/],
      'taobao': [/id=(\d+)/, /(\d{10,})/],
      'temu': [/goods_id=(\d+)/, /_g_(\d+)/, /(\d{8,})/]
    }

    const patterns = idPatterns[platform] || []
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return undefined
  }

  // 获取平台配置
  getPlatformConfig(platform: Platform): PlatformConfig {
    return platformConfigs[platform]
  }

  // 获取所有支持的平台
  getSupportedPlatforms(): PlatformConfig[] {
    return Object.values(platformConfigs).filter(config => config.enabled)
  }

  // 生成采集URL
  generateCollectionUrl(platform: Platform, productId: string): string {
    const config = platformConfigs[platform]
    
    const urlTemplates: Record<Platform, string> = {
      '1688': `${config.baseUrl}/offer/${productId}.html`,
      'pdd': `${config.baseUrl}/goods.html?goods_id=${productId}`,
      'douyin': `${config.baseUrl}/views/product/item?id=${productId}`,
      'taobao': `https://item.taobao.com/item.htm?id=${productId}`,
      'temu': `${config.baseUrl}/goods.html?goods_id=${productId}`
    }

    return urlTemplates[platform] || ''
  }

  // 解析分享链接
  parseShareUrl(shareUrl: string): PlatformDetection {
    // 处理短链接和分享链接
    const shortUrlPatterns = [
      /tb\.cn\/\w+/,
      /m\.tb\.cn\/\w+/,
      /dwz\.cn\/\w+/,
      /t\.cn\/\w+/
    ]

    for (const pattern of shortUrlPatterns) {
      if (shareUrl.match(pattern)) {
        // 这里需要实际解析短链接，暂时返回检测结果
        return {
          platform: 'taobao', // 假设是淘宝
          confidence: 0.6,
          url: shareUrl,
          isValid: true
        }
      }
    }

    return this.detectPlatform(shareUrl)
  }
}

// 创建默认检测器实例
export const platformDetector = new PlatformDetector()

// 导出工具函数
export const detectPlatform = (url: string) => platformDetector.detectPlatform(url)
export const detectShop = (url: string) => platformDetector.detectShop(url)
export const validateUrl = (url: string) => platformDetector.validateUrl(url)
export const getSupportedPlatforms = () => platformDetector.getSupportedPlatforms()
export const parseShareUrl = (shareUrl: string) => platformDetector.parseShareUrl(shareUrl)
