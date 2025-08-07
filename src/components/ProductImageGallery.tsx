'use client';

import { useState } from 'react';
import { Product } from '@/types';
import ProductImage from './ProductImage';

interface ProductImageGalleryProps {
  product: Product;
  selectedColor?: string;
}

const ProductImageGallery = ({ product, selectedColor }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // 生成多个角度的图片（模拟）
  const generateProductImages = () => {
    const angles = ['正面', '背面', '侧面', '细节'];
    return angles.map((angle, index) => ({
      id: `${product.id}-${index}`,
      angle,
      isMain: index === 0
    }));
  };

  const productImages = generateProductImages();

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* 主图显示区域 */}
      <div className="relative bg-white rounded-lg overflow-hidden shadow-lg">
        <div 
          className={`relative ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={handleZoomToggle}
        >
          <ProductImage
            category={product.category}
            productName={`${product.name} - ${productImages[currentImageIndex].angle}`}
            productId={`${product.id}-${currentImageIndex}`}
            className={`w-full transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
          />
          
          {/* 图片导航箭头 */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* 图片指示器 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>

          {/* 缩放提示 */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {isZoomed ? '点击缩小' : '点击放大'}
          </div>
        </div>
      </div>

      {/* 缩略图列表 */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {productImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageClick(index)}
              className={`relative bg-white rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ProductImage
                category={product.category}
                productName={`${product.name} - ${image.angle}`}
                productId={`${product.id}-${index}`}
                className="w-full aspect-square"
              />
              
              {/* 角度标签 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                {image.angle}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
