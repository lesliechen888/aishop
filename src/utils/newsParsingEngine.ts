// 新闻内容解析引擎
import { NewsSource, CollectedNewsArticle, NewsParseResult, NewsSourceConfig, RSSParseResult, RSSItem } from '@/types/collection'
import { detectNewsSource, getNewsSourceConfig, generateHeaders } from './newsSourceDetector'

// 动态导入cheerio（仅在服务端使用）
let cheerio: any = null
if (typeof window === 'undefined') {
  try {
    cheerio = require('cheerio')
  } catch (error) {
    console.warn('Cheerio not available, using fallback parsing')
  }
}

// HTTP客户端配置
interface HttpConfig {
  timeout: number
  retries: number
  delay: number
  headers: Record<string, string>
}

// 默认HTTP配置
const defaultHttpConfig: HttpConfig = {
  timeout: 30000,
  retries: 3,
  delay: 1000,
  headers: {}
}

// 新闻解析引擎类
export class NewsParsingEngine {
  private config: HttpConfig

  constructor(config: Partial<HttpConfig> = {}) {
    this.config = { ...defaultHttpConfig, ...config }
  }

  // 解析新闻文章
  async parseNewsArticle(url: string, taskId: string): Promise<NewsParseResult> {
    try {
      console.log(`开始解析新闻文章: ${url}`)
      
      // 检测新闻源
      const detection = detectNewsSource(url)
      console.log(`新闻源检测结果:`, detection)
      
      if (!detection.source) {
        console.log(`未能识别新闻源，使用自定义配置`)
        // 使用自定义配置作为备选
        detection.source = 'custom'
        const customConfig = getNewsSourceConfig('custom')
        if (customConfig) {
          detection.config = customConfig
        }
      }
      
      if (!detection.config) {
        return {
          success: false,
          error: '无法获取新闻源配置'
        }
      }

      // 获取页面内容
      console.log(`获取页面内容: ${url}`)
      const html = await this.fetchHtml(url, detection.source)
      if (!html) {
        return {
          success: false,
          error: '无法获取页面内容，可能是网络问题或页面不存在'
        }
      }

      console.log(`页面内容获取成功，开始解析...`)
      
      // 解析内容
      const article = await this.extractArticleContent(html, url, detection.config, taskId, detection.source)
      
      // 验证解析结果
      if (!article.title || article.title.trim().length === 0) {
        return {
          success: false,
          error: '无法提取文章标题，可能是页面结构不兼容',
          warnings: ['请检查URL是否正确，或者网站的页面结构可能发生了变化']
        }
      }
      
      if (!article.content || article.content.trim().length < 50) {
        return {
          success: false,
          error: '无法提取有效的文章内容，内容太短或为空',
          warnings: ['可能是付费内容、登录限制或页面结构问题']
        }
      }
      
      console.log(`文章解析成功: ${article.title}`)
      
      return {
        success: true,
        article
      }
    } catch (error) {
      console.error('新闻解析错误:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '解析失败，未知错误',
        warnings: ['请检查网络连接和 URL 是否正确']
      }
    }
  }

  // 解析RSS源
  async parseRSSFeed(rssUrl: string, taskId: string): Promise<{ success: boolean; items?: CollectedNewsArticle[]; error?: string }> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)
      
      const response = await fetch(rssUrl, {
        headers: generateHeaders('rss'),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const xmlContent = await response.text()
      const rssData = await this.parseRSSXml(xmlContent)

      if (!rssData.items?.length) {
        return {
          success: false,
          error: 'RSS源中没有找到文章'
        }
      }

      // 转换RSS项目为新闻文章
      const articles: CollectedNewsArticle[] = []
      for (const item of rssData.items.slice(0, 50)) { // 限制最多50篇
        try {
          const article = await this.convertRSSItemToArticle(item, taskId, rssUrl)
          if (article) {
            articles.push(article)
          }
        } catch (error) {
          console.warn('RSS项目转换失败:', error)
        }
      }

      return {
        success: true,
        items: articles
      }
    } catch (error) {
      console.error('RSS解析错误:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'RSS解析失败'
      }
    }
  }

  // 获取HTML内容
  private async fetchHtml(url: string, source: NewsSource): Promise<string | null> {
    try {
      const headers = generateHeaders(source)
      
      // 为中文网站添加特殊处理
      if (['netease', 'sina', 'tencent', 'sohu'].includes(source)) {
        headers['Accept-Language'] = 'zh-CN,zh;q=0.9,en;q=0.8'
        headers['Cache-Control'] = 'no-cache'
      }
      
      console.log(`获取页面: ${url}`)
      console.log(`使用 headers:`, headers)
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log('请求超时，取消请求')
        controller.abort()
      }, this.config.timeout)
      
      const response = await fetch(url, {
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      console.log(`响应状态: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        // 对于某些网站，403/404 可能是反爬虫机制
        if (response.status === 403) {
          throw new Error(`访问被拒绝 (403)，可能是反爬虫机制。请检查URL是否需要登录或者网站有访问限制。`)
        } else if (response.status === 404) {
          throw new Error(`页面不存在 (404)，请检查URL是否正确。`)
        } else if (response.status === 429) {
          throw new Error(`请求过于频繁 (429)，请稍后再试。`)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      const html = await response.text()
      console.log(`页面内容获取成功，长度: ${html.length} 字符`)
      
      return html
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('请求超时')
        } else {
          console.error('获取HTML失败:', error.message)
        }
      }
      return null
    }
  }

  // 提取文章内容
  private async extractArticleContent(
    html: string, 
    url: string, 
    config: NewsSourceConfig, 
    taskId: string,
    source: NewsSource
  ): Promise<CollectedNewsArticle> {
    if (!cheerio) {
      throw new Error('Cheerio not available for HTML parsing')
    }

    const $ = cheerio.load(html)
    const now = new Date().toISOString()

    // 移除不需要的元素
    if (config.contentProcessing?.removeSelectors) {
      config.contentProcessing.removeSelectors.forEach(selector => {
        $(selector).remove()
      })
    }

    // 提取各个字段
    const title = this.extractText($, config.selectors.title)
    const content = this.extractContent($, config.selectors.content, config)
    const excerpt = this.extractText($, config.selectors.excerpt || [])
    const author = this.extractAuthor($, config.selectors.author || [])
    const publishDate = this.extractDate($, config.selectors.publishDate || [])
    const tags = this.extractTags($, config.selectors.tags || [])
    const category = this.extractText($, config.selectors.category || [])
    const featuredImage = this.extractImage($, config.selectors.featuredImage || [], url)
    const images = this.extractImages($, config.selectors.images || [], url)

    // 生成slug
    const slug = this.generateSlug(title)

    // 计算阅读时间
    const readTime = this.calculateReadTime(content)

    // 生成摘要
    const summary = excerpt || this.generateSummary(content)

    const article: CollectedNewsArticle = {
      id: this.generateId(),
      taskId,
      source,
      originalUrl: url,
      title: title || 'Untitled',
      slug,
      content,
      summary,
      excerpt,
      category,
      tags,
      keywords: this.extractKeywords(content, title),
      featuredImage,
      images,
      author,
      publishedAt: publishDate,
      updatedAt: now,
      sourcePublishedAt: publishDate,
      readTime,
      seoTitle: title,
      seoDescription: summary,
      seoKeywords: tags.slice(0, 5),
      rawData: {
        originalHtml: html,
        extractedData: {
          title,
          content,
          excerpt,
          author,
          publishDate,
          tags,
          category
        }
      },
      status: 'draft',
      filterResults: [],
      language: 'zh-CN',
      collectedAt: now
    }

    return article
  }

  // 解析RSS XML
  private async parseRSSXml(xmlContent: string): Promise<RSSParseResult> {
    // 简单的RSS解析实现
    const result: RSSParseResult = {
      title: '',
      description: '',
      link: '',
      items: []
    }

    try {
      // 使用正则表达式解析RSS（简化版本）
      const titleMatch = xmlContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
      result.title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : ''

      const descMatch = xmlContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i)
      result.description = descMatch ? (descMatch[1] || descMatch[2] || '') : ''

      const linkMatch = xmlContent.match(/<link>(.*?)<\/link>/i)
      result.link = linkMatch ? linkMatch[1] : ''

      // 提取items
      const itemsRegex = /<item>([\s\S]*?)<\/item>/gi
      let match
      while ((match = itemsRegex.exec(xmlContent)) !== null) {
        const itemXml = match[1]
        const item = this.parseRSSItem(itemXml)
        if (item) {
          result.items.push(item)
        }
      }

      return result
    } catch (error) {
      console.error('RSS XML解析错误:', error)
      return result
    }
  }

  // 解析RSS项目
  private parseRSSItem(itemXml: string): RSSItem | null {
    try {
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i)
      const title = titleMatch ? (titleMatch[1] || titleMatch[2] || '') : ''

      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i)
      const link = linkMatch ? linkMatch[1] : ''

      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/i)
      const description = descMatch ? (descMatch[1] || descMatch[2] || '') : ''

      const dateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i)
      const pubDate = dateMatch ? dateMatch[1] : undefined

      const authorMatch = itemXml.match(/<author>(.*?)<\/author>|<dc:creator><!\[CDATA\[(.*?)\]\]><\/dc:creator>/i)
      const author = authorMatch ? (authorMatch[1] || authorMatch[2] || undefined) : undefined

      if (!title || !link) {
        return null
      }

      return {
        title,
        link,
        description,
        pubDate,
        author
      }
    } catch (error) {
      console.error('RSS项目解析错误:', error)
      return null
    }
  }

  // 转换RSS项目为文章
  private async convertRSSItemToArticle(item: RSSItem, taskId: string, rssUrl: string): Promise<CollectedNewsArticle | null> {
    try {
      // 如果有完整文章链接，尝试解析完整内容
      if (item.link) {
        const parseResult = await this.parseNewsArticle(item.link, taskId)
        if (parseResult.success && parseResult.article) {
          return {
            ...parseResult.article,
            sourcePublishedAt: item.pubDate
          }
        }
      }

      // 否则使用RSS提供的基础信息
      const now = new Date().toISOString()
      const slug = this.generateSlug(item.title)
      const readTime = this.calculateReadTime(item.description)

      return {
        id: this.generateId(),
        taskId,
        source: 'rss',
        originalUrl: item.link,
        title: item.title,
        slug,
        content: item.description,
        summary: this.generateSummary(item.description),
        excerpt: item.description.substring(0, 200),
        category: item.category?.[0],
        tags: item.category || [],
        keywords: this.extractKeywords(item.description, item.title),
        featuredImage: undefined,
        images: [],
        author: item.author ? {
          name: item.author,
          avatar: undefined,
          bio: undefined
        } : undefined,
        publishedAt: item.pubDate,
        updatedAt: now,
        sourcePublishedAt: item.pubDate,
        readTime,
        seoTitle: item.title,
        seoDescription: this.generateSummary(item.description),
        seoKeywords: item.category?.slice(0, 5) || [],
        rawData: {
          rssItem: item,
          rssUrl
        },
        status: 'draft',
        filterResults: [],
        language: 'zh-CN',
        collectedAt: now
      }
    } catch (error) {
      console.error('RSS项目转换错误:', error)
      return null
    }
  }

  // 提取文本
  private extractText($: any, selectors: string[]): string {
    for (const selector of selectors) {
      try {
        const element = $(selector).first()
        if (element.length) {
          const text = element.text().trim()
          if (text && text.length > 0) {
            return text
          }
        }
      } catch (error) {
        console.warn(`选择器错误: ${selector}`, error)
        continue
      }
    }
    return ''
  }

  // 提取内容
  private extractContent($: any, selectors: string[], config: NewsSourceConfig): string {
    for (const selector of selectors) {
      try {
        const element = $(selector).first()
        if (element.length) {
          let content = element.html() || ''
          
          if (content && content.trim().length > 0) {
            if (config.contentProcessing?.cleanHtml) {
              content = this.cleanHtml(content)
            }
            
            if (config.contentProcessing?.extractText) {
              content = $(content).text().trim()
            }
            
            // 过滤太短的内容
            if (content.length >= (config.contentProcessing?.minLength || 50)) {
              return content
            }
          }
        }
      } catch (error) {
        console.warn(`内容选择器错误: ${selector}`, error)
        continue
      }
    }
    
    // 如果所有选择器都失败，尝试备用方案
    console.log('所有内容选择器都失败，尝试备用方案')
    const fallbackSelectors = ['p', '.text', '.txt', 'div']
    
    for (const selector of fallbackSelectors) {
      try {
        const elements = $(selector)
        let combinedText = ''
        
        elements.each((_: number, element: any) => {
          const text = $(element).text().trim()
          if (text && text.length > 20) {
            combinedText += text + '\n\n'
          }
        })
        
        if (combinedText.length > 100) {
          console.log(`使用备用选择器 ${selector} 获取内容`)
          return combinedText.trim()
        }
      } catch (error) {
        continue
      }
    }
    
    return ''
  }

  // 提取作者信息
  private extractAuthor($: any, selectors: string[]): { name: string; avatar?: string; bio?: string } | undefined {
    const authorName = this.extractText($, selectors)
    return authorName ? { name: authorName } : undefined
  }

  // 提取日期
  private extractDate($: any, selectors: string[]): string | undefined {
    for (const selector of selectors) {
      const element = $(selector).first()
      if (element.length) {
        const datetime = element.attr('datetime') || element.text().trim()
        if (datetime) {
          try {
            return new Date(datetime).toISOString()
          } catch {
            return datetime
          }
        }
      }
    }
    return undefined
  }

  // 提取标签
  private extractTags($: any, selectors: string[]): string[] {
    const tags: string[] = []
    for (const selector of selectors) {
      $(selector).each((_: number, element: any) => {
        const tag = $(element).text().trim()
        if (tag && !tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }
    return tags
  }

  // 提取特色图片
  private extractImage($: any, selectors: string[], baseUrl: string): string | undefined {
    for (const selector of selectors) {
      const element = $(selector).first()
      if (element.length) {
        const src = element.attr('src') || element.attr('data-src')
        if (src) {
          return this.resolveUrl(src, baseUrl)
        }
      }
    }
    return undefined
  }

  // 提取所有图片
  private extractImages($: any, selectors: string[], baseUrl: string): string[] {
    const images: string[] = []
    for (const selector of selectors) {
      $(selector).each((_: number, element: any) => {
        const src = $(element).attr('src') || $(element).attr('data-src')
        if (src) {
          const resolvedUrl = this.resolveUrl(src, baseUrl)
          if (!images.includes(resolvedUrl)) {
            images.push(resolvedUrl)
          }
        }
      })
    }
    return images
  }

  // 清理HTML
  private cleanHtml(html: string): string {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<!--[\s\S]*?-->/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // 解析URL
  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (url.startsWith('//')) {
      return 'https:' + url
    }
    if (url.startsWith('/')) {
      const base = new URL(baseUrl)
      return base.origin + url
    }
    return new URL(url, baseUrl).href
  }

  // 生成slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // 计算阅读时间
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  // 生成摘要
  private generateSummary(content: string, maxLength: number = 160): string {
    const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (cleanContent.length <= maxLength) {
      return cleanContent
    }
    return cleanContent.substring(0, maxLength - 3) + '...'
  }

  // 提取关键词
  private extractKeywords(content: string, title: string): string[] {
    const text = (title + ' ' + content).toLowerCase()
    const words = text.match(/\b\w{3,}\b/g) || []
    
    // 简单的关键词提取（实际应用中可以使用更复杂的算法）
    const wordCount: Record<string, number> = {}
    words.forEach(word => {
      if (word.length > 3 && !this.isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1
      }
    })

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word)
  }

  // 停用词检查
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
      'above', 'below', 'between', 'among', 'that', 'this', 'these', 'those', 'is',
      'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'said',
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个',
      '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好',
      '自己', '这个', '时候', '还是', '只是', '这样', '那个', '现在', '可以', '但是'
    ])
    return stopWords.has(word)
  }

  // 生成ID
  private generateId(): string {
    return 'article_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
}

// 导出实例
export const newsParsingEngine = new NewsParsingEngine()

// 导出工具函数
export { detectNewsSource, getNewsSourceConfig } from './newsSourceDetector'