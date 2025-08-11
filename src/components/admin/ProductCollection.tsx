'use client'

import { useState, useEffect } from 'react'
import { Platform, CollectionTask, CollectionSettings, CollectionMethod } from '@/types/collection'
import { platformDetector, getSupportedPlatforms } from '@/utils/platformDetector'
import { contentFilter } from '@/utils/contentFilter'
import { PlatformIconCSSWithName, PlatformIconCSSSimple } from '@/components/ui/PlatformIconCSS'

export default function ProductCollection() {
  const [activeTab, setActiveTab] = useState<'single' | 'batch' | 'shop'>('single')
  const [tasks, setTasks] = useState<CollectionTask[]>([])
  const [loading, setLoading] = useState(false)
  
  // 单链接采集
  const [singleUrl, setSingleUrl] = useState('')
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null)
  
  // 批量采集
  const [batchUrls, setBatchUrls] = useState('')
  const [batchTaskName, setBatchTaskName] = useState('')
  
  // 店铺采集
  const [shopUrl, setShopUrl] = useState('')
  const [shopTaskName, setShopTaskName] = useState('')
  const [maxProducts, setMaxProducts] = useState(100)
  
  // 采集设置
  const [settings, setSettings] = useState<CollectionSettings>({
    maxProducts: 100,
    timeout: 30000,
    retryCount: 3,
    delay: 1000,
    enableContentFilter: true,
    filterKeywords: [],
    filterRegions: true,
    filterPlatforms: true,
    filterShipping: true,
    priceRange: { min: 0, max: 10000 },
    downloadImages: true,
    maxImages: 10,
    imageQuality: 'medium',
    includeVariants: true,
    includeReviews: false,
    includeShipping: true
  })

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  const supportedPlatforms = getSupportedPlatforms()

  useEffect(() => {
    fetchTasks()
  }, [])

  // 检测单链接平台
  useEffect(() => {
    if (singleUrl) {
      const detection = platformDetector.detectPlatform(singleUrl)
      console.log('平台检测结果:', detection)
      setDetectedPlatform(detection.platform)
    } else {
      setDetectedPlatform(null)
    }
  }, [singleUrl])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/collection/tasks')
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('获取采集任务失败:', error)
    }
  }

  const startSingleCollection = async () => {
    if (!singleUrl || !detectedPlatform) {
      alert('请输入有效的商品链接')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/collection/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: singleUrl
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('商品采集成功！')
        setSingleUrl('')
        setDetectedPlatform(null)
        // 可以在这里添加更新采集箱的逻辑
      } else {
        alert(result.error || '采集失败')
      }
    } catch (error) {
      console.error('采集失败:', error)
      alert('采集失败')
    } finally {
      setLoading(false)
    }
  }

  const startBatchCollection = async () => {
    const urls = batchUrls.split('\n').filter(url => url.trim())
    if (urls.length === 0) {
      alert('请输入商品链接')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/collection/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'batch',
          name: batchTaskName || `批量采集-${new Date().toLocaleString()}`,
          urls,
          settings
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('批量采集任务已启动')
        setBatchUrls('')
        setBatchTaskName('')
        fetchTasks()
      } else {
        alert(result.message || '启动采集失败')
      }
    } catch (error) {
      console.error('启动采集失败:', error)
      alert('启动采集失败')
    } finally {
      setLoading(false)
    }
  }

  const startShopCollection = async () => {
    if (!shopUrl) {
      alert('请输入店铺链接')
      return
    }

    const detection = platformDetector.detectShop(shopUrl)
    if (!detection.platform) {
      alert('无法识别店铺链接，请检查链接格式')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/collection/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'shop',
          platform: detection.platform,
          name: shopTaskName || `店铺采集-${new Date().toLocaleString()}`,
          shopUrl,
          settings: { ...settings, maxProducts }
        })
      })

      const result = await response.json()
      if (result.success) {
        alert('店铺采集任务已启动')
        setShopUrl('')
        setShopTaskName('')
        fetchTasks()
      } else {
        alert(result.message || '启动采集失败')
      }
    } catch (error) {
      console.error('启动采集失败:', error)
      alert('启动采集失败')
    } finally {
      setLoading(false)
    }
  }

  const cancelTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/admin/collection/tasks/${taskId}/cancel`, {
        method: 'POST'
      })
      
      const result = await response.json()
      if (result.success) {
        fetchTasks()
      } else {
        alert(result.message || '取消任务失败')
      }
    } catch (error) {
      console.error('取消任务失败:', error)
      alert('取消任务失败')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      pending: '等待中',
      processing: '采集中',
      completed: '已完成',
      failed: '失败',
      cancelled: '已取消'
    }
    return texts[status as keyof typeof texts] || status
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品采集</h1>
          <p className="text-gray-600 mt-1">从各大电商平台采集商品信息</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.href = '/admin/collection'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📦</span>
            <span>商品采集(新)</span>
          </button>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showAdvancedSettings ? '隐藏' : '显示'}高级设置
          </button>
        </div>
      </div>

      {/* 支持的平台 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">支持的平台</h2>
        <div className="flex flex-wrap gap-4">
          {supportedPlatforms.map(platform => (
            <div key={platform.id} className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors min-w-[120px]">
              <PlatformIconCSSWithName platform={platform.id} size={22} />
            </div>
          ))}
        </div>
      </div>

      {/* 采集方式选择 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'single', label: '单链接采集', icon: '🔗' },
              { key: 'batch', label: '批量采集', icon: '📋' },
              { key: 'shop', label: '店铺采集', icon: '🏪' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* 单链接采集 */}
          {activeTab === 'single' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品链接
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={singleUrl}
                    onChange={(e) => setSingleUrl(e.target.value)}
                    placeholder="请输入商品链接，支持淘宝、天猫、1688、拼多多、抖音小店、Temu"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    style={{ color: '#1f2937' }}
                  />
                  <button
                    onClick={startSingleCollection}
                    disabled={loading || !singleUrl || !detectedPlatform}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? '采集中...' : '开始采集'}
                  </button>
                </div>
                {detectedPlatform && (
                  <p className="text-sm text-green-600 mt-1">
                    ✓ 检测到平台: {supportedPlatforms.find(p => p.id === detectedPlatform)?.name}
                  </p>
                )}
                {singleUrl && !detectedPlatform && (
                  <p className="text-sm text-red-600 mt-1">
                    ✗ 未能识别平台，请检查链接格式
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 批量采集 */}
          {activeTab === 'batch' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任务名称
                </label>
                <input
                  type="text"
                  value={batchTaskName}
                  onChange={(e) => setBatchTaskName(e.target.value)}
                  placeholder="可选，不填写将自动生成"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品链接列表（每行一个）
                </label>
                <textarea
                  value={batchUrls}
                  onChange={(e) => setBatchUrls(e.target.value)}
                  rows={8}
                  placeholder="请输入商品链接，每行一个&#10;支持淘宝、天猫、1688、拼多多、抖音小店、Temu"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
                <p className="text-sm text-gray-500 mt-1">
                  共 {batchUrls.split('\n').filter(url => url.trim()).length} 个链接
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={startBatchCollection}
                  disabled={loading || !batchUrls.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '启动中...' : '开始批量采集'}
                </button>
              </div>
            </div>
          )}

          {/* 店铺采集 */}
          {activeTab === 'shop' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任务名称
                </label>
                <input
                  type="text"
                  value={shopTaskName}
                  onChange={(e) => setShopTaskName(e.target.value)}
                  placeholder="可选，不填写将自动生成"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  店铺链接
                </label>
                <input
                  type="url"
                  value={shopUrl}
                  onChange={(e) => setShopUrl(e.target.value)}
                  placeholder="请输入店铺首页链接"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大采集数量
                </label>
                <input
                  type="number"
                  value={maxProducts}
                  onChange={(e) => setMaxProducts(Number(e.target.value))}
                  min="1"
                  max="1000"
                  className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
                <p className="text-sm text-gray-500 mt-1">建议不超过500个商品</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={startShopCollection}
                  disabled={loading || !shopUrl}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '启动中...' : '开始店铺采集'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 高级设置 */}
      {showAdvancedSettings && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">高级设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 内容过滤 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">内容过滤</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.enableContentFilter}
                  onChange={(e) => setSettings(prev => ({ ...prev, enableContentFilter: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">启用内容过滤</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.filterPlatforms}
                  onChange={(e) => setSettings(prev => ({ ...prev, filterPlatforms: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">过滤平台信息</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.filterRegions}
                  onChange={(e) => setSettings(prev => ({ ...prev, filterRegions: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">过滤地区信息</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.filterShipping}
                  onChange={(e) => setSettings(prev => ({ ...prev, filterShipping: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">过滤快递信息</span>
              </label>
            </div>

            {/* 价格设置 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">价格范围</h3>
              <div>
                <label className="block text-sm text-gray-700">最低价格</label>
                <input
                  type="number"
                  value={settings.priceRange.min}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">最高价格</label>
                <input
                  type="number"
                  value={settings.priceRange.max}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
            </div>

            {/* 图片设置 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">图片设置</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.downloadImages}
                  onChange={(e) => setSettings(prev => ({ ...prev, downloadImages: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">下载图片</span>
              </label>
              <div>
                <label className="block text-sm text-gray-700">最大图片数量</label>
                <input
                  type="number"
                  value={settings.maxImages}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxImages: Number(e.target.value) }))}
                  min="1"
                  max="20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">图片质量</label>
                <select
                  value={settings.imageQuality}
                  onChange={(e) => setSettings(prev => ({ ...prev, imageQuality: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                >
                  <option value="low">低质量</option>
                  <option value="medium">中等质量</option>
                  <option value="high">高质量</option>
                </select>
              </div>
            </div>

            {/* 采集设置 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">采集设置</h3>
              <div>
                <label className="block text-sm text-gray-700">请求延迟(毫秒)</label>
                <input
                  type="number"
                  value={settings.delay}
                  onChange={(e) => setSettings(prev => ({ ...prev, delay: Number(e.target.value) }))}
                  min="500"
                  max="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">重试次数</label>
                <input
                  type="number"
                  value={settings.retryCount}
                  onChange={(e) => setSettings(prev => ({ ...prev, retryCount: Number(e.target.value) }))}
                  min="0"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">超时时间(秒)</label>
                <input
                  type="number"
                  value={settings.timeout / 1000}
                  onChange={(e) => setSettings(prev => ({ ...prev, timeout: Number(e.target.value) * 1000 }))}
                  min="10"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  style={{ color: '#1f2937' }}
                />
              </div>
            </div>

            {/* 其他设置 */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">其他设置</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeVariants}
                  onChange={(e) => setSettings(prev => ({ ...prev, includeVariants: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">包含商品变体</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeReviews}
                  onChange={(e) => setSettings(prev => ({ ...prev, includeReviews: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">包含评价信息</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.includeShipping}
                  onChange={(e) => setSettings(prev => ({ ...prev, includeShipping: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">包含物流信息</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 采集任务列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">采集任务</h2>
          <button
            onClick={fetchTasks}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 刷新
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  任务信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  平台
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  进度
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    暂无采集任务
                  </td>
                </tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.name}</div>
                        <div className="text-sm text-gray-500">
                          {task.method === 'single' ? '单链接' : task.method === 'batch' ? '批量' : '店铺'}采集
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PlatformIconCSSWithName platform={task.platform} size={20} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {task.collectedProducts}/{task.totalProducts}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {task.status === 'processing' && (
                        <button
                          onClick={() => cancelTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          取消
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <button
                          onClick={() => {
                            // 触发切换到采集箱Tab的事件
                            window.dispatchEvent(new CustomEvent('switchToCollectionBox', {
                              detail: { taskId: task.id }
                            }));
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          查看结果
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
