'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { clothingImages } from '@/lib/placeholderImages';

// 产品分类类型定义
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories?: Category[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
  discount?: number;
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  // 模拟分类数据 - 根据需求文档设计
  const categories: Category[] = [
    {
      id: '1',
      name: '内衣',
      slug: 'underwear',
      description: '舒适贴身的内衣系列',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop',
      productCount: 156,
      subcategories: [
        { id: '1-1', name: '文胸', slug: 'bras', description: '各种款式文胸', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=150&fit=crop', productCount: 89 },
        { id: '1-2', name: '内裤', slug: 'panties', description: '舒适内裤', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=150&fit=crop', productCount: 67 },
      ]
    },
    {
      id: '2',
      name: 'T恤',
      slug: 't-shirts',
      description: '时尚舒适的T恤系列',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop',
      productCount: 234,
      subcategories: [
        { id: '2-1', name: '短袖T恤', slug: 'short-sleeve-tees', description: '经典短袖T恤', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=150&fit=crop', productCount: 145 },
        { id: '2-2', name: '长袖T恤', slug: 'long-sleeve-tees', description: '保暖长袖T恤', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=150&fit=crop', productCount: 89 },
      ]
    },
    {
      id: '3',
      name: '牛仔裤',
      slug: 'jeans',
      description: '经典牛仔裤系列',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=200&fit=crop',
      productCount: 189,
      subcategories: [
        { id: '3-1', name: '直筒牛仔裤', slug: 'straight-jeans', description: '经典直筒版型', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=150&fit=crop', productCount: 98 },
        { id: '3-2', name: '紧身牛仔裤', slug: 'skinny-jeans', description: '修身紧身版型', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=150&fit=crop', productCount: 91 },
      ]
    },
    {
      id: '4',
      name: '裤子',
      slug: 'pants',
      description: '各类休闲与正装裤子',
      image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=300&h=200&fit=crop',
      productCount: 167,
      subcategories: [
        { id: '4-1', name: '休闲裤', slug: 'casual-pants', description: '舒适休闲裤', image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=200&h=150&fit=crop', productCount: 89 },
        { id: '4-2', name: '正装裤', slug: 'dress-pants', description: '商务正装裤', image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=200&h=150&fit=crop', productCount: 78 },
      ]
    },
    {
      id: '5',
      name: '外套',
      slug: 'outerwear',
      description: '时尚保暖外套系列',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=200&fit=crop',
      productCount: 143,
      subcategories: [
        { id: '5-1', name: '夹克', slug: 'jackets', description: '时尚夹克外套', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=150&fit=crop', productCount: 76 },
        { id: '5-2', name: '大衣', slug: 'coats', description: '保暖大衣', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=150&fit=crop', productCount: 67 },
      ]
    },
    {
      id: '6',
      name: '鞋子',
      slug: 'shoes',
      description: '舒适时尚鞋履系列',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
      productCount: 198,
      subcategories: [
        { id: '6-1', name: '运动鞋', slug: 'sneakers', description: '舒适运动鞋', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=150&fit=crop', productCount: 112 },
        { id: '6-2', name: '休闲鞋', slug: 'casual-shoes', description: '日常休闲鞋', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=150&fit=crop', productCount: 86 },
      ]
    },
  ];

  // 模拟产品数据 - 根据需求文档分类
  const products: Product[] = [
    {
      id: '1',
      name: '无钢圈舒适文胸',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=250&h=300&fit=crop',
      rating: 4.8,
      reviews: 234,
      category: 'underwear',
      tags: ['舒适', '无钢圈', '透气'],
      isNew: true,
      discount: 31
    },
    {
      id: '2',
      name: '经典白色T恤',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=250&h=300&fit=crop',
      rating: 4.6,
      reviews: 456,
      category: 't-shirts',
      tags: ['经典', '百搭', '纯棉'],
      isHot: true,
      discount: 25
    },
    {
      id: '3',
      name: '修身牛仔裤',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=250&h=300&fit=crop',
      rating: 4.7,
      reviews: 328,
      category: 'jeans',
      tags: ['修身', '弹性', '时尚'],
      discount: 20
    },
    {
      id: '4',
      name: '商务休闲裤',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1506629905607-d405b7a30db9?w=250&h=300&fit=crop',
      rating: 4.5,
      reviews: 189,
      category: 'pants',
      tags: ['商务', '休闲', '舒适'],
      isNew: true
    },
    {
      id: '5',
      name: '时尚夹克外套',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=250&h=300&fit=crop',
      rating: 4.8,
      reviews: 267,
      category: 'outerwear',
      tags: ['时尚', '保暖', '防风'],
      isHot: true,
      discount: 20
    },
    {
      id: '6',
      name: '舒适运动鞋',
      price: 119.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=250&h=300&fit=crop',
      rating: 4.9,
      reviews: 512,
      category: 'shoes',
      tags: ['运动', '舒适', '透气'],
      discount: 20
    },
    {
      id: '7',
      name: '蕾丝边内裤套装',
      price: 45.99,
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=250&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      category: 'underwear',
      tags: ['蕾丝', '套装', '性感'],
      isHot: true
    },
    {
      id: '8',
      name: '印花长袖T恤',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=250&h=300&fit=crop',
      rating: 4.4,
      reviews: 203,
      category: 't-shirts',
      tags: ['印花', '长袖', '时尚'],
      isNew: true
    },
  ];

  const sortOptions = [
    { value: 'default', label: '默认排序' },
    { value: 'price-low', label: '价格从低到高' },
    { value: 'price-high', label: '价格从高到低' },
    { value: 'rating', label: '评分最高' },
    { value: 'newest', label: '最新上架' },
    { value: 'popular', label: '最受欢迎' },
  ];

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return a.isNew ? -1 : 1;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">产品分类</h1>
          <p className="mt-2 text-gray-600">探索我们精心挑选的服装系列</p>
        </div>

        {/* 分类网格 */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-medium">${category.name}</div>`;
                      }
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.productCount} 件商品</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 筛选和排序栏 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                筛选
              </button>
              
              <div className="hidden lg:flex items-center gap-4">
                <span className="text-sm text-gray-600">分类:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全部分类</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">排序:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <span className="text-sm text-gray-500">
                共 {sortedProducts.length} 件商品
              </span>
            </div>
          </div>

          {/* 移动端筛选面板 */}
          {showFilters && (
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全部分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 产品网格 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/250x300/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                
                {/* 标签 */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                      新品
                    </span>
                  )}
                  {product.isHot && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      热销
                    </span>
                  )}
                  {product.discount && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* 悬停操作 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">¥{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">¥{product.originalPrice}</span>
                    )}
                  </div>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    加入购物车
                  </button>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 分页 */}
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              上一页
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
              1
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
