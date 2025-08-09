// 商品采集系统类型定义

// 支持的平台类型
export type Platform = '1688' | 'pdd' | 'douyin' | 'taobao' | 'temu'

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
