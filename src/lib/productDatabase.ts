// 产品数据库管理
import { Product } from '@/types';

// 多语言文本接口
export interface MultiLanguageText {
  en: string;
  zh: string;
  es: string;
  fr: string;
  de: string;
  ja: string;
}

// 数据库产品接口
export interface DatabaseProduct {
  id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string; // 保持为key，用于翻译
  tags: string[];
  inStock: boolean;
  discount?: number;
  brand: string;
  material: string;
  colors: string[];
  sizes: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
}

// 筛选参数接口
export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  features?: string[];
  brand?: string;
  inStock?: boolean;
  search?: string;
}

// 排序选项
export type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';

// 分页参数
export interface PaginationParams {
  page: number;
  limit: number;
}

// 查询结果
export interface ProductQueryResult {
  products: DatabaseProduct[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 内存数据库（实际项目中应该使用真实数据库）
let productDatabase: DatabaseProduct[] = [];
let nextId = 1;

// 重置数据库（用于开发测试）
export function resetDatabase() {
  productDatabase = [];
  nextId = 1;
}

// 初始化示例数据
function initializeDatabase() {
  if (productDatabase.length > 0) return;

  const categories = ['categories.bras', 'categories.underwear', 'categories.sleepwear', 'categories.activewear', 'categories.swimwear', 'categories.accessories'];
  const brands = ['Victoria\'s Secret', 'Calvin Klein', 'Tommy Hilfiger', 'La Perla', 'Agent Provocateur', 'Intimissimi', 'Triumph', 'Wacoal'];
  const materials = ['Cotton', 'Silk', 'Lace', 'Satin', 'Modal', 'Bamboo', 'Microfiber', 'Nylon'];
  const colors = ['Black', 'White', 'Nude', 'Pink', 'Red', 'Blue', 'Navy', 'Gray', 'Beige', 'Purple'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const features = ['新品上市', '热销商品', '限时特价', '高端系列', '舒适透气', '抗菌防臭'];

  // 品牌名称本地化
  const getBrandNameZh = (brand: string): string => {
    const map: Record<string, string> = {
      'Victoria\'s Secret': '维多利亚的秘密',
      'Calvin Klein': '卡尔文·克莱恩',
      'Tommy Hilfiger': '汤米·希尔费格',
      'La Perla': '拉佩拉',
      'Agent Provocateur': '特工挑逗者',
      'Intimissimi': '意趣',
      'Triumph': '黛安芬',
      'Wacoal': '华歌尔'
    };
    return map[brand] || brand;
  };

  const getBrandNameEs = (brand: string): string => {
    const map: Record<string, string> = {
      'Victoria\'s Secret': 'Victoria\'s Secret',
      'Calvin Klein': 'Calvin Klein',
      'Tommy Hilfiger': 'Tommy Hilfiger',
      'La Perla': 'La Perla',
      'Agent Provocateur': 'Agent Provocateur',
      'Intimissimi': 'Intimissimi',
      'Triumph': 'Triumph',
      'Wacoal': 'Wacoal'
    };
    return map[brand] || brand;
  };

  const getBrandNameFr = (brand: string): string => {
    const map: Record<string, string> = {
      'Victoria\'s Secret': 'Victoria\'s Secret',
      'Calvin Klein': 'Calvin Klein',
      'Tommy Hilfiger': 'Tommy Hilfiger',
      'La Perla': 'La Perla',
      'Agent Provocateur': 'Agent Provocateur',
      'Intimissimi': 'Intimissimi',
      'Triumph': 'Triumph',
      'Wacoal': 'Wacoal'
    };
    return map[brand] || brand;
  };

  const getBrandNameDe = (brand: string): string => {
    const map: Record<string, string> = {
      'Victoria\'s Secret': 'Victoria\'s Secret',
      'Calvin Klein': 'Calvin Klein',
      'Tommy Hilfiger': 'Tommy Hilfiger',
      'La Perla': 'La Perla',
      'Agent Provocateur': 'Agent Provocateur',
      'Intimissimi': 'Intimissimi',
      'Triumph': 'Triumph',
      'Wacoal': 'Wacoal'
    };
    return map[brand] || brand;
  };

  const getBrandNameJa = (brand: string): string => {
    const map: Record<string, string> = {
      'Victoria\'s Secret': 'ヴィクトリアズ・シークレット',
      'Calvin Klein': 'カルバン・クライン',
      'Tommy Hilfiger': 'トミー・ヒルフィガー',
      'La Perla': 'ラ・ペルラ',
      'Agent Provocateur': 'エージェント・プロヴォカトゥール',
      'Intimissimi': 'インティミッシミ',
      'Triumph': 'トリンプ',
      'Wacoal': 'ワコール'
    };
    return map[brand] || brand;
  };

  const getMaterialNameZh = (material: string): string => {
    const map: Record<string, string> = {
      'Cotton': '棉质',
      'Silk': '真丝',
      'Lace': '蕾丝',
      'Satin': '缎面',
      'Modal': '莫代尔',
      'Bamboo': '竹纤维',
      'Microfiber': '超细纤维',
      'Nylon': '尼龙'
    };
    return map[material] || material;
  };

  // 生成多语言商品名称和描述的函数
  const generateMultiLanguageName = (brand: string, material: string, categoryKey: string, id: number): MultiLanguageText => {
    const categoryName = categoryKey.split('.')[1];
    return {
      en: `${brand} ${material} ${categoryName} ${id}`,
      zh: `${getBrandNameZh(brand)} ${getMaterialNameZh(material)}${getCategoryNameZh(categoryName)} ${id}`,
      es: `${getBrandNameEs(brand)} ${material} ${getCategoryNameEs(categoryName)} ${id}`,
      fr: `${getBrandNameFr(brand)} ${material} ${getCategoryNameFr(categoryName)} ${id}`,
      de: `${getBrandNameDe(brand)} ${material} ${getCategoryNameDe(categoryName)} ${id}`,
      ja: `${getBrandNameJa(brand)} ${material}${getCategoryNameJa(categoryName)} ${id}`
    };
  };

  const generateMultiLanguageDescription = (material: string, categoryKey: string): MultiLanguageText => {
    const categoryName = categoryKey.split('.')[1];
    return {
      en: `High-quality ${material.toLowerCase()} ${categoryName.toLowerCase()} with superior comfort and breathable design.`,
      zh: `高品质${getMaterialNameZh(material)}材质制作的${getCategoryNameZh(categoryName)}，舒适透气，时尚设计。`,
      es: `${getCategoryNameEs(categoryName)} de ${material.toLowerCase()} de alta calidad con comodidad superior y diseño transpirable.`,
      fr: `${getCategoryNameFr(categoryName)} en ${material.toLowerCase()} de haute qualité avec un confort supérieur et un design respirant.`,
      de: `Hochwertige ${getCategoryNameDe(categoryName)} aus ${material} mit überlegenem Komfort und atmungsaktivem Design.`,
      ja: `優れた快適性と通気性のあるデザインを備えた高品質の${material}${getCategoryNameJa(categoryName)}。`
    };
  };

  // 分类名称翻译辅助函数
  const getCategoryNameZh = (categoryName: string): string => {
    const map: Record<string, string> = {
      'bras': '文胸',
      'underwear': '内裤',
      'sleepwear': '睡衣',
      'activewear': '运动内衣',
      'swimwear': '泳装',
      'accessories': '配饰'
    };
    return map[categoryName] || categoryName;
  };

  const getCategoryNameEs = (categoryName: string): string => {
    const map: Record<string, string> = {
      'bras': 'Sujetadores',
      'underwear': 'Ropa Interior',
      'sleepwear': 'Ropa de Dormir',
      'activewear': 'Ropa Deportiva',
      'swimwear': 'Trajes de Baño',
      'accessories': 'Accesorios'
    };
    return map[categoryName] || categoryName;
  };

  const getCategoryNameFr = (categoryName: string): string => {
    const map: Record<string, string> = {
      'bras': 'Soutiens-gorge',
      'underwear': 'Sous-vêtements',
      'sleepwear': 'Vêtements de Nuit',
      'activewear': 'Vêtements de Sport',
      'swimwear': 'Maillots de Bain',
      'accessories': 'Accessoires'
    };
    return map[categoryName] || categoryName;
  };

  const getCategoryNameDe = (categoryName: string): string => {
    const map: Record<string, string> = {
      'bras': 'BHs',
      'underwear': 'Unterwäsche',
      'sleepwear': 'Nachtwäsche',
      'activewear': 'Sportbekleidung',
      'swimwear': 'Bademode',
      'accessories': 'Accessoires'
    };
    return map[categoryName] || categoryName;
  };

  const getCategoryNameJa = (categoryName: string): string => {
    const map: Record<string, string> = {
      'bras': 'ブラジャー',
      'underwear': '下着',
      'sleepwear': 'ナイトウェア',
      'activewear': 'スポーツウェア',
      'swimwear': '水着',
      'accessories': 'アクセサリー'
    };
    return map[categoryName] || categoryName;
  };

  // 生成100个示例产品
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    const basePrice = Math.floor(Math.random() * 200) + 20;
    const hasDiscount = Math.random() > 0.7;
    const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0;
    const originalPrice = hasDiscount ? Math.floor(basePrice / (1 - discount / 100)) : undefined;

    productDatabase.push({
      id: i.toString(),
      name: generateMultiLanguageName(brand, material, category, i),
      description: generateMultiLanguageDescription(material, category),
      price: basePrice,
      originalPrice,
      currency: 'USD',
      images: [
        `https://picsum.photos/400/400?random=${i}`,
        `https://picsum.photos/400/400?random=${i + 100}`,
        `https://picsum.photos/400/400?random=${i + 200}`
      ],
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
      reviewCount: Math.floor(Math.random() * 500) + 10,
      category,
      tags: [material.toLowerCase(), category.split('.')[1]],
      inStock: Math.random() > 0.1, // 90% 有库存
      discount,
      brand,
      material,
      colors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      sizes: sizes.slice(0, Math.floor(Math.random() * 4) + 2),
      features: features.slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  nextId = productDatabase.length + 1;
}

// 查询产品
export async function queryProducts(
  filters: ProductFilters = {},
  sort: SortOption = 'featured',
  pagination: PaginationParams = { page: 1, limit: 12 }
): Promise<ProductQueryResult> {
  initializeDatabase();

  let filtered = [...productDatabase];

  // 应用筛选条件
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  if (filters.priceMin !== undefined) {
    filtered = filtered.filter(p => p.price >= filters.priceMin!);
  }

  if (filters.priceMax !== undefined) {
    filtered = filtered.filter(p => p.price <= filters.priceMax!);
  }

  if (filters.rating && filters.rating > 0) {
    filtered = filtered.filter(p => p.rating >= filters.rating!);
  }

  if (filters.features && filters.features.length > 0) {
    filtered = filtered.filter(p => 
      filters.features!.some(feature => p.features.includes(feature))
    );
  }

  if (filters.brand) {
    filtered = filtered.filter(p => p.brand === filters.brand);
  }

  if (filters.inStock !== undefined) {
    filtered = filtered.filter(p => p.inStock === filters.inStock);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // 应用排序
  switch (sort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'featured':
    default:
      // 推荐排序：综合评分、销量、新品等因素
      filtered.sort((a, b) => {
        const scoreA = a.rating * 0.4 + (a.reviewCount / 100) * 0.3 + (a.discount || 0) * 0.3;
        const scoreB = b.rating * 0.4 + (b.reviewCount / 100) * 0.3 + (b.discount || 0) * 0.3;
        return scoreB - scoreA;
      });
      break;
  }

  // 应用分页
  const total = filtered.length;
  const totalPages = Math.ceil(total / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedProducts = filtered.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    total,
    page: pagination.page,
    totalPages,
    hasNext: pagination.page < totalPages,
    hasPrev: pagination.page > 1
  };
}

// 根据ID获取产品
export async function getProductById(id: string): Promise<DatabaseProduct | null> {
  initializeDatabase();
  return productDatabase.find(p => p.id === id) || null;
}

// 获取分类列表
export async function getCategories(): Promise<{ id: string; name: string; count: number }[]> {
  initializeDatabase();
  const categoryCount: Record<string, number> = {};
  
  productDatabase.forEach(product => {
    categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
  });

  return Object.entries(categoryCount).map(([category, count]) => ({
    id: category,
    name: category,
    count
  }));
}

// 获取品牌列表
export async function getBrands(): Promise<{ id: string; name: string; count: number }[]> {
  initializeDatabase();
  const brandCount: Record<string, number> = {};
  
  productDatabase.forEach(product => {
    brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
  });

  return Object.entries(brandCount).map(([brand, count]) => ({
    id: brand,
    name: brand,
    count
  }));
}

// 获取特色标签
export async function getFeatures(): Promise<string[]> {
  initializeDatabase();
  const allFeatures = new Set<string>();
  
  productDatabase.forEach(product => {
    product.features.forEach(feature => allFeatures.add(feature));
  });

  return Array.from(allFeatures);
}

// 添加产品到购物车（模拟）
export async function addToCart(productId: string, quantity: number = 1): Promise<boolean> {
  const product = await getProductById(productId);
  if (!product || !product.inStock) {
    return false;
  }

  // 这里应该实现真实的购物车逻辑
  console.log(`Added ${quantity} of product ${productId} to cart`);
  return true;
}

// 搜索建议
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  initializeDatabase();
  
  if (!query || query.length < 2) return [];

  const suggestions = new Set<string>();
  const queryLower = query.toLowerCase();

  productDatabase.forEach(product => {
    if (suggestions.size >= limit) return;
    
    if (product.name.toLowerCase().includes(queryLower)) {
      suggestions.add(product.name);
    }
    if (product.brand.toLowerCase().includes(queryLower)) {
      suggestions.add(product.brand);
    }
  });

  return Array.from(suggestions).slice(0, limit);
}
