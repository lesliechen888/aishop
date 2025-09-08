// 新闻源检测器
import { NewsSource, NewsSourceConfig } from '@/types/collection'

// 新闻源配置
export const newsSourceConfigs: Record<NewsSource, NewsSourceConfig> = {
  'vogue': {
    id: 'vogue',
    name: 'Vogue',
    description: '全球顶级时尚杂志',
    icon: '👗',
    baseUrl: 'https://www.vogue.com',
    enabled: true,
    rateLimit: 30,
    selectors: {
      title: ['h1.content-header__row-title', 'h1[data-testid="headline"]', '.content-header__title'],
      content: ['.body__inner-container', '.article__body', '.content-body'],
      excerpt: ['.content-header__dek', '.article__excerpt'],
      author: ['.byline__name', '.author-link', '.content-header__author'],
      publishDate: ['time[datetime]', '.publish-date', '.content-header__publish-date'],
      tags: ['.tags__item', '.article-tags a'],
      category: ['.breadcrumbs a', '.category-link'],
      featuredImage: ['.hero-image img', '.featured-image img', '.article-hero img'],
      images: ['.article__body img', '.content img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    contentProcessing: {
      removeSelectors: ['.ad', '.advertisement', '.social-share', '.newsletter-signup'],
      cleanHtml: true,
      extractText: true,
      minLength: 200,
      maxLength: 10000
    }
  },
  
  'elle': {
    id: 'elle',
    name: 'ELLE',
    description: '国际知名时尚生活杂志',
    icon: '💄',
    baseUrl: 'https://www.elle.com',
    enabled: true,
    rateLimit: 30,
    selectors: {
      title: ['h1.content-header-title', 'h1.article-title'],
      content: ['.article-content', '.body-text'],
      excerpt: ['.content-header-dek', '.article-excerpt'],
      author: ['.byline-name', '.author-name'],
      publishDate: ['.publish-date', 'time'],
      tags: ['.tag-list a', '.article-tags a'],
      category: ['.category', '.section-name'],
      featuredImage: ['.hero-image img', '.lead-image img'],
      images: ['.article-content img', '.body-text img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    contentProcessing: {
      removeSelectors: ['.advertisement', '.social-media', '.related-content'],
      cleanHtml: true,
      extractText: true,
      minLength: 150,
      maxLength: 8000
    }
  },
  
  'harpersbazaar': {
    id: 'harpersbazaar',
    name: "Harper's Bazaar",
    description: '奢华时尚生活杂志',
    icon: '👜',
    baseUrl: 'https://www.harpersbazaar.com',
    enabled: true,
    rateLimit: 25,
    selectors: {
      title: ['h1.content-hed', 'h1.article-header-title'],
      content: ['.article-body', '.content-container'],
      excerpt: ['.content-dek', '.article-subtitle'],
      author: ['.byline-name', '.author-info'],
      publishDate: ['.publish-date', 'time[datetime]'],
      tags: ['.tag-list a'],
      category: ['.category-link'],
      featuredImage: ['.hero-image img', '.main-image img'],
      images: ['.article-body img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  
  'cosmopolitan': {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    description: '年轻女性时尚杂志',
    icon: '💋',
    baseUrl: 'https://www.cosmopolitan.com',
    enabled: true,
    rateLimit: 30,
    selectors: {
      title: ['h1.content-hed', 'h1.article-title'],
      content: ['.article-body-content', '.content-container'],
      excerpt: ['.content-dek'],
      author: ['.byline-name'],
      publishDate: ['.publish-date'],
      tags: ['.tag-list a'],
      featuredImage: ['.hero-image img'],
      images: ['.article-body img']
    }
  },
  
  'fashionweek': {
    id: 'fashionweek',
    name: 'Fashion Week Online',
    description: '时装周官方资讯',
    icon: '🎭',
    baseUrl: 'https://fashionweekonline.com',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['h1.entry-title', 'h1.post-title'],
      content: ['.entry-content', '.post-content'],
      author: ['.author-name', '.byline'],
      publishDate: ['.entry-date', '.post-date'],
      tags: ['.post-tags a'],
      featuredImage: ['.featured-image img'],
      images: ['.entry-content img']
    }
  },
  
  'wwd': {
    id: 'wwd',
    name: "Women's Wear Daily",
    description: '时尚商业资讯',
    icon: '📰',
    baseUrl: 'https://wwd.com',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['h1.c-title', 'h1.article-title'],
      content: ['.c-content', '.article-content'],
      author: ['.c-byline', '.author'],
      publishDate: ['.c-timestamp', '.publish-date'],
      tags: ['.c-tag', '.article-tags a'],
      featuredImage: ['.c-featured-image img'],
      images: ['.c-content img']
    }
  },
  
  'fashionista': {
    id: 'fashionista',
    name: 'Fashionista',
    description: '时尚行业深度报道',
    icon: '📸',
    baseUrl: 'https://fashionista.com',
    enabled: true,
    rateLimit: 25,
    selectors: {
      title: ['h1.entry-title'],
      content: ['.entry-content'],
      author: ['.author-name'],
      publishDate: ['.entry-date'],
      tags: ['.entry-tags a'],
      featuredImage: ['.entry-featured-image img'],
      images: ['.entry-content img']
    }
  },
  
  'hypebeast': {
    id: 'hypebeast',
    name: 'Hypebeast',
    description: '潮流文化资讯',
    icon: '🔥',
    baseUrl: 'https://hypebeast.com',
    enabled: true,
    rateLimit: 30,
    selectors: {
      title: ['h1.post-title'],
      content: ['.post-content'],
      author: ['.author-name'],
      publishDate: ['.post-date'],
      tags: ['.post-tags a'],
      featuredImage: ['.post-featured-image img'],
      images: ['.post-content img']
    }
  },
  
  'rss': {
    id: 'rss',
    name: 'RSS订阅',
    description: 'RSS源采集',
    icon: '📡',
    baseUrl: '',
    enabled: true,
    rateLimit: 60,
    selectors: {
      title: [],
      content: []
    },
    rssConfig: {
      titleField: 'title',
      linkField: 'link',
      descriptionField: 'description',
      dateField: 'pubDate',
      authorField: 'author',
      categoryField: 'category'
    }
  },
  
  'custom': {
    id: 'custom',
    name: '自定义网站',
    description: '用户自定义的新闻源',
    icon: '🌐',
    baseUrl: '',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['h1', '.title', '.headline'],
      content: ['.content', '.article', '.post-content', 'article'],
      excerpt: ['.excerpt', '.summary', '.description'],
      author: ['.author', '.byline', '.writer'],
      publishDate: ['time', '.date', '.publish-date'],
      tags: ['.tags a', '.categories a'],
      featuredImage: ['.featured-image img', '.hero-image img'],
      images: ['.content img', 'article img']
    },
    contentProcessing: {
      removeSelectors: ['.ad', '.advertisement', '.social', '.sidebar'],
      cleanHtml: true,
      extractText: true,
      minLength: 100
    }
  }
}

// 检测新闻源
export function detectNewsSource(url: string): { source: NewsSource | null; confidence: number; config?: NewsSourceConfig } {
  if (!url || typeof url !== 'string') {
    return { source: null, confidence: 0 }
  }

  const cleanUrl = url.toLowerCase().trim()
  
  // 检测各个新闻源
  for (const [sourceId, config] of Object.entries(newsSourceConfigs)) {
    if (sourceId === 'rss' || sourceId === 'custom') continue
    
    const baseUrl = config.baseUrl.toLowerCase()
    const domain = baseUrl.replace(/^https?:\/\//, '').replace(/^www\./, '')
    
    if (cleanUrl.includes(domain)) {
      return {
        source: sourceId as NewsSource,
        confidence: 0.95,
        config
      }
    }
  }
  
  // 检测RSS
  if (cleanUrl.includes('.rss') || cleanUrl.includes('/rss') || cleanUrl.includes('/feed') || cleanUrl.includes('.xml')) {
    return {
      source: 'rss',
      confidence: 0.9,
      config: newsSourceConfigs.rss
    }
  }
  
  // 默认为自定义源
  return {
    source: 'custom',
    confidence: 0.3,
    config: newsSourceConfigs.custom
  }
}

// 验证新闻URL
export function validateNewsUrl(url: string): { isValid: boolean; error?: string } {
  try {
    const urlObj = new URL(url)
    
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: '仅支持HTTP和HTTPS协议' }
    }
    
    return { isValid: true }
  } catch (error) {
    return { isValid: false, error: 'URL格式无效' }
  }
}

// 获取启用的新闻源
export function getEnabledNewsSources(): NewsSourceConfig[] {
  return Object.values(newsSourceConfigs).filter(config => config.enabled)
}

// 获取新闻源配置
export function getNewsSourceConfig(source: NewsSource): NewsSourceConfig | null {
  return newsSourceConfigs[source] || null
}

// 检查速率限制
export function checkRateLimit(source: NewsSource, requestCount: number, timeWindow: number = 60000): boolean {
  const config = getNewsSourceConfig(source)
  if (!config) return false
  
  const maxRequests = config.rateLimit
  const requestsPerMinute = requestCount / (timeWindow / 60000)
  
  return requestsPerMinute <= maxRequests
}

// 获取用户代理
export function getUserAgent(source: NewsSource): string {
  const config = getNewsSourceConfig(source)
  return config?.headers?.['User-Agent'] || 'Mozilla/5.0 (compatible; NewsCollector/1.0)'
}

// 生成请求头
export function generateHeaders(source: NewsSource): Record<string, string> {
  const config = getNewsSourceConfig(source)
  
  const defaultHeaders = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5,zh-CN;q=0.3',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
  }
  
  return {
    ...defaultHeaders,
    ...config?.headers
  }
}