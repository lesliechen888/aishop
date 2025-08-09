'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'

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

export default function AfterSalesPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  
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
  }, [orderId, filterType, filterStatus, searchTerm])

  const fetchAfterSalesRequests = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(orderId && { orderId }),
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
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">售后工作台</h1>
            <p className="text-gray-600 mt-1">处理客户售后请求和投诉</p>
          </div>
          {orderId && (
            <div className="text-sm text-gray-500">
              订单筛选: {orderId}
            </div>
          )}
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

        {/* 搜索和过滤 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="搜索订单号或客户姓名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有类型</option>
                <option value="refund">退款</option>
                <option value="exchange">换货</option>
                <option value="repair">维修</option>
                <option value="complaint">投诉</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">所有状态</option>
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="approved">已同意</option>
                <option value="rejected">已拒绝</option>
                <option value="completed">已完成</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setFilterType('')
                  setFilterStatus('')
                  setSearchTerm('')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                清除筛选
              </button>
            </div>
          </div>
        </div>

        {/* 售后请求列表 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">售后请求列表</h2>
          </div>
          <ul className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <li className="px-6 py-12 text-center">
                <div className="text-gray-500">
                  <div className="text-4xl mb-4">📋</div>
                  <p>暂无售后请求</p>
                </div>
              </li>
            ) : (
              requests.map((request) => (
                <li key={request.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-sm font-medium text-gray-900">
                            #{request.orderNumber}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(request.type)}`}>
                            {getTypeText(request.type)}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {getStatusText(request.status)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">{request.customerName}</p>
                            <p className="text-sm text-gray-500">{request.customerEmail}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <img
                              src={request.productInfo.image}
                              alt={request.productInfo.name}
                              className="w-10 h-10 object-cover rounded-md"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/40x40/f3f4f6/9ca3af?text=${encodeURIComponent(request.productInfo.name.slice(0, 2))}`;
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{request.productInfo.name}</p>
                              <p className="text-xs text-gray-500">SKU: {request.productInfo.sku}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{request.reason}</p>
                          {request.amount && (
                            <p className="text-sm font-medium text-red-600">¥{request.amount.toFixed(2)}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-2">{request.description}</p>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowDetail(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                      >
                        👁️ 查看
                      </button>

                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateRequestStatus(request.id, 'processing')}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                          >
                            🔄 处理
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('请输入同意理由:')
                              if (notes !== null) {
                                updateRequestStatus(request.id, 'approved', notes)
                              }
                            }}
                            className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                          >
                            ✅ 同意
                          </button>
                          <button
                            onClick={() => {
                              const notes = prompt('请输入拒绝理由:')
                              if (notes !== null) {
                                updateRequestStatus(request.id, 'rejected', notes)
                              }
                            }}
                            className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                          >
                            ❌ 拒绝
                          </button>
                        </>
                      )}

                      {request.status === 'approved' && (
                        <button
                          onClick={() => updateRequestStatus(request.id, 'completed')}
                          className="text-green-600 hover:text-green-900 text-sm font-medium px-2 py-1 rounded border border-green-200 hover:bg-green-50"
                        >
                          ✅ 完成
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* 售后详情模态框 */}
        {showDetail && selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    售后详情 - #{selectedRequest.orderNumber}
                  </h3>
                  <button
                    onClick={() => {
                      setShowDetail(false)
                      setSelectedRequest(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">售后类型</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedRequest.type)}`}>
                        {getTypeText(selectedRequest.type)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">状态</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">客户姓名</label>
                      <p className="text-sm text-gray-900">{selectedRequest.customerName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">联系邮箱</label>
                      <p className="text-sm text-gray-900">{selectedRequest.customerEmail}</p>
                    </div>
                  </div>

                  {/* 商品信息 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">商品信息</label>
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                      <img
                        src={selectedRequest.productInfo.image}
                        alt={selectedRequest.productInfo.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{selectedRequest.productInfo.name}</p>
                        <p className="text-sm text-gray-500">SKU: {selectedRequest.productInfo.sku}</p>
                        <p className="text-sm text-gray-500">数量: {selectedRequest.productInfo.quantity}</p>
                        <p className="text-sm text-gray-500">单价: ¥{selectedRequest.productInfo.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 售后原因和描述 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">售后原因</label>
                    <p className="text-sm text-gray-900">{selectedRequest.reason}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">详细描述</label>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedRequest.description}</p>
                  </div>

                  {/* 图片证据 */}
                  {selectedRequest.images.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">图片证据</label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedRequest.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`证据图片 ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75"
                            onClick={() => window.open(image, '_blank')}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 处理记录 */}
                  {selectedRequest.handlerNotes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">处理记录</label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{selectedRequest.handlerNotes}</p>
                        {selectedRequest.handlerName && (
                          <p className="text-xs text-gray-500 mt-1">处理人: {selectedRequest.handlerName}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => {
                      setShowDetail(false)
                      setSelectedRequest(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
