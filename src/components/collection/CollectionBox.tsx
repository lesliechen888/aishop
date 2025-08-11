'use client';

import { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { CollectedProduct, PriceAdjustment } from '@/types/collection';

interface CollectionBoxProps {
  products: CollectedProduct[];
  onBatchEdit: (productIds: string[], updates: any) => void;
  onBatchPublish: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
}

const CollectionBox = ({ products, onBatchEdit, onBatchPublish, onDelete }: CollectionBoxProps) => {
  const { t } = useLocalization();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBatchEdit, setShowBatchEdit] = useState(false);
  const [priceAdjustment, setPriceAdjustment] = useState<PriceAdjustment>({
    type: 'percentage',
    operation: 'increase',
    value: 50
  });

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleBatchEdit = () => {
    if (selectedProducts.length === 0) {
      alert('请选择要编辑的商品');
      return;
    }
    setShowBatchEdit(true);
  };

  const applyBatchEdit = () => {
    onBatchEdit(selectedProducts, {
      priceAdjustment
    });
    setShowBatchEdit(false);
    setSelectedProducts([]);
  };

  const handleBatchPublish = () => {
    if (selectedProducts.length === 0) {
      alert('请选择要发布的商品');
      return;
    }
    onBatchPublish(selectedProducts);
    setSelectedProducts([]);
  };

  const handleDelete = () => {
    if (selectedProducts.length === 0) {
      alert('请选择要删除的商品');
      return;
    }
    if (confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
      onDelete(selectedProducts);
      setSelectedProducts([]);
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {t('collectionBox.empty')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            开始采集商品，它们会出现在这里
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Batch Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {t('collectionBox.selectAll')} ({selectedProducts.length}/{products.length})
              </span>
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchEdit}
              disabled={selectedProducts.length === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('collectionBox.batchEdit')}
            </button>
            <button
              onClick={handleBatchPublish}
              disabled={selectedProducts.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('collectionBox.batchPublish')}
            </button>
            <button
              onClick={handleDelete}
              disabled={selectedProducts.length === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('collectionBox.delete')}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => handleSelectProduct(product.id)}
                className="absolute top-2 left-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded z-10"
              />
              <img
                src={product.images[0] || '/placeholder-product.jpg'}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {product.status === 'published' ? t('collectionBox.published') : t('collectionBox.draft')}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                {product.title}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ¥{product.originalPrice}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {product.sourcePlatform}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {product.category}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(product.collectedAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batch Edit Modal */}
      {showBatchEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('collectionBox.batchEdit')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('collectionBox.priceAdjust')}
                </label>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <select
                    value={priceAdjustment.operation}
                    onChange={(e) => setPriceAdjustment(prev => ({ ...prev, operation: e.target.value as 'increase' | 'decrease' }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="increase">{t('collectionBox.increaseBy')}</option>
                    <option value="decrease">{t('collectionBox.decreaseBy')}</option>
                  </select>
                  
                  <select
                    value={priceAdjustment.type}
                    onChange={(e) => setPriceAdjustment(prev => ({ ...prev, type: e.target.value as 'percentage' | 'fixed' }))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="percentage">{t('collectionBox.percentage')}</option>
                    <option value="fixed">{t('collectionBox.fixedAmount')}</option>
                  </select>
                </div>
                
                <input
                  type="number"
                  value={priceAdjustment.value}
                  onChange={(e) => setPriceAdjustment(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="输入数值"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowBatchEdit(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                取消
              </button>
              <button
                onClick={applyBatchEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {t('collectionBox.apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionBox;
