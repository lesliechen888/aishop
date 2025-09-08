'use client'

import React, { useState, useEffect } from 'react'
import { NewsCollectionTask, NewsCollectionSettings, CollectedNewsArticle } from '@/types/collection'

interface NewsCollectionProps {
  onCollectionComplete?: (articles: CollectedNewsArticle[]) => void
}

export default function NewsCollection({ onCollectionComplete }: NewsCollectionProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'rss'>('url')
  const [isCollecting, setIsCollecting] = useState(false)
  const [collectionProgress, setCollectionProgress] = useState(0)
  const [currentTask, setCurrentTask] = useState<NewsCollectionTask | null>(null)
  
  // URL采集相关状态
  const [urls, setUrls] = useState('')
  const [taskName, setTaskName] = useState('')
  
  // RSS采集相关状态
  const [rssUrl, setRssUrl] = useState('')
  const [rssTaskName, setRssTaskName] = useState('')
  const [isValidatingRss, setIsValidatingRss] = useState(false)
  const [rssValidation, setRssValidation] = useState<{ isValid: boolean; message: string } | null>(null)
  
  // 采集设置
  const [settings, setSettings] = useState<NewsCollectionSettings>({
    maxArticles: 20,
    timeout: 30000,
    retryCount: 3,
    delay: 2000,
    enableContentFilter: true,
    filterKeywords: [],
    minContentLength: 200,
    maxContentLength: 10000,
    dateRange: {},
    downloadImages: false,
    maxImages: 5,
    imageQuality: 'medium',
    extractSummary: true,
    translateContent: false,
    removeDuplicates: true,
    generateSeoTags: true,
    autoSlug: true
  })

  // 验证RSS源
  const validateRssUrl = async (url: string) => {
    if (!url) {
      setRssValidation(null)
      return
    }

    setIsValidatingRss(true)
    try {
      const response = await fetch(`/api/admin/news-collection/rss?url=${encodeURIComponent(url)}`)
      const result = await response.json()
      
      if (result.success) {
        setRssValidation({ isValid: true, message: 'RSS源验证成功' })
      } else {
        setRssValidation({ isValid: false, message: result.error || 'RSS源验证失败' })
      }
    } catch (error) {
      setRssValidation({ isValid: false, message: '网络错误，无法验证RSS源' })
    }
    setIsValidatingRss(false)
  }

  // 处理RSS URL变化
  const handleRssUrlChange = (url: string) => {
    setRssUrl(url)
    if (url) {
      // 延迟验证避免频繁请求
      const timeoutId = setTimeout(() => validateRssUrl(url), 1000)
      return () => clearTimeout(timeoutId)
    } else {
      setRssValidation(null)
    }
  }

  // 开始URL采集
  const startUrlCollection = async () => {
    if (!taskName.trim() || !urls.trim()) {
      alert('请填写任务名称和URL列表')
      return
    }

    const urlList = urls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    if (urlList.length === 0) {
      alert('请提供有效的URL列表')
      return
    }

    setIsCollecting(true)
    setCollectionProgress(0)

    try {
      const response = await fetch('/api/admin/news-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskName,
          urls: urlList,
          settings
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const taskId = result.data.taskId
        
        // 监控任务进度
        const interval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/admin/news-collection?taskId=${taskId}`)
            const statusResult = await statusResponse.json()
            
            if (statusResult.success) {
              const task = statusResult.data.task
              setCurrentTask(task)
              setCollectionProgress(task.progress)
              
              if (task.status === 'completed' || task.status === 'failed') {
                clearInterval(interval)
                setIsCollecting(false)
                
                if (task.status === 'completed') {
                  const articles = statusResult.data.articles || []
                  onCollectionComplete?.(articles)
                  alert(`采集完成！成功采集了 ${articles.length} 篇文章`)
                } else {
                  alert(`采集失败：${task.errorMessage}`)
                }
              }
            }
          } catch (error) {
            console.error('获取任务状态失败:', error)
          }
        }, 2000)

        // 清理函数
        setTimeout(() => {
          if (interval) {
            clearInterval(interval)
            setIsCollecting(false)
          }
        }, 300000) // 5分钟超时

      } else {
        alert(`采集失败：${result.error}`)
        setIsCollecting(false)
      }
    } catch (error) {
      console.error('采集请求失败:', error)
      alert('采集请求失败，请检查网络连接')
      setIsCollecting(false)
    }
  }

  // 开始RSS采集
  const startRssCollection = async () => {
    if (!rssTaskName.trim() || !rssUrl.trim()) {
      alert('请填写任务名称和RSS URL')
      return
    }

    if (rssValidation && !rssValidation.isValid) {
      alert('请提供有效的RSS URL')
      return
    }

    setIsCollecting(true)
    setCollectionProgress(0)

    try {
      const response = await fetch('/api/admin/news-collection/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: rssTaskName,
          rssUrl: rssUrl,
          settings
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setCollectionProgress(100)
        setCurrentTask(result.data.task)
        const articles = result.data.articles || []
        onCollectionComplete?.(articles)
        alert(`RSS采集完成！成功采集了 ${articles.length} 篇文章`)
      } else {
        alert(`RSS采集失败：${result.error}`)
      }
    } catch (error) {
      console.error('RSS采集请求失败:', error)
      alert('RSS采集请求失败，请检查网络连接')
    }
    
    setIsCollecting(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">新闻采集</h2>
      
      {/* 标签页切换 */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('url')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'url'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📰 URL采集
        </button>
        <button
          onClick={() => setActiveTab('rss')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'rss'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          📡 RSS采集
        </button>
      </div>

      {/* URL采集界面 */}
      {activeTab === 'url' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              任务名称
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="输入采集任务名称"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              新闻URL列表 (每行一个)
            </label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder={`输入新闻文章URL，每行一个，例如：
https://www.vogue.com/article/...
https://www.elle.com/fashion/...
https://www.harpersbazaar.com/...`}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>
        </div>
      )}

      {/* RSS采集界面 */}
      {activeTab === 'rss' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              任务名称
            </label>
            <input
              type="text"
              value={rssTaskName}
              onChange={(e) => setRssTaskName(e.target.value)}
              placeholder="输入RSS采集任务名称"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              RSS源URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={rssUrl}
                onChange={(e) => handleRssUrlChange(e.target.value)}
                placeholder="输入RSS源URL，例如：https://example.com/rss"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white ${
                  rssValidation
                    ? rssValidation.isValid
                      ? 'border-green-300 dark:border-green-600'
                      : 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isCollecting}
              />
              {isValidatingRss && (
                <div className="absolute right-3 top-2.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            {rssValidation && (
              <p className={`mt-1 text-sm ${
                rssValidation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {rssValidation.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 采集设置 */}
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">采集设置</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最大文章数
            </label>
            <input
              type="number"
              value={settings.maxArticles}
              onChange={(e) => setSettings(prev => ({ ...prev, maxArticles: parseInt(e.target.value) || 20 }))}
              min="1"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              请求延迟 (毫秒)
            </label>
            <input
              type="number"
              value={settings.delay}
              onChange={(e) => setSettings(prev => ({ ...prev, delay: parseInt(e.target.value) || 2000 }))}
              min="1000"
              max="10000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              最小内容长度
            </label>
            <input
              type="number"
              value={settings.minContentLength}
              onChange={(e) => setSettings(prev => ({ ...prev, minContentLength: parseInt(e.target.value) || 200 }))}
              min="50"
              max="5000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isCollecting}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableFilter"
              checked={settings.enableContentFilter}
              onChange={(e) => setSettings(prev => ({ ...prev, enableContentFilter: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isCollecting}
            />
            <label htmlFor="enableFilter" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              启用内容过滤
            </label>
          </div>
        </div>
      </div>

      {/* 采集按钮和进度 */}
      <div className="mt-6">
        {!isCollecting ? (
          <button
            onClick={activeTab === 'url' ? startUrlCollection : startRssCollection}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {activeTab === 'url' ? '🚀 开始URL采集' : '📡 开始RSS采集'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>采集进度</span>
              <span>{collectionProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${collectionProgress}%` }}
              ></div>
            </div>
            {currentTask && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentTask.status === 'processing' && (
                  <span>正在采集... ({currentTask.collectedArticles}/{currentTask.urls.length})</span>
                )}
                {currentTask.status === 'completed' && (
                  <span className="text-green-600 dark:text-green-400">
                    ✅ 采集完成！成功采集 {currentTask.collectedArticles} 篇文章
                  </span>
                )}
                {currentTask.status === 'failed' && (
                  <span className="text-red-600 dark:text-red-400">
                    ❌ 采集失败：{currentTask.errorMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}