'use client';

import { useLocalization } from '@/contexts/LocalizationContext';

interface ProductFiltersProps {
  selectedCategory: string;
  selectedPriceRange: string;
  selectedRating: number;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (range: string) => void;
  onRatingChange: (rating: number) => void;
}

const ProductFilters = ({
  selectedCategory,
  selectedPriceRange,
  selectedRating,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
}: ProductFiltersProps) => {
  const { t } = useLocalization();

  const categories = [
    { id: 'all', name: t('categories.all') },
    { id: 'categories.underwear', name: t('categories.underwear') },
    { id: 'categories.bras', name: t('categories.bras') },
    { id: 'categories.sleepwear', name: t('categories.sleepwear') },
    { id: 'categories.activewear', name: t('categories.activewear') },
    { id: 'categories.swimwear', name: t('categories.swimwear') },
    { id: 'categories.accessories', name: t('categories.accessories') },
  ];

  const priceRanges = [
    { id: 'all', name: t('filters.price.all') },
    { id: '0-25', name: t('filters.price.under25') },
    { id: '25-50', name: t('filters.price.25to50') },
    { id: '50-100', name: t('filters.price.50to100') },
    { id: '100-200', name: t('filters.price.100to200') },
    { id: '200', name: t('filters.price.over200') },
  ];

  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => interactive && onRatingChange(i === selectedRating ? 0 : i)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          disabled={!interactive}
        >
          <svg 
            className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-8">
      {/* 标题区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {t('filters.title')}
        </h3>
      </div>

      <div className="p-6">
        {/* 分类筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
            </svg>
            {t('filters.category')}
          </h4>
          <div className="space-y-1">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 relative">
                {/* 自定义单选框 */}
                <div className="relative">
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-500 shadow-lg shadow-blue-500/30'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                  }`}>
                    {selectedCategory === category.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200" />
                    )}
                  </div>
                </div>

                <span className={`ml-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}>
                  {category.name}
                </span>

                {/* 选中状态的背景指示器 */}
                {selectedCategory === category.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 价格筛选 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {t('filters.price.title')}
          </h4>
          <div className="space-y-1">
            {priceRanges.map((range) => (
              <label key={range.id} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-200 relative">
                {/* 自定义单选框 */}
                <div className="relative">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={selectedPriceRange === range.id}
                    onChange={(e) => onPriceRangeChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedPriceRange === range.id
                      ? 'border-green-500 bg-green-500 shadow-lg shadow-green-500/30'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-green-400'
                  }`}>
                    {selectedPriceRange === range.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200" />
                    )}
                  </div>
                </div>

                <span className={`ml-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedPriceRange === range.id
                    ? 'text-green-600 dark:text-green-400 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400'
                }`}>
                  {range.name}
                </span>

                {/* 选中状态的背景指示器 */}
                {selectedPriceRange === range.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full" />
                )}
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
            {t('filters.rating.title')}
          </h4>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all duration-200 relative">
                {/* 自定义单选框 */}
                <div className="relative">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={selectedRating === rating}
                    onChange={(e) => onRatingChange(Number(e.target.value))}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    selectedRating === rating
                      ? 'border-yellow-500 bg-yellow-500 shadow-lg shadow-yellow-500/30'
                      : 'border-gray-300 dark:border-gray-600 group-hover:border-yellow-400'
                  }`}>
                    {selectedRating === rating && (
                      <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200" />
                    )}
                  </div>
                </div>

                <div className="ml-3 flex items-center gap-2">
                  <div className="flex">
                    {renderStars(rating)}
                  </div>
                  <span className={`text-sm font-medium whitespace-nowrap ${
                    selectedRating === rating
                      ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {t('filters.rating.andUp')}
                  </span>
                </div>

                {/* 选中状态的背景指示器 */}
                {selectedRating === rating && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-r-full" />
                )}
              </label>
            ))}
            <label className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-yellow-50 dark:hover:bg-gray-700 transition-all duration-200 relative">
              {/* 自定义单选框 */}
              <div className="relative">
                <input
                  type="radio"
                  name="rating"
                  value={0}
                  checked={selectedRating === 0}
                  onChange={(e) => onRatingChange(Number(e.target.value))}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                  selectedRating === 0
                    ? 'border-yellow-500 bg-yellow-500 shadow-lg shadow-yellow-500/30'
                    : 'border-gray-300 dark:border-gray-600 group-hover:border-yellow-400'
                }`}>
                  {selectedRating === 0 && (
                    <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200" />
                  )}
                </div>
              </div>

              <span className={`ml-3 text-sm font-medium transition-colors whitespace-nowrap ${
                selectedRating === 0
                  ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
              }`}>
                {t('filters.rating.all')}
              </span>

              {/* 选中状态的背景指示器 */}
              {selectedRating === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-r-full" />
              )}
            </label>
          </div>
        </div>

        {/* 特色标签 */}
        <div className="mb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {t('filters.features.title')}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-center whitespace-nowrap">
              {t('filters.features.newArrival')}
            </span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 text-center whitespace-nowrap">
              {t('filters.features.onSale')}
            </span>
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-center whitespace-nowrap">
              {t('filters.features.premium')}
            </span>
            <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-center whitespace-nowrap">
              {t('filters.features.bestseller')}
            </span>
          </div>
        </div>

        {/* 清除筛选按钮 */}
        <div className="mb-6">
          <button
            onClick={() => {
              onCategoryChange('all');
              onPriceRangeChange('all');
              onRatingChange(0);
            }}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('filters.clearAll')}
          </button>
        </div>

        {/* 底部装饰区域 */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              使用筛选器找到<br />您的完美商品
            </p>
          </div>

          {/* 装饰性分隔线 */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full opacity-60"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
