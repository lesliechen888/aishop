'use client'

import React, { useState } from 'react'

export default function NewsCollectionTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testUrlCollection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const testUrls = [
        'https://www.vogue.com/article/kendall-jenner-hailey-bieber-winter-fashion',
        'https://www.elle.com/fashion/trend-reports/'
      ]

      const response = await fetch('/api/admin/news-collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '测试采集任务',
          urls: testUrls,
          settings: {
            maxArticles: 5,
            delay: 1000,
            enableContentFilter: true,
            minContentLength: 100
          }
        })
      })

      const result = await response.json()
      setTestResult({
        type: 'url',
        success: result.success,
        data: result,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setTestResult({
        type: 'url',
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      })
    }

    setIsLoading(false)
  }

  const testRssCollection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // 使用CNN的RSS作为测试
      const rssUrl = 'http://rss.cnn.com/rss/edition.rss'

      const response = await fetch('/api/admin/news-collection/rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '测试RSS采集',
          rssUrl: rssUrl,
          settings: {
            maxArticles: 10,
            enableContentFilter: true
          }
        })
      })

      const result = await response.json()
      setTestResult({
        type: 'rss',
        success: result.success,
        data: result,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setTestResult({
        type: 'rss',
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      })
    }

    setIsLoading(false)
  }

  const testNewsSourceDetection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      // 测试新闻源检测
      const testUrls = [
        'https://www.vogue.com/article/test',
        'https://www.elle.com/fashion/',
        'https://example.com/rss.xml',
        'https://unknown-site.com/article'
      ]

      // 动态导入检测器（因为它包含服务端代码）
      const { detectNewsSource } = await import('@/utils/newsSourceDetector')
      
      const detectionResults = testUrls.map(url => ({
        url,
        detection: detectNewsSource(url)
      }))

      setTestResult({
        type: 'detection',
        success: true,
        data: detectionResults,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setTestResult({
        type: 'detection',
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            新闻采集功能测试
          </h1>

          <div className="space-y-6">
            {/* 测试按钮 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testNewsSourceDetection}
                disabled={isLoading}
                className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                🔍 测试新闻源检测
              </button>
              
              <button
                onClick={testUrlCollection}
                disabled={isLoading}
                className="p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                📰 测试URL采集
              </button>
              
              <button
                onClick={testRssCollection}
                disabled={isLoading}
                className="p-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                📡 测试RSS采集
              </button>
            </div>

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">测试中...</span>
              </div>
            )}

            {/* 测试结果 */}
            {testResult && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  测试结果
                </h2>
                
                <div className={`p-4 rounded-lg border ${
                  testResult.success 
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {testResult.success ? (
                        <div className="text-green-600 dark:text-green-400 text-2xl">✅</div>
                      ) : (
                        <div className="text-red-600 dark:text-red-400 text-2xl">❌</div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <h3 className={`font-medium ${
                        testResult.success 
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}>
                        {testResult.type === 'detection' && '新闻源检测'}
                        {testResult.type === 'url' && 'URL采集'}
                        {testResult.type === 'rss' && 'RSS采集'}
                        {testResult.success ? ' - 成功' : ' - 失败'}
                      </h3>
                      
                      <p className={`mt-1 text-sm ${
                        testResult.success 
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        测试时间: {new Date(testResult.timestamp).toLocaleString()}
                      </p>

                      {testResult.error && (
                        <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                          错误信息: {testResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 详细结果 */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-gray-700 dark:text-gray-300 font-medium">
                    查看详细结果
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {/* 功能说明 */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-3">
                测试说明
              </h3>
              <div className="text-blue-800 dark:text-blue-300 space-y-2 text-sm">
                <p><strong>🔍 新闻源检测:</strong> 测试系统识别不同新闻网站的能力</p>
                <p><strong>📰 URL采集:</strong> 测试从指定URL采集新闻文章的功能</p>
                <p><strong>📡 RSS采集:</strong> 测试从RSS源批量采集新闻的功能</p>
              </div>
            </div>

            {/* API端点信息 */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                API端点信息
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div><code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">POST /api/admin/news-collection</code> - 创建新闻采集任务</div>
                <div><code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">GET /api/admin/news-collection?taskId=xxx</code> - 获取任务状态</div>
                <div><code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">POST /api/admin/news-collection/rss</code> - RSS采集</div>
                <div><code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">GET /api/admin/news-collection/rss?url=xxx</code> - 验证RSS源</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}