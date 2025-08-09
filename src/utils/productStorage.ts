// 共享的商品存储模块
import { CollectedProduct } from '@/types/collection'

// 模拟商品存储（在实际项目中应该使用数据库）
let collectedProducts: CollectedProduct[] = []

// 添加商品到采集箱
export function addProductToCollection(product: CollectedProduct): void {
  collectedProducts.unshift(product)
}

// 批量添加商品到采集箱
export function addProductsToCollection(products: CollectedProduct[]): void {
  collectedProducts.unshift(...products)
}

// 获取所有采集的商品
export function getCollectedProducts(): CollectedProduct[] {
  return [...collectedProducts]
}

// 根据ID获取商品
export function getProductById(id: string): CollectedProduct | undefined {
  return collectedProducts.find(product => product.id === id)
}

// 根据任务ID获取商品
export function getProductsByTaskId(taskId: string): CollectedProduct[] {
  return collectedProducts.filter(product => product.taskId === taskId)
}

// 更新商品
export function updateProduct(id: string, updates: Partial<CollectedProduct>): boolean {
  const index = collectedProducts.findIndex(product => product.id === id)
  if (index !== -1) {
    collectedProducts[index] = {
      ...collectedProducts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return true
  }
  return false
}

// 删除商品
export function deleteProduct(id: string): boolean {
  const index = collectedProducts.findIndex(product => product.id === id)
  if (index !== -1) {
    collectedProducts.splice(index, 1)
    return true
  }
  return false
}

// 批量删除商品
export function deleteProducts(ids: string[]): number {
  let deletedCount = 0
  ids.forEach(id => {
    if (deleteProduct(id)) {
      deletedCount++
    }
  })
  return deletedCount
}

// 清空采集箱
export function clearCollection(): void {
  collectedProducts = []
}

// 获取统计信息
export function getCollectionStats(): {
  total: number
  byPlatform: Record<string, number>
  byStatus: Record<string, number>
  byTaskId: Record<string, number>
} {
  const stats = {
    total: collectedProducts.length,
    byPlatform: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byTaskId: {} as Record<string, number>
  }

  collectedProducts.forEach(product => {
    // 按平台统计
    stats.byPlatform[product.platform] = (stats.byPlatform[product.platform] || 0) + 1
    
    // 按状态统计
    stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1
    
    // 按任务统计
    stats.byTaskId[product.taskId] = (stats.byTaskId[product.taskId] || 0) + 1
  })

  return stats
}
