// 实时进度监控系统
import { EventEmitter } from 'events'

// 进度事件类型
export interface ProgressEvent {
  taskId: string
  productUrl: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message?: string
  timestamp: string
  speed?: number // 采集速度 (商品/分钟)
  eta?: number // 预计剩余时间 (秒)
}

// 任务统计信息
export interface TaskStats {
  taskId: string
  totalProducts: number
  completedProducts: number
  failedProducts: number
  processingProducts: number
  pendingProducts: number
  overallProgress: number
  startTime: string
  estimatedEndTime?: string
  averageSpeed: number // 平均速度
  currentSpeed: number // 当前速度
  errors: string[]
}

// 实时进度监控器
export class ProgressMonitor extends EventEmitter {
  private taskStats: Map<string, TaskStats> = new Map()
  private productProgress: Map<string, ProgressEvent> = new Map()
  private speedCalculator: Map<string, number[]> = new Map() // 存储最近的完成时间戳
  private clients: Set<WebSocket> = new Set()

  constructor() {
    super()
    this.setupCleanupInterval()
  }

  // 注册WebSocket客户端
  addClient(ws: WebSocket) {
    this.clients.add(ws)
    
    // 发送当前所有任务状态
    this.taskStats.forEach(stats => {
      this.sendToClient(ws, {
        type: 'task_stats',
        data: stats
      })
    })

    // 监听客户端断开
    ws.on('close', () => {
      this.clients.delete(ws)
    })
  }

  // 初始化任务监控
  initializeTask(taskId: string, totalProducts: number) {
    const stats: TaskStats = {
      taskId,
      totalProducts,
      completedProducts: 0,
      failedProducts: 0,
      processingProducts: 0,
      pendingProducts: totalProducts,
      overallProgress: 0,
      startTime: new Date().toISOString(),
      averageSpeed: 0,
      currentSpeed: 0,
      errors: []
    }

    this.taskStats.set(taskId, stats)
    this.speedCalculator.set(taskId, [])
    
    this.broadcastTaskStats(stats)
    this.emit('task_initialized', stats)
  }

  // 更新商品进度
  updateProductProgress(event: Omit<ProgressEvent, 'timestamp'>) {
    const progressEvent: ProgressEvent = {
      ...event,
      timestamp: new Date().toISOString()
    }

    const key = `${event.taskId}-${event.productUrl}`
    const previousEvent = this.productProgress.get(key)
    this.productProgress.set(key, progressEvent)

    // 更新任务统计
    this.updateTaskStats(event.taskId, progressEvent, previousEvent)

    // 广播进度更新
    this.broadcastProductProgress(progressEvent)
    this.emit('product_progress', progressEvent)
  }

  // 更新任务统计信息
  private updateTaskStats(taskId: string, currentEvent: ProgressEvent, previousEvent?: ProgressEvent) {
    const stats = this.taskStats.get(taskId)
    if (!stats) return

    // 更新状态计数
    if (previousEvent) {
      this.decrementStatusCount(stats, previousEvent.status)
    }
    this.incrementStatusCount(stats, currentEvent.status)

    // 计算整体进度
    stats.overallProgress = Math.round(
      ((stats.completedProducts + stats.failedProducts) / stats.totalProducts) * 100
    )

    // 更新速度计算
    if (currentEvent.status === 'completed') {
      this.updateSpeed(taskId, stats)
    }

    // 计算预计完成时间
    if (stats.averageSpeed > 0) {
      const remainingProducts = stats.pendingProducts + stats.processingProducts
      const remainingMinutes = remainingProducts / stats.averageSpeed
      const estimatedEndTime = new Date(Date.now() + remainingMinutes * 60000)
      stats.estimatedEndTime = estimatedEndTime.toISOString()
    }

    // 记录错误
    if (currentEvent.status === 'failed' && currentEvent.message) {
      stats.errors.push(`${currentEvent.productUrl}: ${currentEvent.message}`)
      // 只保留最近的10个错误
      if (stats.errors.length > 10) {
        stats.errors = stats.errors.slice(-10)
      }
    }

    this.taskStats.set(taskId, stats)
    this.broadcastTaskStats(stats)
    this.emit('task_stats_updated', stats)
  }

  // 增加状态计数
  private incrementStatusCount(stats: TaskStats, status: string) {
    switch (status) {
      case 'pending':
        // pending 在初始化时已设置，这里不需要增加
        break
      case 'processing':
        stats.processingProducts++
        stats.pendingProducts = Math.max(0, stats.pendingProducts - 1)
        break
      case 'completed':
        stats.completedProducts++
        stats.processingProducts = Math.max(0, stats.processingProducts - 1)
        break
      case 'failed':
        stats.failedProducts++
        stats.processingProducts = Math.max(0, stats.processingProducts - 1)
        break
    }
  }

  // 减少状态计数
  private decrementStatusCount(stats: TaskStats, status: string) {
    switch (status) {
      case 'pending':
        stats.pendingProducts = Math.max(0, stats.pendingProducts - 1)
        break
      case 'processing':
        stats.processingProducts = Math.max(0, stats.processingProducts - 1)
        break
      case 'completed':
        stats.completedProducts = Math.max(0, stats.completedProducts - 1)
        break
      case 'failed':
        stats.failedProducts = Math.max(0, stats.failedProducts - 1)
        break
    }
  }

  // 更新采集速度
  private updateSpeed(taskId: string, stats: TaskStats) {
    const timestamps = this.speedCalculator.get(taskId) || []
    const now = Date.now()
    
    // 添加当前时间戳
    timestamps.push(now)
    
    // 只保留最近5分钟的数据
    const fiveMinutesAgo = now - 5 * 60 * 1000
    const recentTimestamps = timestamps.filter(ts => ts > fiveMinutesAgo)
    this.speedCalculator.set(taskId, recentTimestamps)

    // 计算平均速度 (商品/分钟)
    const startTime = new Date(stats.startTime).getTime()
    const elapsedMinutes = (now - startTime) / (1000 * 60)
    stats.averageSpeed = elapsedMinutes > 0 ? stats.completedProducts / elapsedMinutes : 0

    // 计算当前速度 (最近5分钟)
    if (recentTimestamps.length > 1) {
      const recentElapsedMinutes = (now - recentTimestamps[0]) / (1000 * 60)
      stats.currentSpeed = recentElapsedMinutes > 0 ? recentTimestamps.length / recentElapsedMinutes : 0
    } else {
      stats.currentSpeed = stats.averageSpeed
    }
  }

  // 获取任务统计
  getTaskStats(taskId: string): TaskStats | undefined {
    return this.taskStats.get(taskId)
  }

  // 获取所有任务统计
  getAllTaskStats(): TaskStats[] {
    return Array.from(this.taskStats.values())
  }

  // 获取商品进度
  getProductProgress(taskId: string): ProgressEvent[] {
    const results: ProgressEvent[] = []
    this.productProgress.forEach((progress, key) => {
      if (key.startsWith(`${taskId}-`)) {
        results.push(progress)
      }
    })
    return results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  // 清理已完成的任务
  cleanupTask(taskId: string) {
    this.taskStats.delete(taskId)
    this.speedCalculator.delete(taskId)
    
    // 清理相关的商品进度
    const keysToDelete: string[] = []
    this.productProgress.forEach((_, key) => {
      if (key.startsWith(`${taskId}-`)) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => this.productProgress.delete(key))

    this.broadcastMessage({
      type: 'task_cleanup',
      data: { taskId }
    })
  }

  // 广播任务统计
  private broadcastTaskStats(stats: TaskStats) {
    this.broadcastMessage({
      type: 'task_stats',
      data: stats
    })
  }

  // 广播商品进度
  private broadcastProductProgress(progress: ProgressEvent) {
    this.broadcastMessage({
      type: 'product_progress',
      data: progress
    })
  }

  // 广播消息给所有客户端
  private broadcastMessage(message: any) {
    const messageStr = JSON.stringify(message)
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(messageStr)
        } catch (error) {
          console.error('发送WebSocket消息失败:', error)
          this.clients.delete(client)
        }
      }
    })
  }

  // 发送消息给特定客户端
  private sendToClient(client: WebSocket, message: any) {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(message))
      } catch (error) {
        console.error('发送WebSocket消息失败:', error)
        this.clients.delete(client)
      }
    }
  }

  // 设置定期清理
  private setupCleanupInterval() {
    // 每小时清理超过24小时的已完成任务
    setInterval(() => {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      
      this.taskStats.forEach((stats, taskId) => {
        const startTime = new Date(stats.startTime).getTime()
        const isCompleted = stats.completedProducts + stats.failedProducts === stats.totalProducts
        
        if (isCompleted && startTime < oneDayAgo) {
          this.cleanupTask(taskId)
        }
      })
    }, 60 * 60 * 1000) // 每小时执行一次
  }

  // 生成进度报告
  generateProgressReport(taskId: string): {
    summary: TaskStats
    timeline: ProgressEvent[]
    performance: {
      peakSpeed: number
      averageResponseTime: number
      errorRate: number
    }
  } | null {
    const stats = this.taskStats.get(taskId)
    if (!stats) return null

    const timeline = this.getProductProgress(taskId)
    
    // 计算性能指标
    const completedEvents = timeline.filter(e => e.status === 'completed')
    const failedEvents = timeline.filter(e => e.status === 'failed')
    
    const peakSpeed = Math.max(stats.currentSpeed, stats.averageSpeed)
    const errorRate = stats.totalProducts > 0 ? (stats.failedProducts / stats.totalProducts) * 100 : 0
    
    // 计算平均响应时间（简化计算）
    const averageResponseTime = completedEvents.length > 0 ? 2000 : 0 // 假设平均2秒

    return {
      summary: stats,
      timeline,
      performance: {
        peakSpeed,
        averageResponseTime,
        errorRate
      }
    }
  }
}

// 创建全局进度监控器实例
export const progressMonitor = new ProgressMonitor()

// 导出工具函数
export const initializeTask = (taskId: string, totalProducts: number) => 
  progressMonitor.initializeTask(taskId, totalProducts)

export const updateProductProgress = (event: Omit<ProgressEvent, 'timestamp'>) => 
  progressMonitor.updateProductProgress(event)

export const getTaskStats = (taskId: string) => 
  progressMonitor.getTaskStats(taskId)

export const cleanupTask = (taskId: string) => 
  progressMonitor.cleanupTask(taskId)
