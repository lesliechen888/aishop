// 商品采集系统类型定义

// 支持的平台类型
export type Platform = '1688' | 'pdd' | 'douyin' | 'taobao' | 'temu' | 'jd'

// 新闻采集平台类型
export type NewsSource = 'vogue' | 'elle' | 'harpersbazaar' | 'cosmopolitan' | 'fashionweek' | 'wwd' | 'fashionista' | 'hypebeast' | 'rss' | 'custom'

// 采集方式
export type CollectionMethod = 'single' | 'batch' | 'shop'

// 采集状态
export type CollectionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

// 商品状态
export type ProductStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published'

// 平台配置
export interface PlatformConfig {
  id: Platform
  name: string
  icon: string
  baseUrl: string
  enabled: boolean
  rateLimit: number // 每分钟请求限制
  headers?: Record<string, string>
  cookies?: string
}

// 采集任务
export interface CollectionTask {
  id: string
  name: string
  platform: Platform
  method: CollectionMethod
  status: CollectionStatus
  urls: string[]
  shopUrl?: string
  totalProducts: number
  collectedProducts: number
  failedProducts: number
  progress: number
  startTime: string
  endTime?: string
  errorMessage?: string
  settings: CollectionSettings
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 采集设置
export interface CollectionSettings {
  // 基础设置
  maxProducts: number
  timeout: number
  retryCount: number
  delay: number
  
  // 内容过滤
  enableContentFilter: boolean
  filterKeywords: string[]
  filterRegions: boolean
  filterPlatforms: boolean
  filterShipping: boolean
  
  // 价格设置
  priceRange: {
    min: number
    max: number
  }
  
  // 图片设置
  downloadImages: boolean
  maxImages: number
  imageQuality: 'low' | 'medium' | 'high'
  
  // 其他设置
  includeVariants: boolean
  includeReviews: boolean
  includeShipping: boolean
}

// 采集的原始商品数据
export interface CollectedProduct {
  id: string
  taskId: string
  platform: Platform
  originalUrl: string
  
  // 基础信息
  title: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  
  // 商品详情
  images: string[]
  videos?: string[]
  specifications: Record<string, any>
  variants: ProductVariant[]
  
  // 店铺信息
  shopName: string
  shopUrl: string
  shopRating?: number
  
  // 销售数据
  sales?: number
  rating?: number
  reviewCount?: number
  
  // 物流信息
  shipping?: ShippingInfo
  
  // 原始数据
  rawData: Record<string, any>
  
  // 状态信息
  status: ProductStatus
  filterResults: FilterResult[]
  
  // 时间戳
  collectedAt: string
  updatedAt: string
}

// 商品变体
export interface ProductVariant {
  id: string
  name: string
  price: number
  stock: number
  sku: string
  attributes: Record<string, string> // 如: { "颜色": "红色", "尺寸": "L" }
  image?: string
}

// 物流信息
export interface ShippingInfo {
  methods: ShippingMethod[]
  freeShippingThreshold?: number
  estimatedDays: {
    min: number
    max: number
  }
}

export interface ShippingMethod {
  name: string
  price: number
  estimatedDays: number
}

// 过滤结果
export interface FilterResult {
  type: 'keyword' | 'region' | 'platform' | 'shipping'
  field: string
  originalValue: string
  filteredValue: string
  action: 'removed' | 'replaced' | 'flagged'
}

// 批量编辑规则
export interface BatchEditRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: RuleCondition[]
  actions: RuleAction[]
  createdAt: string
  updatedAt: string
}

// 规则条件
export interface RuleCondition {
  field: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'range'
  value: any
  caseSensitive?: boolean
}

// 规则动作
export interface RuleAction {
  type: 'replace' | 'append' | 'prepend' | 'remove' | 'calculate'
  field: string
  value?: any
  formula?: string // 用于价格计算等
}

// 采集箱
export interface CollectionBox {
  id: string
  name: string
  description?: string
  products: CollectedProduct[]
  totalProducts: number
  rules: BatchEditRule[]
  tags: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 发布设置
export interface PublishSettings {
  category: string
  tags: string[]
  status: 'draft' | 'published'
  seoOptimization: boolean
  priceAdjustment: {
    type: 'percentage' | 'fixed'
    value: number
  }
  inventory: {
    trackInventory: boolean
    defaultStock: number
  }
}

// 采集统计
export interface CollectionStats {
  totalTasks: number
  completedTasks: number
  totalProducts: number
  publishedProducts: number
  platformStats: Record<Platform, {
    tasks: number
    products: number
    successRate: number
  }>
  recentActivity: CollectionActivity[]
}

// 采集活动记录
export interface CollectionActivity {
  id: string
  type: 'task_created' | 'task_completed' | 'product_collected' | 'product_published' | 'rule_applied'
  message: string
  details?: Record<string, any>
  timestamp: string
}

// API响应类型
export interface CollectionApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// 平台检测结果
export interface PlatformDetection {
  platform: Platform | null
  confidence: number
  url: string
  isValid: boolean
  productId?: string
  shopId?: string
}

// 内容过滤配置
export interface ContentFilterConfig {
  keywords: {
    platforms: string[]
    regions: string[]
    shipping: string[]
    custom: string[]
  }
  patterns: {
    phoneNumbers: RegExp
    emails: RegExp
    urls: RegExp
    chineseRegions: RegExp
  }
  replacements: Record<string, string>
}

// ===== 新闻采集相关类型 =====

// 新闻采集任务
export interface NewsCollectionTask {
  id: string
  name: string
  source: NewsSource
  status: CollectionStatus
  urls: string[]
  rssUrl?: string
  keywords: string[]
  categories: string[]
  totalArticles: number
  collectedArticles: number
  failedArticles: number
  progress: number
  startTime: string
  endTime?: string
  errorMessage?: string
  settings: NewsCollectionSettings
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 新闻采集设置
export interface NewsCollectionSettings {
  // 基础设置
  maxArticles: number
  timeout: number
  retryCount: number
  delay: number
  
  // 内容过滤
  enableContentFilter: boolean
  filterKeywords: string[]
  minContentLength: number
  maxContentLength: number
  
  // 时间范围
  dateRange: {
    start?: string
    end?: string
  }
  
  // 图片设置
  downloadImages: boolean
  maxImages: number
  imageQuality: 'low' | 'medium' | 'high'
  
  // 内容处理
  extractSummary: boolean
  translateContent: boolean
  targetLanguage?: string
  removeDuplicates: boolean
  
  // SEO设置
  generateSeoTags: boolean
  autoSlug: boolean
}

// 采集的新闻文章数据
export interface CollectedNewsArticle {
  id: string
  taskId: string
  source: NewsSource
  originalUrl: string
  
  // 基础信息
  title: string
  slug?: string
  content: string
  summary?: string
  excerpt?: string
  
  // 分类和标签
  category?: string
  tags: string[]
  keywords: string[]
  
  // 媒体资源
  featuredImage?: string
  images: string[]
  videos?: string[]
  
  // 作者信息
  author?: {
    name: string
    avatar?: string
    bio?: string
    email?: string
  }
  
  // 发布信息
  publishedAt?: string
  updatedAt?: string
  sourcePublishedAt?: string
  
  // 统计数据
  views?: number
  likes?: number
  shares?: number
  comments?: number
  readTime?: number
  
  // SEO信息
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  
  // 原始数据
  rawData: Record<string, any>
  
  // 状态信息
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected'
  filterResults: NewsFilterResult[]
  
  // 语言和本地化
  language: string
  translatedVersions?: Record<string, string>
  
  // 时间戳
  collectedAt: string
  processedAt?: string
}

// 新闻过滤结果
export interface NewsFilterResult {
  type: 'keyword' | 'content' | 'date' | 'duplicate' | 'language'
  field: string
  originalValue: string
  filteredValue?: string
  action: 'removed' | 'replaced' | 'flagged' | 'rejected'
  reason: string
}

// 新闻源配置
export interface NewsSourceConfig {
  id: NewsSource
  name: string
  description: string
  icon: string
  baseUrl: string
  enabled: boolean
  rateLimit: number // 每分钟请求限制
  
  // 抓取配置
  selectors: {
    title: string[]
    content: string[]
    excerpt?: string[]
    author?: string[]
    publishDate?: string[]
    tags?: string[]
    category?: string[]
    featuredImage?: string[]
    images?: string[]
  }
  
  // RSS配置
  rssUrl?: string
  rssConfig?: {
    titleField: string
    linkField: string
    descriptionField: string
    dateField: string
    authorField?: string
    categoryField?: string
  }
  
  // 请求配置
  headers?: Record<string, string>
  cookies?: string
  userAgent?: string
  
  // 内容处理
  contentProcessing?: {
    removeSelectors?: string[] // 要移除的元素选择器
    cleanHtml?: boolean
    extractText?: boolean
    minLength?: number
    maxLength?: number
  }
}

// 新闻采集统计
export interface NewsCollectionStats {
  totalTasks: number
  completedTasks: number
  totalArticles: number
  publishedArticles: number
  sourceStats: Record<NewsSource, {
    tasks: number
    articles: number
    successRate: number
  }>
  categoryStats: Record<string, number>
  recentActivity: NewsCollectionActivity[]
}

// 新闻采集活动记录
export interface NewsCollectionActivity {
  id: string
  type: 'task_created' | 'task_completed' | 'article_collected' | 'article_published' | 'filter_applied'
  message: string
  details?: Record<string, any>
  timestamp: string
}

// RSS解析结果
export interface RSSParseResult {
  title: string
  description: string
  link: string
  items: RSSItem[]
  lastBuildDate?: string
  language?: string
  image?: {
    url: string
    title: string
    link: string
  }
}

export interface RSSItem {
  title: string
  link: string
  description: string
  pubDate?: string
  author?: string
  category?: string[]
  guid?: string
  enclosure?: {
    url: string
    type: string
    length?: number
  }
}

// 新闻内容解析结果
export interface NewsParseResult {
  success: boolean
  article?: CollectedNewsArticle
  error?: string
  warnings?: string[]
}

// 新闻批量编辑规则
export interface NewsBatchEditRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: NewsRuleCondition[]
  actions: NewsRuleAction[]
  createdAt: string
  updatedAt: string
}

// 新闻规则条件
export interface NewsRuleCondition {
  field: 'title' | 'content' | 'category' | 'tags' | 'author' | 'source' | 'date'
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex' | 'dateRange'
  value: any
  caseSensitive?: boolean
}

// 新闻规则动作
export interface NewsRuleAction {
  type: 'replace' | 'append' | 'prepend' | 'remove' | 'categorize' | 'tag' | 'translate'
  field: 'title' | 'content' | 'category' | 'tags' | 'status' | 'seoTitle' | 'seoDescription'
  value?: any
  targetLanguage?: string // 用于翻译
}

// 新闻采集 API 响应类型
export interface NewsCollectionApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
