'use client'

import React, { useState } from 'react'

export default function SimpleNewsTest() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testNeteaseNews = async () => {
    setLoading(true)
    setResult('开始测试...\n')

    try {
      // 测试基本访问
      setResult(prev => prev + '测试基本访问...\n')
      const basicResponse = await fetch('/api/test-netease')
      const basicResult = await basicResponse.json()
      
      if (basicResult.success) {
        setResult(prev => prev + `基本访问成功: 状态${basicResult.data.status}, 内容长度${basicResult.data.contentLength}\n`)
        setResult(prev => prev + `页面标题: ${basicResult.data.title}\n`)
        
        if (basicResult.data.parseResult) {
          setResult(prev => prev + `解析结果: ${JSON.stringify(basicResult.data.parseResult, null, 2)}\n`)
        }
      } else {
        setResult(prev => prev + `基本访问失败: ${basicResult.error}\n`)
        return
      }
      
      // 测试完整采集流程
      setResult(prev => prev + '\n测试完整采集流程...\n')
      const fullResponse = await fetch('/api/test-netease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      
      const fullResult = await fullResponse.json()
      
      if (fullResult.success) {
        setResult(prev => prev + `完整采集测试成功\n`)
        setResult(prev => prev + `结果: ${JSON.stringify(fullResult.data.parseResult, null, 2)}\n`)
      } else {
        setResult(prev => prev + `完整采集测试失败: ${fullResult.error}\n`)
      }
      
    } catch (error) {
      setResult(prev => prev + `错误: ${error}\n`)
    }

    setLoading(false)
  }

  const testNewsDetection = async () => {
    setLoading(true)
    setResult('测试新闻源检测...\n')

    try {
      // 动态导入检测器
      const { detectNewsSource } = await import('@/utils/newsSourceDetector')
      const url = 'https://www.163.com/dy/article/K8RARMUB055040N3.html?clickfrom=w_yw_dy'
      
      const detection = detectNewsSource(url)
      setResult(prev => prev + `检测结果: ${JSON.stringify(detection, null, 2)}\n`)
      
    } catch (error) {
      setResult(prev => prev + `检测失败: ${error}\n`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            简化新闻采集测试
          </h1>

          <div className="space-y-4 mb-6">
            <button
              onClick={testNewsDetection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg mr-4"
            >
              测试新闻源检测
            </button>
            
            <button
              onClick={testNeteaseNews}
              disabled={loading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg"
            >
              测试网易新闻采集
            </button>
          </div>

          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium mb-2">测试结果:</h3>
            <pre className="text-sm whitespace-pre-wrap overflow-auto max-h-96">
              {result || '暂无结果'}
            </pre>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>测试URL:</strong> https://www.163.com/dy/article/K8RARMUB055040N3.html?clickfrom=w_yw_dy</p>
            <p><strong>说明:</strong> 这个页面会测试新闻采集功能是否能正确处理网易新闻链接</p>
          </div>
        </div>
      </div>
    </div>
  )
}