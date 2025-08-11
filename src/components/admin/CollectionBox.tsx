'use client'

import { useState, useEffect } from 'react'
import { CollectedProduct, BatchEditRule, Platform } from '@/types/collection'
import { getSupportedPlatforms } from '@/utils/platformDetector'
import { getImageFallback } from '@/utils/errorHandler'
import { PlatformIconCSSSimple } from '@/components/ui/PlatformIconCSS'
import { getCollectedProducts, addProductsToCollection } from '@/utils/productStorage'
import BatchEditRules from './BatchEditRules'

export default function CollectionBox() {
  const [products, setProducts] = useState<CollectedProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPlatform, setFilterPlatform] = useState<Platform | ''>('')
  const [filterStatus, setFilterStatus] = useState('')
  const [sortBy, setSortBy] = useState('collectedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showBatchEdit, setShowBatchEdit] = useState(false)
  const [showProductDetail, setShowProductDetail] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<CollectedProduct | null>(null)

  const supportedPlatforms = getSupportedPlatforms()

  useEffect(() => {
    fetchProducts()

    // 定期检查新采集的商品
    const checkNewProducts = async () => {
      try {
        const response = await fetch('/api/admin/collection/completed-products')
        const data = await response.json()
        if (data.success && data.products.length > 0) {
          // 将新采集的商品保存到localStorage
          addProductsToCollection(data.products)

          // 清空服务端的临时存储
          await fetch(`/api/admin/collection/completed-products?ids=${data.products.map((p: CollectedProduct) => p.id).join(',')}`, {
            method: 'DELETE'
          })

          // 刷新商品列表
          fetchProducts()
        }
      } catch (error) {
        console.error('检查新采集商品失败:', error)
      }
    }

    // 立即检查一次
    checkNewProducts()

    // 每30秒检查一次新商品
    const interval = setInterval(checkNewProducts, 30000)

    return () => clearInterval(interval)
  }, [filterPlatform, filterStatus, sortBy, sortOrder])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // 从localStorage获取商品
      const localProducts = getCollectedProducts()

      // 应用过滤和排序
      let filteredProducts = localProducts

      if (filterPlatform) {
        filteredProducts = filteredProducts.filter(p => p.platform === filterPlatform)
      }

      if (filterStatus) {
        filteredProducts = filteredProducts.filter(p => p.status === filterStatus)
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        filteredProducts = filteredProducts.filter(p =>
          p.title.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.shopName?.toLowerCase().includes(term)
        )
      }

      // 排序
      filteredProducts.sort((a, b) => {
        let aValue = a[sortBy as keyof CollectedProduct] as any
        let bValue = b[sortBy as keyof CollectedProduct] as any

        if (sortBy === 'collectedAt') {
          aValue = new Date(aValue).getTime()
          bValue = new Date(bValue).getTime()
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      setProducts(filteredProducts)

    } catch (error) {
      console.error('获取采集商品失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(p => p.id))
    }
  }

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const deleteProducts = async (productIds: string[]) => {
    if (!confirm(`确定要删除 ${productIds.length} 个商品吗？`)) return

    try {
      const response = await fetch('/api/admin/collection/products/batch-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      })

      const result = await response.json()
      if (result.success) {
        fetchProducts()
        setSelectedProducts([])
        alert('删除成功')
      } else {
        alert(result.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败')
    }
  }

  const publishProducts = async (productIds: string[]) => {
    if (!confirm(`确定要发布 ${productIds.length} 个商品吗？`)) return

    try {
      const response = await fetch('/api/admin/collection/products/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      })

      const result = await response.json()
      if (result.success) {
        fetchProducts()
        setSelectedProducts([])
        alert('发布成功')
      } else {
        alert(result.message || '发布失败')
      }
    } catch (error) {
      console.error('发布失败:', error)
      alert('发布失败')
    }
  }

  const applyBatchRules = async (rules: BatchEditRule[]) => {
    try {
      const response = await fetch('/api/admin/collection/products/batch-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProducts,
          rules
        })
      })

      const result = await response.json()
      if (result.success) {
        fetchProducts()
        setSelectedProducts([])
        setShowBatchEdit(false)
        alert('批量编辑成功')
      } else {
        alert(result.message || '批量编辑失败')
      }
    } catch (error) {
      console.error('批量编辑失败:', error)
      alert('批量编辑失败')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      published: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts = {
      draft: '草稿',
      pending_review: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      published: '已发布'
    }
    return texts[status as keyof typeof texts] || status
  }

  const filteredProducts = products.filter(product => {
    if (searchTerm && !product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    return true
  })

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
          <h1 className="text-2xl font-bold text-gray-900">采集箱</h1>
          <p className="text-gray-600 mt-1">管理采集的商品，编辑后发布到商品库</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedProducts.length > 0 && (
            <>
              <button
                onClick={() => setShowBatchEdit(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                批量编辑 ({selectedProducts.length})
              </button>
              {selectedProducts.some(id => {
                const product = products.find(p => p.id === id);
                return product && product.status !== 'published';
              }) && (
                <button
                  onClick={() => {
                    const unpublishedIds = selectedProducts.filter(id => {
                      const product = products.find(p => p.id === id);
                      return product && product.status !== 'published';
                    });
                    publishProducts(unpublishedIds);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  批量发布
                </button>
              )}
              <button
                onClick={() => deleteProducts(selectedProducts)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                批量删除
              </button>
            </>
          )}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <input
              type="text"
              placeholder="搜索商品标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as Platform | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有平台</option>
              {supportedPlatforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">所有状态</option>
              <option value="draft">草稿</option>
              <option value="pending_review">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
              <option value="published">已发布</option>
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="collectedAt">采集时间</option>
              <option value="title">商品标题</option>
              <option value="price">价格</option>
              <option value="platform">平台</option>
            </select>
          </div>
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            共 {filteredProducts.length} 个商品
          </div>
          <button
            onClick={fetchProducts}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            🔄 刷新
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">全选</span>
            </label>
            <div className="text-sm text-gray-500">
              已选择 {selectedProducts.length} 个商品
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <div className="text-4xl mb-4">📦</div>
            <p>采集箱为空</p>
            <p className="text-sm mt-2">
              <a href="/admin/product-collection" className="text-blue-600 hover:text-blue-800">
                去采集商品 →
              </a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                  selectedProducts.includes(product.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="absolute top-2 left-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500 z-10"
                  />
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover cursor-pointer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getImageFallback(product.title, 300, 200);
                    }}
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowProductDetail(true)
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <PlatformIconCSSSimple platform={product.platform} size={20} />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-red-600">
                        ¥{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ¥{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(product.collectedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowProductDetail(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      查看详情
                    </button>
                    <div className="flex items-center space-x-2">
                      {product.status !== 'published' && (
                        <button
                          onClick={() => publishProducts([product.id])}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          发布
                        </button>
                      )}
                      <button
                        onClick={() => deleteProducts([product.id])}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 批量编辑模态框 */}
      {showBatchEdit && (
        <BatchEditRules
          selectedProducts={selectedProducts}
          onClose={() => setShowBatchEdit(false)}
          onApply={applyBatchRules}
        />
      )}
    </div>
  )
}
