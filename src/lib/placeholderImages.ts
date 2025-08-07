// 生成占位符图片的工具函数

export const generatePlaceholderSVG = (
  width: number,
  height: number,
  text: string,
  bgColor: string = '#f3f4f6',
  textColor: string = '#9ca3af'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;

  // 使用 encodeURIComponent 而不是 btoa 来处理中文字符
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const generateCategoryPlaceholder = (categoryName: string): string => {
  const categoryMap = {
    '内衣': 'Underwear',
    '睡衣': 'Sleepwear',
    '运动内衣': 'Sports Bra',
    '泳装': 'Swimwear',
    '塑身衣': 'Shapewear',
    '配饰': 'Accessories',
  };

  const colors = {
    '内衣': { bg: '#fef3f2', text: '#dc2626' },
    '睡衣': { bg: '#f0f9ff', text: '#0284c7' },
    '运动内衣': { bg: '#f0fdf4', text: '#16a34a' },
    '泳装': { bg: '#fefce8', text: '#ca8a04' },
    '塑身衣': { bg: '#faf5ff', text: '#9333ea' },
    '配饰': { bg: '#fff7ed', text: '#ea580c' },
  };

  const englishName = categoryMap[categoryName as keyof typeof categoryMap] || categoryName;
  const color = colors[categoryName as keyof typeof colors] || { bg: '#f3f4f6', text: '#9ca3af' };
  return generatePlaceholderSVG(300, 200, englishName, color.bg, color.text);
};

export const generateProductPlaceholder = (productName: string): string => {
  // 使用英文占位符文本避免编码问题
  return generatePlaceholderSVG(250, 300, 'Product Image', '#f8fafc', '#64748b');
};

// 预定义的图片URL，如果外部图片加载失败可以使用
export const fallbackImages = {
  categories: {
    underwear: generateCategoryPlaceholder('内衣'),
    sleepwear: generateCategoryPlaceholder('睡衣'),
    'sports-bras': generateCategoryPlaceholder('运动内衣'),
    swimwear: generateCategoryPlaceholder('泳装'),
    shapewear: generateCategoryPlaceholder('塑身衣'),
    accessories: generateCategoryPlaceholder('配饰'),
  },
  products: {
    default: generateProductPlaceholder('Product'),
  }
};

// 服装相关的Unsplash图片集合
export const clothingImages = {
  categories: {
    underwear: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1571513722275-4b8c2e0f2f8b?w=300&h=200&fit=crop',
    ],
    sleepwear: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop',
    ],
    'sports-bras': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=300&h=200&fit=crop',
    ],
    swimwear: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
    ],
    shapewear: [
      'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop',
    ],
    accessories: [
      'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop',
    ],
  },
  products: {
    clothing: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=250&h=300&fit=crop',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=250&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=250&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=250&h=300&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=250&h=300&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=250&h=300&fit=crop',
    ]
  }
};

// 获取随机图片
export const getRandomImage = (category: keyof typeof clothingImages): string => {
  const images = clothingImages[category];
  if (!images || images.length === 0) {
    return fallbackImages.products.default;
  }
  
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex] || fallbackImages.products.default;
};
