// 共享的商品存储模块
import { CollectedProduct } from '@/types/collection'

// 本地存储键名
const COLLECTION_BOX_KEY = 'collection_box_products';

// 获取采集箱中的商品
function getStoredProducts(): CollectedProduct[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(COLLECTION_BOX_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading collection box products:', error);
    return [];
  }
}

// 保存商品到本地存储
function saveProducts(products: CollectedProduct[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(COLLECTION_BOX_KEY, JSON.stringify(products));
    // 触发自定义事件，通知其他组件更新
    window.dispatchEvent(new CustomEvent('collectionBoxUpdated', {
      detail: { products }
    }));
  } catch (error) {
    console.error('Error saving products:', error);
  }
}

// 添加商品到采集箱
export function addProductToCollection(product: CollectedProduct): void {
  const products = getStoredProducts();

  // 检查是否已存在相同商品（基于原始URL）
  const isDuplicate = products.some(p => p.originalUrl === product.originalUrl);

  if (!isDuplicate) {
    products.unshift(product);
    saveProducts(products);
  }
}

// 批量添加商品到采集箱
export function addProductsToCollection(newProducts: CollectedProduct[]): void {
  const existingProducts = getStoredProducts();
  const allProducts = [...newProducts, ...existingProducts];
  saveProducts(allProducts);
}

// 获取所有采集的商品
export function getCollectedProducts(): CollectedProduct[] {
  return getStoredProducts();
}

// 根据ID获取商品
export function getProductById(id: string): CollectedProduct | undefined {
  const products = getStoredProducts();
  return products.find(product => product.id === id);
}

// 根据任务ID获取商品
export function getProductsByTaskId(taskId: string): CollectedProduct[] {
  const products = getStoredProducts();
  return products.filter(product => product.taskId === taskId);
}

// 更新商品
export function updateProduct(id: string, updates: Partial<CollectedProduct>): boolean {
  const products = getStoredProducts();
  const index = products.findIndex(product => product.id === id);

  if (index !== -1) {
    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveProducts(products);
    return true;
  }
  return false;
}

// 删除商品
export function deleteProduct(id: string): boolean {
  const products = getStoredProducts();
  const index = products.findIndex(product => product.id === id);

  if (index !== -1) {
    products.splice(index, 1);
    saveProducts(products);
    return true;
  }
  return false;
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
