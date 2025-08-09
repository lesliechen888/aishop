'use client'

import { useState, useEffect, useRef } from 'react'
import { TaskStats, ProgressEvent } from '@/utils/progressMonitor'

interface RealTimeProgressProps {
  taskId: string
  onComplete?: () => void
}

export default function RealTimeProgress({ taskId, onComplete }: RealTimeProgressProps) {
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null)
  const [productProgress, setProductProgress] = useState<Map<string, ProgressEvent>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // 建立WebSocket连接
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [taskId])

  const connectWebSocket = () => {
    try {
      // 注意：这里需要实际的WebSocket服务器
      // 目前使用模拟连接
      setIsConnected(true)
      setConnectionError(null)
      
      // 模拟接收进度数据
      simulateProgress()
    } catch (error) {
      setConnectionError('连接失败')
      setIsConnected(false)
    }
  }

  // 模拟进度数据（实际项目中应该通过WebSocket接收）
  const simulateProgress = () => {
    // 模拟任务统计
    const mockStats: TaskStats = {
      taskId,
      totalProducts: 10,
      completedProducts: 0,
      failedProducts: 0,
      processingProducts: 0,
      pendingProducts: 10,
      overallProgress: 0,
      startTime: new Date().toISOString(),
      averageSpeed: 0,
      currentSpeed: 0,
      errors: []
    }
    setTaskStats(mockStats)

    // 模拟商品进度更新
    let completed = 0
    const interval = setInterval(() => {
      if (completed >= 10) {
        clearInterval(interval)
        if (onComplete) onComplete()
        return
      }

      const productUrl = `https://example.com/product/${completed + 1}`
      const progress: ProgressEvent = {
        taskId,
        productUrl,
        status: Math.random() > 0.1 ? 'completed' : 'failed',
        progress: 100,
        message: Math.random() > 0.1 ? '采集成功' : '采集失败',
        timestamp: new Date().toISOString(),
        speed: 2.5
      }

      setProductProgress(prev => {
        const newMap = new Map(prev)
        newMap.set(productUrl, progress)
        return newMap
      })

      completed++
      const updatedStats = {
        ...mockStats,
        completedProducts: progress.status === 'completed' ? completed : completed - 1,
        failedProducts: progress.status === 'failed' ? 1 : 0,
        processingProducts: Math.max(0, 10 - completed),
        pendingProducts: Math.max(0, 10 - completed),
        overallProgress: Math.round((completed / 10) * 100),
        currentSpeed: 2.5,
        averageSpeed: 2.0
      }
      setTaskStats(updatedStats)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'failed': return '❌'
      case 'processing': return '🔄'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  if (!taskStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">正在初始化采集任务...</span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* 头部状态栏 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">实时采集进度</h3>
            <p className="text-blue-100 text-sm">任务ID: {taskId}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-200 animate-pulse' : 'bg-red-200'
              }`}></div>
              <span className="text-sm font-medium">
                {isConnected ? '已连接' : '连接断开'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 总体进度 */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">总体进度</span>
            <span className="text-sm font-bold text-gray-900">{taskStats.overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${taskStats.overallProgress}%` }}
            ></div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.totalProducts}</div>
            <div className="text-xs text-blue-600 font-medium">总商品数</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.completedProducts}</div>
            <div className="text-xs text-green-600 font-medium">已完成</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.failedProducts}</div>
            <div className="text-xs text-red-600 font-medium">失败</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.processingProducts}</div>
            <div className="text-xs text-yellow-600 font-medium">处理中</div>
          </div>
        </div>

        {/* 速度信息 */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">当前速度:</span> {taskStats.currentSpeed.toFixed(1)} 商品/分钟
          </div>
          <div>
            <span className="font-medium">平均速度:</span> {taskStats.averageSpeed.toFixed(1)} 商品/分钟
          </div>
          {taskStats.estimatedEndTime && (
            <div>
              <span className="font-medium">预计完成:</span> {new Date(taskStats.estimatedEndTime).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* 商品进度列表 */}
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">商品采集详情</h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Array.from(productProgress.values()).map((progress, index) => (
            <div key={progress.productUrl} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <span className="text-lg">{getStatusIcon(progress.status)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    商品 #{index + 1}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(progress.status)}`}>
                    {progress.status === 'completed' ? '已完成' : 
                     progress.status === 'failed' ? '失败' :
                     progress.status === 'processing' ? '处理中' : '等待中'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{progress.productUrl}</p>
                {progress.message && (
                  <p className="text-xs text-gray-600 mt-1">{progress.message}</p>
                )}
              </div>
              <div className="flex-shrink-0">
                <div className="text-xs text-gray-500">
                  {new Date(progress.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 错误信息 */}
      {taskStats.errors.length > 0 && (
        <div className="p-6 border-t border-gray-200 bg-red-50">
          <h4 className="text-lg font-semibold text-red-900 mb-3">错误信息</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {taskStats.errors.map((error, index) => (
              <div key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 连接错误 */}
      {connectionError && (
        <div className="p-4 bg-red-100 border-t border-red-200">
          <div className="flex items-center">
            <span className="text-red-600 mr-2">⚠️</span>
            <span className="text-red-700 text-sm">{connectionError}</span>
            <button 
              onClick={connectWebSocket}
              className="ml-auto px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
            >
              重新连接
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
