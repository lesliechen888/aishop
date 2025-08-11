'use client';

import { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';

const AutoCollectionInterface = () => {
  const { t } = useLocalization();
  const [activeMode, setActiveMode] = useState<'shop' | 'keyword' | 'scheduled'>('shop');
  const [isCollecting, setIsCollecting] = useState(false);
  const [formData, setFormData] = useState({
    shopUrl: '',
    keywords: '',
    maxProducts: 100,
    minPrice: 0,
    maxPrice: 1000,
  });
  const [progress, setProgress] = useState({
    total: 0,
    collected: 0,
    failed: 0,
    duplicate: 0,
    percentage: 0
  });

  const handleStartCollection = async () => {
    if (activeMode === 'shop' && !formData.shopUrl.trim()) {
      alert('请输入店铺链接');
      return;
    }
    
    if (activeMode === 'keyword' && !formData.keywords.trim()) {
      alert('请输入关键词');
      return;
    }

    setIsCollecting(true);
    setProgress({ total: 100, collected: 0, failed: 0, duplicate: 0, percentage: 0 });

    try {
      // 模拟采集过程
      for (let i = 0; i < 100; i++) {
        if (!isCollecting) break;
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const random = Math.random();
        if (random < 0.1) {
          setProgress(prev => ({ ...prev, failed: prev.failed + 1 }));
        } else if (random < 0.15) {
          setProgress(prev => ({ ...prev, duplicate: prev.duplicate + 1 }));
        } else {
          setProgress(prev => ({ ...prev, collected: prev.collected + 1 }));
        }
        
        setProgress(prev => ({ ...prev, percentage: Math.round(((prev.collected + prev.failed + prev.duplicate) / 100) * 100) }));
      }
      
      alert('采集完成！');
    } catch (error) {
      console.error('Auto collection error:', error);
      alert('采集失败');
    } finally {
      setIsCollecting(false);
    }
  };

  const handleStopCollection = () => {
    setIsCollecting(false);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          选择采集模式
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'shop', name: '店铺采集', icon: '🏪', desc: '采集整个店铺的所有商品' },
            { id: 'keyword', name: '关键词采集', icon: '🔍', desc: '根据关键词搜索采集商品' },
            { id: 'scheduled', name: '定时采集', icon: '⏰', desc: '设置定时自动采集任务' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id as any)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                activeMode === mode.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                {mode.name}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {mode.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Collection Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {activeMode === 'shop' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  店铺链接
                </label>
                <input
                  type="url"
                  value={formData.shopUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, shopUrl: e.target.value }))}
                  placeholder="输入店铺链接 (支持1688、淘宝、京东、抖音等)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {activeMode === 'keyword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  关键词
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="输入关键词，用逗号分隔 (如: 服装,电子产品,家居用品)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最大商品数
              </label>
              <input
                type="number"
                value={formData.maxProducts}
                onChange={(e) => setFormData(prev => ({ ...prev, maxProducts: Number(e.target.value) }))}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                价格范围
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  placeholder="最低价格"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  placeholder="最高价格"
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                采集设置
              </label>
              <div className="space-y-2">
                {[
                  { key: 'enableFilters', label: '启用内容过滤' },
                  { key: 'downloadImages', label: '下载图片' },
                  { key: 'includeVariants', label: '包含变体' },
                  { key: 'autoPublish', label: '自动发布' },
                ].map((setting) => (
                  <label key={setting.key} className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={setting.key !== 'autoPublish'}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {setting.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isCollecting ? '采集进行中...' : '准备开始采集'}
          </div>
          <div className="flex space-x-3">
            {isCollecting ? (
              <button
                onClick={handleStopCollection}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                停止采集
              </button>
            ) : (
              <button
                onClick={handleStartCollection}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                开始自动采集
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Display */}
      {(isCollecting || progress.total > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            采集进度
          </h3>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{progress.percentage}% 完成</span>
              <span>{progress.collected + progress.failed + progress.duplicate} / {progress.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {progress.collected}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                已采集
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {progress.failed}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                失败
              </div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {progress.duplicate}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                重复
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {progress.total}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                总计
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoCollectionInterface;
