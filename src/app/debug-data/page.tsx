'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';

const DebugDataPage = () => {
  const { language, t } = useLocalization();
  const [filters, setFilters] = useState<any>(null);
  const [products, setProducts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取筛选器数据
        const filtersResponse = await fetch('/api/products/filters');
        const filtersResult = await filtersResponse.json();
        
        // 获取所有产品数据
        const productsResponse = await fetch('/api/products?limit=100');
        const productsResult = await productsResponse.json();
        
        setFilters(filtersResult.data);
        setProducts(productsResult.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const resetDatabase = async () => {
    try {
      const response = await fetch('/api/reset-db', { method: 'POST' });
      const result = await response.json();
      
      if (result.success) {
        // 重新获取数据
        window.location.reload();
      } else {
        alert('重置失败：' + result.error);
      }
    } catch (error) {
      console.error('Reset database error:', error);
      alert('重置失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              数据调试页面
            </h1>
            <button
              onClick={resetDatabase}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔄 重置数据库
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 分类统计 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                分类统计
              </h2>
              <div className="space-y-2">
                {filters?.categories?.map((category: any) => (
                  <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {t(category.id)} ({category.id})
                      </span>
                    </div>
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
                      {category.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 品牌统计 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                品牌统计
              </h2>
              <div className="space-y-2">
                {filters?.brands?.map((brand: any) => (
                  <div key={brand.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {brand.name}
                    </span>
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-sm font-medium">
                      {brand.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 产品样本 */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              产品样本 (前10个)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">名称</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">分类</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">品牌</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">价格</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {products?.products?.slice(0, 10).map((product: any) => (
                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{product.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {typeof product.name === 'object' ? product.name[language] || product.name.en : product.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                        {t(product.category)} ({product.category})
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{product.brand}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white font-medium">${product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 统计摘要 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">总产品数</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{products?.total || 0}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">分类数</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{filters?.categories?.length || 0}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">品牌数</h3>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{filters?.brands?.length || 0}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">当前语言</h3>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{language}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugDataPage;
