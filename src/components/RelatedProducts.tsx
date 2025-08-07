'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productDatabase } from '@/data/productDatabase';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProduct: Product;
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = () => {
      try {
        setLoading(true);
        
        // 获取相关产品的逻辑：
        // 1. 同分类的产品
        // 2. 相似价格区间的产品
        // 3. 排除当前产品
        const related = productDatabase
          .filter(product => 
            product.id !== currentProduct.id && 
            (
              product.category === currentProduct.category ||
              Math.abs(product.price - currentProduct.price) < 50
            )
          )
          .slice(0, 8); // 最多显示8个相关产品

        setRelatedProducts(related);
      } catch (error) {
        console.error('获取相关产品失败:', error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">相关推荐</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关产品</h3>
        <p className="text-gray-600">我们正在为您寻找更多相似的产品</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">相关推荐</h2>
        <a 
          href="/products" 
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1"
        >
          <span>查看更多</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product}
            showQuickView={false}
          />
        ))}
      </div>

      {/* 推荐算法说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">智能推荐</h3>
            <p className="text-sm text-blue-700">
              基于您浏览的产品类型、价格区间和用户偏好，为您精选相似产品
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
