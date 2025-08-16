'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DatabaseProduct } from '@/lib/productDatabase';
import { useLocalization } from '@/contexts/LocalizationContext';

interface EnhancedProductCardProps {
  product: DatabaseProduct;
  viewMode: 'grid' | 'list';
  onAddToCart: (productId: string, quantity: number) => void;
}

const EnhancedProductCard = ({ product, viewMode, onAddToCart }: EnhancedProductCardProps) => {
  const { language, t } = useLocalization();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // 获取当前语言的商品名称和描述
  const getLocalizedText = (text: any): string => {
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text !== null) {
      return text[language as keyof typeof text] || text.en || '';
    }
    return '';
  };

  // 获取本地化的品牌名称
  const getLocalizedBrandName = (brand: string): string => {
    const brandMap: Record<string, Record<string, string>> = {
      'Victoria\'s Secret': {
        en: 'Victoria\'s Secret',
        zh: '维密',
        es: 'Victoria\'s Secret',
        fr: 'Victoria\'s Secret',
        de: 'Victoria\'s Secret',
        ja: 'ヴィクシー'
      },
      'Calvin Klein': {
        en: 'Calvin Klein',
        zh: 'CK',
        es: 'Calvin Klein',
        fr: 'Calvin Klein',
        de: 'Calvin Klein',
        ja: 'CK'
      },
      'Tommy Hilfiger': {
        en: 'Tommy Hilfiger',
        zh: '汤米',
        es: 'Tommy Hilfiger',
        fr: 'Tommy Hilfiger',
        de: 'Tommy Hilfiger',
        ja: 'トミー'
      },
      'La Perla': {
        en: 'La Perla',
        zh: '拉佩拉',
        es: 'La Perla',
        fr: 'La Perla',
        de: 'La Perla',
        ja: 'ラ・ペルラ'
      },
      'Agent Provocateur': {
        en: 'Agent Provocateur',
        zh: '特工',
        es: 'Agent Provocateur',
        fr: 'Agent Provocateur',
        de: 'Agent Provocateur',
        ja: 'エージェント'
      },
      'Intimissimi': {
        en: 'Intimissimi',
        zh: '意趣',
        es: 'Intimissimi',
        fr: 'Intimissimi',
        de: 'Intimissimi',
        ja: 'インティミ'
      },
      'Triumph': {
        en: 'Triumph',
        zh: '黛安芬',
        es: 'Triumph',
        fr: 'Triumph',
        de: 'Triumph',
        ja: 'トリンプ'
      },
      'Wacoal': {
        en: 'Wacoal',
        zh: '华歌尔',
        es: 'Wacoal',
        fr: 'Wacoal',
        de: 'Wacoal',
        ja: 'ワコール'
      }
    };

    const brandTranslations = brandMap[brand];
    if (brandTranslations) {
      return brandTranslations[language as keyof typeof brandTranslations] || brandTranslations.en || brand;
    }
    return brand;
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product.id, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-${product.id}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill={`url(#half-${product.id})`} d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-4 h-4 text-gray-300 dark:text-gray-600" viewBox="0 0 20 20">
            <path fill="currentColor" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        );
      }
    }
    return stars;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        <div className="flex">
          {/* 图片区域 */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <Image
              src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
              }}
            />
            
            {/* 折扣标签 */}
            {product.discount && product.discount > 0 && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                -{product.discount}%
              </div>
            )}

            {/* 库存状态 */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-bold text-sm">缺货</span>
              </div>
            )}

            {/* 图片导航 */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* 品牌和分类 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                  {getLocalizedBrandName(product.brand)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t(product.category)}
                </span>
              </div>

              {/* 商品名称 */}
              <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                  {getLocalizedText(product.name)}
                </h3>
              </Link>

              {/* 描述 */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {getLocalizedText(product.description)}
              </p>

              {/* 评分和评论数 */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({product.reviewCount} 评论)
                </span>
              </div>

              {/* 特色标签 */}
              {product.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 价格和操作区域 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(product.originalPrice, product.currency)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm"
                  disabled={!product.inStock}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                    </svg>
                  )}
                  {product.inStock ? '加入购物车' : '缺货'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 网格视图
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* 图片区域 */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[currentImageIndex] || '/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
          }}
        />
        
        {/* 折扣标签 */}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            -{product.discount}%
          </div>
        )}

        {/* 品牌标签 */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
          {getLocalizedBrandName(product.brand)}
        </div>

        {/* 库存状态 */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <span className="text-white font-bold">缺货</span>
          </div>
        )}

        {/* 图片导航 */}
        {product.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4">
        {/* 商品名称 */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
            {getLocalizedText(product.name)}
          </h3>
        </Link>

        {/* 评分和评论数 */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* 特色标签 */}
        {product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* 价格 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

        {/* 操作区域 */}
        <div className="flex items-center gap-2">
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm flex-shrink-0"
            disabled={!product.inStock}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
              </svg>
            )}
            {product.inStock ? '加入购物车' : '缺货'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductCard;
