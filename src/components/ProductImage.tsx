'use client';

import { useState, useEffect, useRef } from 'react';

interface ProductImageProps {
  category: string;
  productName: string;
  productId: string;
  className?: string;
}

const ProductImage = ({ category, productName, productId, className = '' }: ProductImageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  // 生成Canvas图片
  useEffect(() => {
    const generateImage = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      if (!ctx) return '';

      // 分类信息
      const categoryInfo = {
        'categories.bras': { color: '#FF69B4', label: '文胸', icon: '👙' },
        'categories.underwear': { color: '#DDA0DD', label: '内衣', icon: '🩲' },
        'categories.sleepwear': { color: '#87CEEB', label: '睡衣', icon: '🥱' },
        'categories.activewear': { color: '#98FB98', label: '运动装', icon: '🏃‍♀️' },
        'categories.swimwear': { color: '#00CED1', label: '泳装', icon: '🏊‍♀️' },
        'categories.accessories': { color: '#FFD700', label: '配饰', icon: '💍' },
      };

      const info = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo['categories.bras'];

      // 创建渐变背景
      const gradient = ctx.createLinearGradient(0, 0, 400, 400);
      gradient.addColorStop(0, info.color);
      gradient.addColorStop(1, info.color + '88');

      // 绘制背景
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 400);

      // 绘制圆形背景
      ctx.beginPath();
      ctx.arc(200, 150, 60, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();

      // 绘制图标
      ctx.font = '48px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(info.icon, 200, 170);

      // 绘制分类标签
      ctx.font = 'bold 24px Arial';
      ctx.fillText(info.label, 200, 220);

      // 绘制产品ID
      ctx.font = '18px Arial';
      ctx.fillText(`产品 #${productId}`, 200, 250);

      // 绘制产品名称
      ctx.font = '14px Arial';
      ctx.globalAlpha = 0.8;
      ctx.fillText(productName.substring(0, 20), 200, 320);

      return canvas.toDataURL();
    };

    const url = generateImage();
    setImageUrl(url);
  }, [category, productId, productName]);

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">加载中...</span>
        </div>
      )}

      {/* 悬停遮罩效果 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

      {/* 光泽效果 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-all duration-700" />
    </div>
  );
};

export default ProductImage;
