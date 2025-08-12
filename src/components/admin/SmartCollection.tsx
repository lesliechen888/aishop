'use client'

import { useState, useEffect } from 'react'
import { Platform, CollectionSettings } from '@/types/collection'
import { ParsedUrl, SmartParseResult, CollectionIntent, smartParser } from '@/utils/smartParser'
import { PlatformIconCSSSimple } from '@/components/ui/PlatformIconCSS'
import { getSupportedPlatforms } from '@/utils/platformDetector'
import { addProductsToCollection } from '@/utils/productStorage'
import RealTimeProgress from './RealTimeProgress'

export default function SmartCollection() {
  const [input, setInput] = useState('')
  const [parseResult, setParseResult] = useState<SmartParseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedUrls, setSelectedUrls] = useState<string[]>([])
  const [showHelp, setShowHelp] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [showProgress, setShowProgress] = useState(false)
  const [settings, setSettings] = useState<CollectionSettings>({
    enableContentFilter: true,
    enableImageDownload: true,
    enablePriceMonitoring: false,
    maxRetries: 3,
    retryDelay: 1000,
    requestDelay: 1000,
    customFilters: []
  })

  const supportedPlatforms = getSupportedPlatforms()

  // 快速检测输入中的平台
  const getInputPlatforms = () => {
    if (!input) return []
    const detectedPlatforms = new Set<Platform>()

    const lines = input.split('\n').filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('//'))
    lines.forEach(line => {
      if (line.includes('taobao.com') || line.includes('tmall.com')) detectedPlatforms.add('taobao')
      if (line.includes('1688.com')) detectedPlatforms.add('1688')
      if (line.includes('pinduoduo.com') || line.includes('yangkeduo.com')) detectedPlatforms.add('pdd')
      if (line.includes('jd.com')) detectedPlatforms.add('jd')
      if (line.includes('jinritemai.com') || line.includes('douyin.com')) detectedPlatforms.add('douyin')
      if (line.includes('temu.com')) detectedPlatforms.add('temu')
    })

    return Array.from(detectedPlatforms)
  }

  // 智能解析URL
  const handleSmartParse = () => {
    if (!input.trim()) {
      alert('请输入URL')
      return
    }

    setLoading(true)
    try {
      const result = smartParser.parseUrls(input)
      setParseResult(result)
      setSelectedUrls(result.urls.filter(url => url.isValid).map(url => url.id))
    } catch (error) {
      console.error('解析失败:', error)
      alert('解析失败，请检查输入格式')
    } finally {
      setLoading(false)
    }
  }

  // 更新URL信息
  const updateUrl = (urlId: string, updates: Partial<ParsedUrl>) => {
    if (!parseResult) return
    
    const updatedUrls = smartParser.updateUrl(urlId, updates, parseResult.urls)
    setParseResult({
      ...parseResult,
      urls: updatedUrls,
      summary: smartParser.generateSummary(updatedUrls)
    })
  }

  // 删除URL
  const removeUrl = (urlId: string) => {
    if (!parseResult) return
    
    const updatedUrls = smartParser.removeUrl(urlId, parseResult.urls)
    setParseResult({
      ...parseResult,
      urls: updatedUrls,
      summary: smartParser.generateSummary(updatedUrls)
    })
    setSelectedUrls(prev => prev.filter(id => id !== urlId))
  }

  // 批量选择
  const handleSelectAll = () => {
    if (!parseResult) return
    
    const validUrls = parseResult.urls.filter(url => url.isValid)
    if (selectedUrls.length === validUrls.length) {
      setSelectedUrls([])
    } else {
      setSelectedUrls(validUrls.map(url => url.id))
    }
  }

  // 确认并开始采集
  const handleStartCollection = async () => {
    if (!parseResult) return

    const selectedParsedUrls = parseResult.urls.filter(url => 
      selectedUrls.includes(url.id) && url.isValid
    )

    if (selectedParsedUrls.length === 0) {
      alert('请选择要采集的URL')
      return
    }

    // 验证是否可以开始采集
    const validation = smartParser.validateForCollection(selectedParsedUrls)
    if (!validation.canStart) {
      const confirmMsg = `发现以下问题:\n${validation.errors.join('\n')}\n\n是否继续采集?`
      if (!confirm(confirmMsg)) {
        return
      }
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/collection/smart-start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: selectedParsedUrls,
          settings
        })
      })

      const result = await response.json()
      if (result.success) {
        // 显示进度监控界面
        if (result.tasks && result.tasks.length > 0) {
          setActiveTaskId(result.tasks[0].id)
          setShowProgress(true)
        }

        alert(`成功创建 ${result.tasksCreated} 个采集任务`)

        // 采集成功后，提示用户查看采集箱
        setTimeout(() => {
          if (confirm('采集任务已创建！采集完成后商品将自动保存到采集箱。是否前往采集箱查看？')) {
            // 切换到采集箱页面（不改变URL）
            const switchEvent = new CustomEvent('switchToCollectionBox');
            window.dispatchEvent(switchEvent);
          }
        }, 1000);

        setInput('')
        setParseResult(null)
        setSelectedUrls([])
      } else {
        alert(result.message || '创建采集任务失败')
      }
    } catch (error) {
      console.error('启动采集失败:', error)
      alert('启动采集失败')
    } finally {
      setLoading(false)
    }
  }

  // 插入示例URL
  const insertExample = () => {
    const examples = [
      '# 商品页面示例（单品采集）',
      'https://item.taobao.com/item.htm?id=123456789',
      'https://detail.1688.com/offer/123456789.html',
      'https://pinduoduo.com/goods.html?goods_id=123456789',
      'https://jinritemai.com/views/product/item?id=123456789',
      'https://temu.com/goods.html?goods_id=123456789',
      '',
      '# 店铺页面示例（整店采集）',
      'https://shop123456.taobao.com/',
      'https://company.1688.com/',
      'https://pinduoduo.com/mall?mall_id=123456789'
    ]
    setInput(examples.join('\n'))
  }

  // 清空输入
  const clearInput = () => {
    setInput('')
    setParseResult(null)
    setSelectedUrls([])
  }

  // 获取意图显示文本
  const getIntentText = (intent: CollectionIntent) => {
    const intentMap = {
      'product': '单品采集',
      'shop': '整店采集',
      'batch': '批量采集'
    }
    return intentMap[intent]
  }

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* 实时进度监控 */}
      {showProgress && activeTaskId && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">实时采集进度</h2>
            <button
              onClick={() => setShowProgress(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              隐藏进度
            </button>
          </div>
          <RealTimeProgress
            taskId={activeTaskId}
            onComplete={() => {
              setShowProgress(false)
              setActiveTaskId(null)
              alert('采集任务已完成！请前往采集箱查看结果。')
            }}
          />
        </div>
      )}

      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">智能商品采集</h1>
          <p className="text-gray-600 mt-1">支持多平台、多类型URL的智能识别和批量采集</p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-md hover:bg-blue-50"
        >
          {showHelp ? '隐藏帮助' : '显示帮助'}
        </button>
      </div>

      {/* 支持的平台展示 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">支持的电商平台</h3>
            <div className="flex items-center space-x-4">
              {supportedPlatforms.map(platform => (
                <div key={platform.id} className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                  <PlatformIconCSSSimple platform={platform.id} size={20} />
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-600 font-medium">已支持 {supportedPlatforms.length} 个平台</div>
            <div className="text-xs text-blue-500 mt-1">自动识别 • 智能分类</div>
          </div>
        </div>
      </div>

      {/* 帮助信息 */}
      {showHelp && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">支持的URL格式详细说明：</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-medium text-blue-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                商品页面（单品采集）
              </p>
              <div className="space-y-3">
                {[
                  { platform: 'taobao', name: '淘宝', format: 'item.taobao.com/item.htm?id=...' },
                  { platform: '1688', name: '1688', format: 'detail.1688.com/offer/...html' },
                  { platform: 'pdd', name: '拼多多', format: 'pinduoduo.com/goods.html?goods_id=...' },
                  { platform: 'douyin', name: '抖音小店', format: 'jinritemai.com/views/product/item?id=...' },
                  { platform: 'temu', name: 'Temu', format: 'temu.com/goods.html?goods_id=...' }
                ].map(item => (
                  <div key={item.platform} className="flex items-center space-x-2 text-blue-800">
                    <PlatformIconCSSSimple platform={item.platform as Platform} size={16} />
                    <span className="font-medium">{item.name}:</span>
                    <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">{item.format}</code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-blue-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                店铺页面（整店采集）
              </p>
              <div className="space-y-3">
                {[
                  { platform: 'taobao', name: '淘宝店铺', format: 'shop123.taobao.com' },
                  { platform: '1688', name: '1688店铺', format: 'company.1688.com' },
                  { platform: 'pdd', name: '拼多多店铺', format: 'pinduoduo.com/mall?mall_id=...' },
                  { platform: 'douyin', name: '抖音店铺', format: 'jinritemai.com/views/shop/...' }
                ].map(item => (
                  <div key={item.platform} className="flex items-center space-x-2 text-blue-800">
                    <PlatformIconCSSSimple platform={item.platform as Platform} size={16} />
                    <span className="font-medium">{item.name}:</span>
                    <code className="text-xs bg-blue-100 px-1 py-0.5 rounded">{item.format}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-medium">💡 提示：</span>
              系统会自动识别URL类型并选择最适合的采集方式。您也可以在解析结果中手动调整平台和采集类型。
            </p>
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL输入 <span className="text-gray-500">(每行一个URL，支持上述所有平台的商品页面和店铺页面)</span>
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`请输入商品或店铺URL，每行一个，支持以下格式：

• 淘宝商品: https://item.taobao.com/item.htm?id=123456789
• 1688商品: https://detail.1688.com/offer/123456789.html
• 拼多多商品: https://pinduoduo.com/goods.html?goods_id=123456789
• 抖音商品: https://jinritemai.com/views/product/item?id=123456789
• Temu商品: https://temu.com/goods.html?goods_id=123456789

• 淘宝店铺: https://shop123456.taobao.com/
• 1688店铺: https://company.1688.com/

系统将自动识别平台类型和采集方式...`}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 resize-none text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
              style={{ color: '#1f2937' }}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={handleSmartParse}
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? '解析中...' : '智能解析'}
              </button>
              <button
                onClick={insertExample}
                disabled={loading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                插入示例
              </button>
              <button
                onClick={clearInput}
                disabled={loading}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                清空
              </button>
            </div>

            {input && (
              <div className="space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>
                    {input.split('\n').filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('//')).length} 个URL
                  </span>
                  <span className="text-blue-600">
                    {input.split('\n').filter(line => line.trim() && (line.startsWith('#') || line.startsWith('//'))).length > 0 &&
                      `${input.split('\n').filter(line => line.trim() && (line.startsWith('#') || line.startsWith('//'))).length} 行注释`
                    }
                  </span>
                </div>

                {/* 检测到的平台预览 */}
                {getInputPlatforms().length > 0 && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">检测到平台:</span>
                    {getInputPlatforms().map(platformId => {
                      const platform = supportedPlatforms.find(p => p.id === platformId)
                      return platform ? (
                        <div key={platformId} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                          <PlatformIconCSSSimple platform={platformId} size={12} />
                          <span className="text-gray-700">{platform.name}</span>
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 解析结果 */}
      {parseResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* 统计摘要 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">解析结果</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-600">有效: {parseResult.summary.valid}</span>
                <span className="text-red-600">无效: {parseResult.summary.invalid}</span>
                <span className="text-gray-600">总计: {parseResult.summary.total}</span>
              </div>
            </div>

            {/* 错误和警告 */}
            {(parseResult.errors.length > 0 || parseResult.warnings.length > 0) && (
              <div className="mt-3 space-y-2">
                {parseResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
                    ❌ {error}
                  </div>
                ))}
                {parseResult.warnings.map((warning, index) => (
                  <div key={index} className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded">
                    ⚠️ {warning}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URL列表 */}
          {parseResult.urls.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedUrls.length === parseResult.urls.filter(url => url.isValid).length ? '取消全选' : '全选'}
                  </button>
                  <span className="text-sm text-gray-500">
                    已选择 {selectedUrls.length} 个URL
                  </span>
                </div>

                {selectedUrls.length > 0 && (
                  <button
                    onClick={handleStartCollection}
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                  >
                    {loading ? '创建中...' : `确认并开始采集 (${selectedUrls.length})`}
                  </button>
                )}
              </div>

              {/* URL表格 */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        选择
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平台
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        类型
                      </th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        置信度
                      </th>
                      <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parseResult.urls.map((url) => (
                      <tr key={url.id} className={url.isValid ? '' : 'bg-red-50'}>
                        <td className="px-3 py-4">
                          {url.isValid && (
                            <input
                              type="checkbox"
                              checked={selectedUrls.includes(url.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUrls(prev => [...prev, url.id])
                                } else {
                                  setSelectedUrls(prev => prev.filter(id => id !== url.id))
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="text-sm text-gray-900 break-all max-w-md">
                            {url.originalUrl}
                          </div>
                          {url.error && (
                            <div className="text-xs text-red-600 mt-1">{url.error}</div>
                          )}
                          {url.suggestions && url.suggestions.length > 0 && (
                            <div className="text-xs text-blue-600 mt-1">
                              建议: {url.suggestions[0]}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          {url.platform ? (
                            <div className="flex items-center space-x-2">
                              <PlatformIconCSSSimple platform={url.platform} size={16} />
                              <select
                                value={url.platform}
                                onChange={(e) => updateUrl(url.id, { platform: e.target.value as Platform })}
                                className="text-xs border border-gray-300 rounded px-1 py-0.5"
                              >
                                {supportedPlatforms.map(platform => (
                                  <option key={platform.id} value={platform.id}>
                                    {platform.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">未识别</span>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <select
                            value={url.intent}
                            onChange={(e) => updateUrl(url.id, { intent: e.target.value as CollectionIntent })}
                            className="text-xs border border-gray-300 rounded px-1 py-0.5"
                            disabled={!url.isValid}
                          >
                            <option value="product">单品采集</option>
                            <option value="shop">整店采集</option>
                            <option value="batch">批量采集</option>
                          </select>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`text-sm font-medium ${getConfidenceColor(url.confidence)}`}>
                            {Math.round(url.confidence * 100)}%
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            url.isValid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {url.isValid ? '有效' : '无效'}
                          </span>
                        </td>
                        <td className="px-3 py-4">
                          <button
                            onClick={() => removeUrl(url.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
