'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  sales: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    conversionRate: number
    dailySales: Array<{ date: string; revenue: number; orders: number }>
    monthlySales: Array<{ month: string; revenue: number; orders: number }>
  }
  traffic: {
    totalVisitors: number
    uniqueVisitors: number
    pageViews: number
    bounceRate: number
    averageSessionDuration: number
    topPages: Array<{ page: string; views: number; uniqueViews: number }>
    trafficSources: Array<{ source: string; visitors: number; percentage: number }>
  }
  products: {
    totalProducts: number
    topSellingProducts: Array<{
      id: string
      name: string
      sales: number
      revenue: number
      image: string
    }>
    categoryPerformance: Array<{
      category: string
      sales: number
      revenue: number
      products: number
    }>
  }
  customers: {
    totalCustomers: number
    newCustomers: number
    returningCustomers: number
    customerLifetimeValue: number
    topCustomers: Array<{
      id: string
      name: string
      email: string
      totalOrders: number
      totalSpent: number
    }>
  }
  geography: {
    countryStats: Array<{
      country: string
      countryCode: string
      visitors: number
      orders: number
      revenue: number
    }>
    cityStats: Array<{
      city: string
      country: string
      visitors: number
      orders: number
    }>
  }
}

export default function DataAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'traffic' | 'products' | 'customers' | 'geography'>('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?start=${dateRange.start}&end=${dateRange.end}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('获取分析数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无数据</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和日期选择 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据分析</h1>
          <p className="mt-1 text-sm text-gray-500">经营数据罗盘，洞察业务表现</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">日期范围:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: '总览', icon: '📊' },
            { key: 'sales', label: '销售分析', icon: '💰' },
            { key: 'traffic', label: '流量分析', icon: '📈' },
            { key: 'products', label: '商品分析', icon: '📦' },
            { key: 'customers', label: '客户分析', icon: '👥' },
            { key: 'geography', label: '地域分析', icon: '🌍' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 总览标签页 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总收入</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatCurrency(data.sales.totalRevenue)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📦</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总订单数</dt>
                      <dd className="text-lg font-medium text-gray-900">{data.sales.totalOrders.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">总访客数</dt>
                      <dd className="text-lg font-medium text-gray-900">{data.traffic.totalVisitors.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📈</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">转化率</dt>
                      <dd className="text-lg font-medium text-gray-900">{formatPercentage(data.sales.conversionRate)}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 销售趋势图表 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">销售趋势</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {data.sales.dailySales.slice(-14).map((day, index) => {
                const maxRevenue = Math.max(...data.sales.dailySales.map(d => d.revenue))
                const height = (day.revenue / maxRevenue) * 100
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="bg-blue-500 rounded-t w-8 min-h-[4px]"
                      style={{ height: `${height}%` }}
                      title={`${day.date}: ${formatCurrency(day.revenue)}`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45">
                      {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 热销商品 */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">热销商品 TOP 5</h3>
            <div className="space-y-4">
              {data.products.topSellingProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">销量: {product.sales}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 销售分析标签页 */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">平均订单价值</h4>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.sales.averageOrderValue)}</p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">转化率</h4>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.sales.conversionRate)}</p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">月度增长</h4>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">月度销售趋势</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月份</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收入</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">增长率</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.sales.monthlySales.map((month, index) => (
                    <tr key={month.month}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{month.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{month.orders.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(month.revenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8.2%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 流量分析标签页 */}
      {activeTab === 'traffic' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">总访客</h4>
              <p className="text-2xl font-bold text-gray-900">{data.traffic.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">独立访客</h4>
              <p className="text-2xl font-bold text-gray-900">{data.traffic.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">跳出率</h4>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.traffic.bounceRate)}</p>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500">平均停留时间</h4>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(data.traffic.averageSessionDuration)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">热门页面</h3>
              <div className="space-y-3">
                {data.traffic.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{page.page}</p>
                      <p className="text-sm text-gray-500">独立访问: {page.uniqueViews.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">浏览量</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">流量来源</h3>
              <div className="space-y-3">
                {data.traffic.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">{source.source}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{source.visitors.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{formatPercentage(source.percentage / 100)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 地域分析标签页 */}
      {activeTab === 'geography' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">国家/地区分析</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">国家/地区</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">访客数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">收入</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">转化率</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.geography.countryStats.map((country, index) => (
                    <tr key={country.countryCode}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{country.countryCode}</span>
                          <span className="text-sm font-medium text-gray-900">{country.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{country.visitors.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{country.orders.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(country.revenue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(country.orders / country.visitors)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">热门城市</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.geography.cityStats.slice(0, 9).map((city, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{city.city}</p>
                      <p className="text-sm text-gray-500">{city.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{city.visitors.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{city.orders} 订单</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
