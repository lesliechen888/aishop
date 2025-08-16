'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import EnhancedProductFilters from '@/components/EnhancedProductFilters';
import EnhancedProductCard from '@/components/EnhancedProductCard';
import { useLocalization } from '@/contexts/LocalizationContext';
import { DatabaseProduct } from '@/lib/productDatabase';

const ProductsPage = () => {
  const { t } = useLocalization();

  // 状态管理
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 筛选和排序状态
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const PRODUCTS_PER_PAGE = 12;

  // 获取产品数据
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: PRODUCTS_PER_PAGE.toString(),
        sort: sortBy
      });

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPriceRange !== 'all') params.append('priceRange', selectedPriceRange);
      if (selectedRating > 0) params.append('rating', selectedRating.toString());
      if (selectedFeatures.length > 0) params.append('features', selectedFeatures.join(','));
      if (selectedBrand !== 'all') params.append('brand', selectedBrand);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/products?${params}`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data.products);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        setError(result.error || '获取产品失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 当筛选条件或排序改变时重新获取数据
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedPriceRange, selectedRating, selectedFeatures, selectedBrand, searchQuery, sortBy, currentPage]);

  // 添加到购物车
  const handleAddToCart = async (productId: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const result = await response.json();

      if (result.success) {
        // 显示成功消息
        alert('商品已添加到购物车！');
      } else {
        alert(result.error || '添加失败');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('添加失败，请稍后重试');
    }
  };

  // 当筛选条件改变时重置到第一页
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    setCurrentPage(1);
  };

  const handleFeaturesChange = (features: string[]) => {
    setSelectedFeatures(features);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-8">
        {/* 页面标题 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {t('products.pageTitle')}
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                {t('products.pageSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏筛选器 */}
            <div className="lg:w-1/4">
              <EnhancedProductFilters
                selectedCategory={selectedCategory}
                selectedPriceRange={selectedPriceRange}
                selectedRating={selectedRating}
                selectedFeatures={selectedFeatures}
                selectedBrand={selectedBrand}
                searchQuery={searchQuery}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onRatingChange={handleRatingChange}
                onFeaturesChange={handleFeaturesChange}
                onBrandChange={handleBrandChange}
                onSearchChange={handleSearchChange}
              />
            </div>

            {/* 产品列表区域 */}
            <div className="lg:w-3/4">
              {/* 工具栏 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="text-gray-600 dark:text-gray-300">
                  显示 {products.length} 个商品，共 {total} 个结果
                </div>
                
                <div className="flex items-center gap-4">
                  {/* 排序选择器 */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="featured">{t('products.sort.featured')}</option>
                    <option value="newest">{t('products.sort.newest')}</option>
                    <option value="price-low">{t('products.sort.priceLow')}</option>
                    <option value="price-high">{t('products.sort.priceHigh')}</option>
                    <option value="rating">{t('products.sort.rating')}</option>
                  </select>

                  {/* 视图模式切换 */}
                  <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 加载状态 */}
              {loading && (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">加载中...</span>
                </div>
              )}

              {/* 错误状态 */}
              {error && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">❌</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    加载失败
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {error}
                  </p>
                  <button
                    onClick={fetchProducts}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    重试
                  </button>
                </div>
              )}

              {/* 产品网格/列表 */}
              {!loading && !error && products.length > 0 && (
                <div className={
                  viewMode === 'grid'
                    ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-6'
                }>
                  {products.map((product) => (
                    <EnhancedProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

              {/* 无结果状态 */}
              {!loading && !error && products.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('products.noResults.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {t('products.noResults.description')}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedPriceRange('all');
                      setSelectedRating(0);
                      setSelectedFeatures([]);
                      setSelectedBrand('all');
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    清除筛选条件
                  </button>
                </div>
              )}

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2">
                    {/* 上一页按钮 */}
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('products.pagination.previous')}
                    </button>

                    {/* 页码按钮 */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* 下一页按钮 */}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('products.pagination.next')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
