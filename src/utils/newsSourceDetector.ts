// 新闻源检测器
import { NewsSource, NewsSourceConfig } from '@/types/collection'

// 新闻源配置
export const newsSourceConfigs: Record<NewsSource, NewsSourceConfig> = {
  // 国际时尚媒体
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
  
  // 中文新闻网站
  'netease': {
    id: 'netease',
    name: '网易新闻',
    description: '网易新闻资讯',
    icon: '📰',
    baseUrl: 'https://www.163.com',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['h1.post_title', '.post_title', 'h1', '.article-title', '.title'],
      content: ['.post_body', '.post_text', '.article-content', '.content', 'article'],
      excerpt: ['.post_info', '.summary', '.excerpt'],
      author: ['.ep-editor', '.author', '.post_author'],
      publishDate: ['.post_time', '.time', '.publish-time'],
      tags: ['.post_tag a', '.tags a'],
      category: ['.post_nav a', '.category'],
      featuredImage: ['.post_body img:first-child', '.article img:first-child'],
      images: ['.post_body img', '.article img', '.content img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    },
    contentProcessing: {
      removeSelectors: ['.ad', '.advertisement', '.ne-ad', '.gg', '.comment'],
      cleanHtml: true,
      extractText: true,
      minLength: 100,
      maxLength: 20000
    }
  },
  
  'sina': {
    id: 'sina',
    name: '新浪新闻',
    description: '新浪网新闻资讯',
    icon: '📱',
    baseUrl: 'https://news.sina.com.cn',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['.main-title', 'h1.title', 'h1', '.article-title'],
      content: ['.article', '.article-content', '.content', '#artibody'],
      excerpt: ['.summary', '.excerpt'],
      author: ['.article-info .author', '.source', '.media'],
      publishDate: ['.time', '.article-info .time', '.pub-time'],
      tags: ['.tag a', '.keywords a'],
      category: ['.nav a', '.breadcrumb a'],
      featuredImage: ['.img_wrapper img', '.article img:first-child'],
      images: ['.article img', '.content img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    contentProcessing: {
      removeSelectors: ['.ad', '.advertisement', '.comment', '.related'],
      cleanHtml: true,
      extractText: true,
      minLength: 100
    }
  },
  
  'tencent': {
    id: 'tencent',
    name: '腾讯新闻',
    description: '腾讯网新闻资讯',
    icon: '📲',
    baseUrl: 'https://new.qq.com',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['.LEFT .title', '.content-article .title', 'h1'],
      content: ['.content-article .content', '.LEFT .content', '.article-content'],
      author: ['.article-info .author', '.where'],
      publishDate: ['.article-info .time', '.where .time'],
      tags: ['.tag a'],
      category: ['.nav a'],
      featuredImage: ['.content img:first-child'],
      images: ['.content img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  
  'sohu': {
    id: 'sohu',
    name: '搜狐新闻',
    description: '搜狐网新闻资讯',
    icon: '🦊',
    baseUrl: 'https://www.sohu.com',
    enabled: true,
    rateLimit: 20,
    selectors: {
      title: ['.text-title h1', '.article-title', 'h1'],
      content: ['.article-text', '.article-content', '.content'],
      author: ['.article-info .name', '.author'],
      publishDate: ['.article-info .time', '.time'],
      tags: ['.tag-list a'],
      featuredImage: ['.article-text img:first-child'],
      images: ['.article-text img', '.content img']
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  
  'xinhua': {
    id: 'xinhua',
    name: '新华网',
    description: '新华网新闻',
    icon: '🇨🇳',
    baseUrl: 'http://www.xinhuanet.com',
    enabled: true,
    rateLimit: 15,
    selectors: {
      title: ['.title', 'h1', '.article-title'],
      content: ['.article', '#detail', '.content'],
      author: ['.author', '.source'],
      publishDate: ['.time', '.pub-time'],
      tags: ['.tag a'],
      featuredImage: ['.article img:first-child'],
      images: ['.article img', '.content img']
    }
  },
  
  'peopledaily': {
    id: 'peopledaily',
    name: '人民日报',
    description: '人民网新闻',
    icon: '🇨🇳',
    baseUrl: 'http://www.people.com.cn',
    enabled: true,
    rateLimit: 15,
    selectors: {
      title: ['.title_txt', '.article_title', 'h1'],
      content: ['.show_text', '.article_content', '.rm_txt_con'],
      author: ['.article_info .author', '.source'],
      publishDate: ['.article_info .time', '.time'],
      tags: ['.tag_list a'],
      featuredImage: ['.show_text img:first-child'],
      images: ['.show_text img', '.article_content img']
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
      // 中英文网站通用选择器
      title: [
        'h1', '.title', '.headline', '.article-title', '.post-title', 
        '.content-title', '.news-title', '.main-title', '.text-title h1',
        '.post_title', '.article_title'
      ],
      content: [
        '.content', '.article', '.post-content', 'article', '.article-content',
        '.text', '.article-text', '.post-text', '.main-content', '.detail-content',
        '.post_body', '.post_text', '.show_text', '.article_content'
      ],
      excerpt: ['.excerpt', '.summary', '.description', '.post_info'],
      author: [
        '.author', '.byline', '.writer', '.article-author', '.post-author',
        '.ep-editor', '.article-info .author', '.source', '.media'
      ],
      publishDate: [
        'time', '.date', '.publish-date', '.time', '.post-time', '.pub-time',
        '.article-info .time', '.post_time'
      ],
      tags: ['.tags a', '.categories a', '.tag a', '.post-tags a'],
      featuredImage: ['.featured-image img', '.hero-image img', '.main-image img'],
      images: ['.content img', 'article img', '.post-content img', '.article img']
    },
    contentProcessing: {
      removeSelectors: [
        '.ad', '.advertisement', '.social', '.sidebar', '.comment', 
        '.related', '.ne-ad', '.gg', '.footer', '.header-nav'
      ],
      cleanHtml: true,
      extractText: true,
      minLength: 50 // 降低最小长度要求
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
    
    // 精确匹配域名
    if (cleanUrl.includes(domain)) {
      return {
        source: sourceId as NewsSource,
        confidence: 0.95,
        config
      }
    }
    
    // 特殊处理一些网站的多个域名
    if (sourceId === 'netease' && (cleanUrl.includes('163.com') || cleanUrl.includes('netease.com'))) {
      return {
        source: 'netease',
        confidence: 0.95,
        config
      }
    }
    
    if (sourceId === 'sina' && (cleanUrl.includes('sina.com') || cleanUrl.includes('weibo.com'))) {
      return {
        source: 'sina',
        confidence: 0.95,
        config
      }
    }
    
    if (sourceId === 'tencent' && (cleanUrl.includes('qq.com') || cleanUrl.includes('tencent.com'))) {
      return {
        source: 'tencent',
        confidence: 0.95,
        config
      }
    }
    
    if (sourceId === 'sohu' && cleanUrl.includes('sohu.com')) {
      return {
        source: 'sohu',
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