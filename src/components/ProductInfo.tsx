'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductInfoProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onQuantityChange: (quantity: number) => void;
}

const ProductInfo = ({
  product,
  selectedSize,
  selectedColor,
  quantity,
  onSizeChange,
  onColorChange,
  onQuantityChange
}: ProductInfoProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  // 模拟尺码数据
  const availableSizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
  
  // 模拟颜色数据
  const availableColors = [
    { name: '黑色', value: 'black', hex: '#000000' },
    { name: '白色', value: 'white', hex: '#FFFFFF' },
    { name: '红色', value: 'red', hex: '#DC2626' },
    { name: '蓝色', value: 'blue', hex: '#2563EB' },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('请选择尺码');
      return;
    }

    // 添加到购物车
    addToCart(product, quantity, selectedSize, selectedColor);
    alert('已添加到购物车！');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('请选择尺码');
      return;
    }

    // 添加到购物车并跳转到结算页面
    addToCart(product, quantity, selectedSize, selectedColor);
    router.push('/checkout');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* 产品标题和评分 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviewCount} 评价)
          </span>
        </div>
      </div>

      {/* 价格信息 */}
      <div className="flex items-center space-x-4">
        <span className="text-3xl font-bold text-red-600">
          {product.currency}{product.price.toFixed(2)}
        </span>
        {product.originalPrice && product.originalPrice > product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">
              {product.currency}{product.originalPrice.toFixed(2)}
            </span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              省 {product.currency}{(product.originalPrice - product.price).toFixed(2)}
            </span>
          </>
        )}
      </div>

      {/* 产品描述 */}
      <div>
        <p className="text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {/* 颜色选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">颜色</h3>
        <div className="flex space-x-3">
          {availableColors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                selectedColor === color.value
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {selectedColor === color.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 尺码选择 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">尺码</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            尺码指南
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`py-3 px-4 border rounded-lg text-center font-medium transition-all ${
                selectedSize === size
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 数量选择 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">数量</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <span className="w-16 text-center font-medium">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            加入购物车
          </button>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 border rounded-lg transition-colors ${
              isFavorite
                ? 'border-red-500 text-red-500 bg-red-50'
                : 'border-gray-300 text-gray-600 hover:border-gray-400'
            }`}
          >
            <svg className="w-6 h-6" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        
        <button
          onClick={handleBuyNow}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          立即购买
        </button>
      </div>

      {/* 库存状态 */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className={`text-sm font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
          {product.inStock ? '现货供应' : '暂时缺货'}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
