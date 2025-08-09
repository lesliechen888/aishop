'use client'

import { useState, useEffect } from 'react'

interface AfterSalesRequest {
  id: string
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  type: 'refund' | 'exchange' | 'repair' | 'complaint'
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed'
  reason: string
  description: string
  images: string[]
  amount?: number
  createdAt: string
  updatedAt: string
  handlerName?: string
  handlerNotes?: string
  productInfo: {
    id: string
    name: string
    image: string
    sku: string
    quantity: number
    price: number
  }
}

interface AfterSalesStats {
  total: number
  pending: number
  processing: number
  approved: number
  rejected: number
  completed: number
  totalRefundAmount: number
  avgProcessingTime: number
}

export default function AfterSales() {
  const [requests, setRequests] = useState<AfterSalesRequest[]>([])
  const [stats, setStats] = useState<AfterSalesStats>({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0,
    completed: 0,
    totalRefundAmount: 0,
    avgProcessingTime: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<AfterSalesRequest | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAfterSalesRequests()
    fetchStats()
  }, [filterType, filterStatus, searchTerm])

  const fetchAfterSalesRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(filterType && { type: filterType }),
        ...(filterStatus && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm })
      })
      
      const response = await fetch(`/api/admin/after-sales?${params}`)
      const data = await response.json()
      if (data.success) {
        setRequests(data.requests)
      }
    } catch (error) {
      console.error('获取售后请求失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/after-sales/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('获取售后统计失败:', error)
    }
  }

  const getTypeText = (type: string) => {
    const typeMap = {
      refund: '退款',
      exchange: '换货',
      repair: '维修',
      complaint: '投诉'
    }
    return typeMap[type as keyof typeof typeMap] || type
  }

  const getTypeColor = (type: string) => {
    const colorMap = {
      refund: 'bg-red-100 text-red-800',
      exchange: 'bg-blue-100 text-blue-800',
      repair: 'bg-yellow-100 text-yellow-800',
      complaint: 'bg-purple-100 text-purple-800'
    }
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '待处理',
      processing: '处理中',
      approved: '已同意',
      rejected: '已拒绝',
      completed: '已完成'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const updateRequestStatus = async (requestId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/after-sales/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, handlerNotes: notes }),
      })
      
      const result = await response.json()
      if (result.success) {
        fetchAfterSalesRequests()
        fetchStats()
        alert('状态更新成功')
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('更新状态失败:', error)
      alert('更新失败')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">售后工作台</h1>
          <p className="text-gray-600 mt-1">处理客户售后请求和投诉</p>
        </div>
        <button
          onClick={() => window.open('/admin/after-sales', '_blank')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          打开完整版
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">待处理</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
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
                  <span className="text-white text-sm">🔄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">处理中</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.processing}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">已完成</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">退款金额</dt>
                  <dd className="text-lg font-medium text-gray-900">¥{stats.totalRefundAmount.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速筛选 */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">所有状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="approved">已同意</option>
            <option value="rejected">已拒绝</option>
            <option value="completed">已完成</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">所有类型</option>
            <option value="refund">退款</option>
            <option value="exchange">换货</option>
            <option value="repair">维修</option>
            <option value="complaint">投诉</option>
          </select>
        </div>
      </div>

      {/* 售后请求列表（简化版） */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最新售后请求</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {requests.slice(0, 5).map((request) => (
            <li key={request.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                    {getTypeText(request.type)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                  <span className="text-sm text-gray-900">#{request.orderNumber}</span>
                  <span className="text-sm text-gray-500">{request.customerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'approved')}
                        className="text-green-600 hover:text-green-900 text-sm font-medium"
                      >
                        ✅ 同意
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                      >
                        ❌ 拒绝
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
