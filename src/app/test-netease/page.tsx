'use client'

import React, { useState } from 'react'

export default function TestNeteasePage() {
  const [testUrl, setTestUrl] = useState('https://www.163.com/dy/article/K8RARMUB055040N3.html?clickfrom=w_yw_dy')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testPageAccess = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/test-news?url=${encodeURIComponent(testUrl)}`)
      const data = await response.json()
      setResult({
        type: 'page-access',
        data
      })
    } catch (error) {
      setResult({
        type: 'page-access',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    setLoading(false)
  }

  const testNewsParsing = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      })
      const data = await response.json()
      setResult({
        type: 'news-parsing',
        data
      })
    } catch (error) {
      setResult({
        type: 'news-parsing',
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            网易新闻采集测试
          </h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              测试URL
            </label>
            <input
              type="url"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入要测试的新闻URL"
            />
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={testPageAccess}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              {loading ? '测试中...' : '测试页面访问'}
            </button>
            
            <button
              onClick={testNewsParsing}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              {loading ? '测试中...' : '测试新闻解析'}
            </button>
          </div>

          {result && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">测试结果</h2>
              
              {result.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-800">
                    <strong>错误:</strong> {result.error}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 mb-2">
                    <strong>测试类型:</strong> {result.type === 'page-access' ? '页面访问' : '新闻解析'}
                  </div>
                  
                  {result.type === 'page-access' && result.data.success && (
                    <div className="space-y-2">
                      <div><strong>状态:</strong> {result.data.status} {result.data.statusText}</div>
                      <div><strong>内容长度:</strong> {result.data.contentLength} 字符</div>
                      <div><strong>页面标题:</strong> {result.data.title}</div>
                    </div>
                  )}
                  
                  {result.type === 'news-parsing' && result.data.success && (
                    <div className="space-y-2">
                      <div><strong>检测到的新闻源:</strong> {result.data.data.detection.source || '未识别'}</div>
                      <div><strong>置信度:</strong> {result.data.data.detection.confidence}</div>
                      <div><strong>使用配置:</strong> {result.data.data.config}</div>
                      <div><strong>解析结果:</strong> {result.data.data.parseResult.success ? '成功' : '失败'}</div>
                      {result.data.data.parseResult.error && (
                        <div className="text-red-600">
                          <strong>解析错误:</strong> {result.data.data.parseResult.error}
                        </div>
                      )}
                      {result.data.data.parseResult.article && (
                        <div>
                          <strong>文章标题:</strong> {result.data.data.parseResult.article.title}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer text-gray-700 font-medium">
                  查看原始数据
                </summary>
                <pre className="mt-2 p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}