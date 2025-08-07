'use client';

import { useState } from 'react';
import { Product } from '@/types';
import Header from './Header';
import Footer from './Footer';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.color || '');
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <Header />

      {/* 面包屑导航 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">首页</a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-gray-700">产品</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 左侧：产品图片 */}
          <div>
            <ProductImageGallery 
              product={product}
              selectedColor={selectedColor}
            />
          </div>

          {/* 右侧：产品信息 */}
          <div>
            <ProductInfo 
              product={product}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              quantity={quantity}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onQuantityChange={setQuantity}
            />
          </div>
        </div>

        {/* 产品详细信息标签页 */}
        <div className="mb-12">
          <ProductTabs product={product} />
        </div>

        {/* 相关产品推荐 */}
        <div>
          <RelatedProducts currentProduct={product} />
        </div>
      </div>

      {/* 页脚 */}
      <Footer />
    </div>
  );
};

export default ProductDetailView;
