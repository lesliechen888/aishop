'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { DatabaseProduct } from '@/lib/productDatabase';

const TestMultiLangPage = () => {
  const { language, languages, setLanguage, t } = useLocalization();
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?limit=5');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 重置数据库
  const resetDatabase = async () => {
    setResetting(true);
    try {
      const response = await fetch('/api/reset-db', {
        method: 'POST',
      });
      const result = await response.json();

      if (result.success) {
        // 重新获取产品数据
        await fetchProducts();
        alert('数据库已重置，商品数据已更新！');
      } else {
        alert('重置失败：' + result.error);
      }
    } catch (error) {
      console.error('Reset database error:', error);
      alert('重置失败，请稍后重试');
    } finally {
      setResetting(false);
    }
  };

  // 获取当前语言的文本
  const getLocalizedText = (text: any): string => {
    if (typeof text === 'string') return text;
    if (typeof text === 'object' && text !== null) {
      return text[language as keyof typeof text] || text.en || '';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 语言切换器 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            多语言测试页面
          </h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  language === lang.code
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}

            <button
              onClick={resetDatabase}
              disabled={resetting}
              className="px-4 py-2 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {resetting ? '重置中...' : '🔄 重置数据库'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 分类翻译测试 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                分类翻译测试
              </h3>
              <div className="space-y-2">
                {[
                  'categories.all',
                  'categories.bras',
                  'categories.underwear',
                  'categories.sleepwear',
                  'categories.activewear',
                  'categories.swimwear',
                  'categories.accessories'
                ].map((categoryKey) => (
                  <div key={categoryKey} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{categoryKey}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{t(categoryKey)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 导航翻译测试 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                导航翻译测试
              </h3>
              <div className="space-y-2">
                {[
                  'nav.home',
                  'nav.products',
                  'nav.categories',
                  'nav.news',
                  'nav.about',
                  'nav.contact'
                ].map((navKey) => (
                  <div key={navKey} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{navKey}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{t(navKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 产品多语言测试 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            产品多语言测试
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 6).map((product) => (
                <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                      {t(product.category)}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {getLocalizedText(product.name)}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                    {getLocalizedText(product.description)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 当前语言信息 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            当前语言信息
          </h3>
          <p className="text-blue-800 dark:text-blue-200">
            语言代码: <span className="font-mono font-bold">{language}</span>
          </p>
          <p className="text-blue-800 dark:text-blue-200">
            语言名称: <span className="font-bold">{languages.find(l => l.code === language)?.name}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestMultiLangPage;
