'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface FilterOptions {
  categories: { id: string; name: string; count: number }[];
  brands: { id: string; name: string; count: number }[];
  priceRanges: { id: string; name: string; min: number; max: number | null }[];
  ratingOptions: { id: number; name: string; value: number }[];
  features: string[];
}

interface EnhancedProductFiltersProps {
  selectedCategory: string;
  selectedPriceRange: string;
  selectedRating: number;
  selectedFeatures: string[];
  selectedBrand: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
  onRatingChange: (rating: number) => void;
  onFeaturesChange: (features: string[]) => void;
  onBrandChange: (brand: string) => void;
  onSearchChange: (query: string) => void;
}

const EnhancedProductFilters = ({
  selectedCategory,
  selectedPriceRange,
  selectedRating,
  selectedFeatures,
  selectedBrand,
  searchQuery,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onFeaturesChange,
  onBrandChange,
  onSearchChange,
}: EnhancedProductFiltersProps) => {
  const { t } = useLocalization();
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取筛选选项
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/products/filters');
        const result = await response.json();
        
        if (result.success) {
          setFilterOptions(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter(f => f !== feature)
      : [...selectedFeatures, feature];
    onFeaturesChange(newFeatures);
  };

  // 获取分类的本地化名称
  const getCategoryDisplayName = (categoryId: string): string => {
    if (categoryId === 'all') {
      return t('categories.all') || '全部分类';
    }
    return t(categoryId) || categoryId;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!filterOptions) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        <p className="text-gray-500">加载筛选选项失败</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-8">
      {/* 标题区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          商品筛选
        </h3>
      </div>

      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* 搜索框 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索商品
          </h4>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="输入商品名称、品牌或关键词..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 分类筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
            </svg>
            商品分类
          </h4>
          <div className="space-y-1">
            {filterOptions.categories.map((category) => (
              <label key={category.id} className="flex items-center justify-between cursor-pointer group p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {getCategoryDisplayName(category.id)}
                  </span>
                </div>

              </label>
            ))}
          </div>
        </div>

        {/* 品牌筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            品牌
          </h4>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {filterOptions.brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* 价格筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            价格区间
          </h4>
          <div className="space-y-1">
            {filterOptions.priceRanges.map((range) => (
              <label key={range.id} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.id}
                  checked={selectedPriceRange === range.id}
                  onChange={(e) => onPriceRangeChange(e.target.value)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {range.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 评分筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            客户评分
          </h4>
          <div className="space-y-1">
            {filterOptions.ratingOptions.map((option) => (
              <label key={option.id} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all duration-200">
                <input
                  type="radio"
                  name="rating"
                  value={option.value}
                  checked={selectedRating === option.value}
                  onChange={(e) => onRatingChange(Number(e.target.value))}
                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                />
                <div className="ml-3 flex items-center gap-2">
                  {option.value > 0 && (
                    <div className="flex">
                      {renderStars(option.value)}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 特色筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            特色标签
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {filterOptions.features.map((feature) => (
              <label key={feature} className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-pink-50 dark:hover:bg-gray-700 transition-all duration-200">
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 清除筛选按钮 */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              onCategoryChange('all');
              onPriceRangeChange('all');
              onRatingChange(0);
              onFeaturesChange([]);
              onBrandChange('all');
              onSearchChange('');
            }}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            清除所有筛选
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedProductFilters;
