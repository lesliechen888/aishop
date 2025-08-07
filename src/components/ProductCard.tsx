'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Product } from '@/types';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  showQuickView?: boolean;
}

const ProductCard = ({ product, viewMode = 'grid', showQuickView = true }: ProductCardProps) => {
  const { formatPrice, t } = useLocalization();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);



  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half-fill">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half-fill)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20">
          <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }

    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          {/* 产品图片 */}
          <div className="md:w-1/3 relative aspect-square md:aspect-auto bg-gray-100 dark:bg-gray-700 overflow-hidden group">
            <ProductImage
              category={product.category}
              productName={product.actualName || product.name}
              productId={product.id}
              className="w-full h-full"
            />
            
            {/* 折扣标签 */}
            {product.discount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.discount}%
              </div>
            )}

            {/* 收藏按钮 */}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="absolute top-3 right-3 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg 
                className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* 产品信息 */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* 分类 */}
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
                {t(product.category)}
              </div>

              {/* 产品名称 */}
              <Link href={`/products/${product.id}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                  {product.actualName || (product.name.startsWith('products.generated.') ? t('products.generated.fallback.name') : t(product.name))}
                </h3>
              </Link>

              {/* 产品描述 */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {product.actualDescription || (product.description.startsWith('products.generated.') ? t('products.generated.fallback.description') : t(product.description))}
              </p>

              {/* 评分 */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.rating} ({product.reviewCount} {t('products.reviews')})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* 价格 */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* 添加到购物车按钮 */}
              <button
                disabled={!product.inStock}
                className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  product.inStock
                    ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 网格视图模式
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 产品图片 */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden group">
        <Link href={`/products/${product.id}`}>
          <ProductImage
            category={product.category}
            productName={product.actualName || product.name}
            productId={product.id}
            className="w-full h-full cursor-pointer"
          />
        </Link>
        
        {/* 折扣标签 */}
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}

        {/* 快速操作按钮 */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <svg 
              className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>

        {/* 库存状态 */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
              {t('products.outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* 产品信息 */}
      <div className="p-6">
        {/* 分类 */}
        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
          {t(product.category)}
        </div>

        {/* 产品名称 */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {product.actualName || (product.name.startsWith('products.generated.') ? t('products.generated.fallback.name') : t(product.name))}
          </h3>
        </Link>

        {/* 评分 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        {/* 价格 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* 添加到购物车按钮 */}
        <button
          disabled={!product.inStock}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            product.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.inStock ? t('products.addToCart') : t('products.outOfStock')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
