# 🚀 真实商品采集系统架构文档

## 📋 系统概述

本系统实现了完整的电商商品采集解决方案，支持多平台、多模式的智能采集，具备实时进度监控、数据处理、内容过滤等完整功能。

## 🏗️ 核心架构

### 1. 采集引擎层 (`CollectionEngine`)

**文件位置**: `src/utils/collectionEngine.ts`

**核心功能**:
- **多平台支持**: 淘宝、1688、拼多多、抖音、Temu
- **三种采集模式**: 单品、批量、整店
- **智能解析**: 平台特定的HTML选择器和数据提取
- **并发控制**: 可配置的多线程采集
- **反爬虫机制**: User-Agent轮换、请求延迟、代理支持

**技术实现**:
```typescript
// 平台特定配置
const platformSelectors: Record<Platform, {
  title: string[]
  price: string[]
  images: string[]
  // ...
}> = {
  'taobao': {
    title: ['.tb-detail-hd h1', '.item-title'],
    price: ['.tb-rmb-num', '.notranslate'],
    // ...
  }
}

// HTTP客户端配置
const platformConfigs: Record<Platform, HttpConfig> = {
  'taobao': {
    timeout: 10000,
    retries: 3,
    delay: 2000,
    userAgent: 'Mozilla/5.0...',
    headers: { /* ... */ }
  }
}
```

### 2. 实时进度监控 (`ProgressMonitor`)

**文件位置**: `src/utils/progressMonitor.ts`

**核心功能**:
- **WebSocket通信**: 实时双向数据传输
- **多级进度跟踪**: 任务级 + 商品级
- **性能监控**: 采集速度、ETA计算、错误率统计
- **内存管理**: 自动清理过期数据

**数据结构**:
```typescript
interface TaskStats {
  taskId: string
  totalProducts: number
  completedProducts: number
  failedProducts: number
  processingProducts: number
  overallProgress: number
  averageSpeed: number
  currentSpeed: number
  estimatedEndTime?: string
  errors: string[]
}

interface ProgressEvent {
  taskId: string
  productUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message?: string
  timestamp: string
  speed?: number
  eta?: number
}
```

### 3. 数据存储层 (`productStorage`)

**文件位置**: `src/utils/productStorage.ts`

**核心功能**:
- **统一存储接口**: 采集商品的CRUD操作
- **状态管理**: 草稿、已发布、失败等状态
- **批量操作**: 支持批量增删改查
- **统计分析**: 按平台、状态、任务的数据统计

**API接口**:
```typescript
// 基础操作
addProductToCollection(product: CollectedProduct): void
getCollectedProducts(): CollectedProduct[]
updateProduct(id: string, updates: Partial<CollectedProduct>): boolean
deleteProduct(id: string): boolean

// 批量操作
addProductsToCollection(products: CollectedProduct[]): void
deleteProducts(ids: string[]): number

// 查询和统计
getProductsByTaskId(taskId: string): CollectedProduct[]
getCollectionStats(): CollectionStats
```

### 4. 智能解析器 (`smartParser`)

**文件位置**: `src/utils/smartParser.ts`

**核心功能**:
- **URL智能识别**: 自动判断单品/批量/整店
- **平台检测**: 基于URL模式的平台识别
- **置信度评估**: 解析结果的可信度评分
- **意图分组**: 按采集类型自动分组

**解析流程**:
```
URL输入 → 预处理 → 平台检测 → 意图识别 → 置信度评估 → 分组优化
```

## 🔄 采集流程详解

### 1. 用户发起采集

```typescript
// 用户在界面确认采集
const response = await fetch('/api/admin/collection/smart-start', {
  method: 'POST',
  body: JSON.stringify({
    urls: selectedParsedUrls,
    settings: collectionSettings
  })
})
```

### 2. 任务创建和分发

```typescript
// API处理请求
export async function POST(request: NextRequest) {
  // 1. 验证输入
  const validUrls = urls.filter(url => url.isValid && url.platform)
  
  // 2. 按意图分组
  const taskGroups = groupUrlsByIntent(validUrls)
  
  // 3. 创建采集任务
  const createdTasks = []
  for (const group of taskGroups) {
    const task = await createCollectionTask(group, settings)
    createdTasks.push(task)
  }
  
  // 4. 启动异步采集
  createdTasks.forEach(task => {
    setTimeout(() => processRealCollectionTask(task), 1000)
  })
}
```

### 3. 真实数据采集

```typescript
// 采集引擎处理
async function processRealCollectionTask(task: CollectionTask) {
  // 1. 初始化进度监控
  initializeTask(task.id, task.totalProducts)
  
  // 2. 创建采集引擎
  const collectionEngine = new CollectionEngine((progress) => {
    updateProductProgress(progress)
  })
  
  // 3. 根据类型执行采集
  if (task.method === 'single') {
    const result = await collectionEngine.collectSingleProduct(url, taskId)
  } else if (task.method === 'batch') {
    const results = await collectionEngine.collectBatchProducts(urls, taskId, 3)
  } else if (task.method === 'shop') {
    const results = await collectionEngine.collectShopProducts(shopUrl, platform, taskId)
  }
  
  // 4. 保存结果到采集箱
  addProductsToCollection(successfulProducts)
}
```

### 4. 单个商品采集详细流程

```typescript
async collectSingleProduct(parsedUrl: ParsedUrl, taskId: string): Promise<CollectionResult> {
  try {
    // 1. 发送HTTP请求
    updateProgress(taskId, url, 'processing', 20, '正在请求商品页面...')
    const html = await this.fetchProductPage(url, platform)
    
    // 2. 解析HTML提取数据
    updateProgress(taskId, url, 'processing', 40, '正在解析商品信息...')
    const rawData = await this.extractProductData(html, platform)
    
    // 3. 数据验证
    updateProgress(taskId, url, 'processing', 60, '正在验证数据完整性...')
    if (!this.validateProductData(rawData)) {
      throw new Error('商品数据不完整或无效')
    }
    
    // 4. 内容过滤
    updateProgress(taskId, url, 'processing', 80, '正在处理和过滤内容...')
    const { filteredData, allResults } = contentFilter.filterProductData(rawData)
    
    // 5. 创建商品对象
    updateProgress(taskId, url, 'processing', 90, '正在生成商品对象...')
    const product = this.createCollectedProduct(filteredData, parsedUrl, taskId, allResults)
    
    updateProgress(taskId, url, 'completed', 100, '商品采集完成')
    return { success: true, product }
    
  } catch (error) {
    updateProgress(taskId, url, 'failed', 0, `采集失败: ${error.message}`)
    return { success: false, error: error.message }
  }
}
```

## 🎨 用户界面层

### 1. 智能采集界面 (`SmartCollection.tsx`)

**核心功能**:
- **平台图标展示**: 直观显示支持的所有平台
- **智能URL解析**: 实时检测和预览
- **实时进度监控**: 集成进度监控组件
- **交互优化**: 微动效和状态反馈

### 2. 实时进度界面 (`RealTimeProgress.tsx`)

**核心功能**:
- **总体进度条**: 动态进度显示
- **统计卡片**: 完成/失败/处理中数量
- **商品详情列表**: 每个商品的采集状态
- **性能指标**: 速度、ETA、错误率

### 3. 采集箱界面 (`CollectionBox.tsx`)

**核心功能**:
- **商品列表**: 卡片式商品展示
- **单个编辑**: 内联编辑商品信息
- **批量操作**: 选择、编辑、删除、发布
- **高级过滤**: 平台、状态、搜索、排序

## 🔧 技术特性

### 1. 反爬虫机制

```typescript
// 平台特定的HTTP配置
const platformConfigs: Record<Platform, HttpConfig> = {
  'taobao': {
    timeout: 10000,
    retries: 3,
    delay: 2000,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }
  }
}
```

### 2. 并发控制

```typescript
// 批量采集的并发控制
async collectBatchProducts(
  parsedUrls: ParsedUrl[],
  taskId: string,
  concurrency: number = 3
): Promise<CollectionResult[]> {
  const chunks = this.chunkArray(parsedUrls, concurrency)
  
  for (const chunk of chunks) {
    // 并发处理当前批次
    const chunkPromises = chunk.map(parsedUrl => 
      this.collectSingleProduct(parsedUrl, taskId)
    )
    
    const chunkResults = await Promise.allSettled(chunkPromises)
    
    // 批次间延迟，避免被限制
    if (chunks.indexOf(chunk) < chunks.length - 1) {
      await this.delay(2000)
    }
  }
}
```

### 3. 内容过滤

```typescript
// 多层次内容过滤
const { filteredData, allResults } = contentFilter.filterProductData(rawData)

// 过滤配置
const filterConfig = {
  keywords: {
    platforms: ['淘宝', '天猫', '京东'],
    regions: ['中国', '大陆', '国内'],
    shipping: ['包邮', '快递', '顺丰']
  },
  patterns: {
    phoneNumbers: /1[3-9]\d{9}/g,
    emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    urls: /(https?:\/\/[^\s]+)/g
  }
}
```

## 📊 性能优化

### 1. 内存管理
- 自动清理过期任务数据
- 限制错误日志数量
- 分页加载商品列表

### 2. 网络优化
- 请求超时控制
- 失败重试机制
- 批次间延迟控制

### 3. 用户体验
- 实时进度反馈
- 错误信息提示
- 响应式界面设计

## 🚀 扩展性设计

### 1. 新平台接入
只需在 `platformSelectors` 和 `platformConfigs` 中添加配置即可支持新平台。

### 2. 数据库集成
当前使用内存存储，可轻松替换为数据库存储。

### 3. API扩展
支持通过API接口进行外部集成和自动化操作。

### 4. 微服务架构
采集引擎可独立部署为微服务，支持水平扩展。

## 📈 监控和分析

### 1. 实时监控
- 采集速度监控
- 成功率统计
- 错误分析

### 2. 性能分析
- 平台响应时间
- 并发效率
- 资源使用情况

### 3. 业务指标
- 商品采集量
- 平台分布
- 质量评估

---

**注意**: 当前实现为演示版本，生产环境需要：
1. 真实的数据库存储
2. WebSocket服务器
3. 更完善的反爬虫机制
4. 分布式架构支持
5. 完整的错误处理和日志系统
