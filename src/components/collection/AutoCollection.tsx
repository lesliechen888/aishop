'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { CollectionTask, Platform, CollectionSettings } from '@/types/collection';

interface AutoCollectionProps {
  onTaskCreated: (task: CollectionTask) => void;
}

const AutoCollection = ({ onTaskCreated }: AutoCollectionProps) => {
  const { t } = useLocalization();
  const [activeMode, setActiveMode] = useState<'shop' | 'keyword' | 'scheduled'>('shop');
  const [isCollecting, setIsCollecting] = useState(false);
  const [currentTask, setCurrentTask] = useState<CollectionTask | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState({
    shopUrl: '',
    keywords: '',
    maxProducts: 100,
    minPrice: 0,
    maxPrice: 1000,
    selectedCategories: [] as string[],
    enableFilters: true,
    downloadImages: true,
    includeVariants: true,
    autoPublish: false,
    scheduleTime: '',
    repeatInterval: 'daily' as 'daily' | 'weekly' | 'monthly'
  });

  // 进度状态
  const [progress, setProgress] = useState({
    total: 0,
    collected: 0,
    failed: 0,
    duplicate: 0,
    percentage: 0
  });

  const categories = [
    '服装', '鞋包配饰', '家居用品', '电子产品', '美妆个护', 
    '母婴用品', '运动户外', '食品饮料', '汽车用品', '办公用品'
  ];

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
    setProgress({ total: 0, collected: 0, failed: 0, duplicate: 0, percentage: 0 });

    try {
      // 创建采集任务
      const task: CollectionTask = {
        id: `task_${Date.now()}`,
        name: activeMode === 'shop' ? `店铺采集: ${formData.shopUrl}` : `关键词采集: ${formData.keywords}`,
        platform: '1688',
        method: activeMode === 'shop' ? 'shop' : 'batch',
        status: 'processing',
        urls: activeMode === 'shop' ? [formData.shopUrl] : [],
        shopUrl: activeMode === 'shop' ? formData.shopUrl : undefined,
        totalProducts: 0,
        collectedProducts: 0,
        failedProducts: 0,
        progress: 0,
        startTime: new Date().toISOString(),
        settings: {
          maxProducts: formData.maxProducts,
          timeout: 30000,
          retryCount: 3,
          delay: 1000,
          enableContentFilter: formData.enableFilters,
          filterKeywords: [],
          filterRegions: true,
          filterPlatforms: true,
          filterShipping: true,
          priceRange: {
            min: formData.minPrice,
            max: formData.maxPrice
          },
          downloadImages: formData.downloadImages,
          maxImages: 10,
          imageQuality: 'medium',
          includeVariants: formData.includeVariants,
          includeReviews: false,
          includeShipping: true
        },
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCurrentTask(task);
      onTaskCreated(task);

      // 开始采集过程
      await startCollectionProcess(task);

    } catch (error) {
      console.error('Auto collection error:', error);
      alert('采集启动失败');
    } finally {
      setIsCollecting(false);
    }
  };

  const startCollectionProcess = async (task: CollectionTask) => {
    const totalProducts = formData.maxProducts;
    setProgress(prev => ({ ...prev, total: totalProducts }));

    // 模拟采集过程
    for (let i = 0; i < totalProducts; i++) {
      if (!isCollecting) break; // 如果用户停止了采集

      // 模拟采集延迟
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      // 模拟采集结果
      const random = Math.random();
      if (random < 0.1) {
        // 10% 失败
        setProgress(prev => ({
          ...prev,
          failed: prev.failed + 1,
          percentage: Math.round(((prev.collected + prev.failed + prev.duplicate + 1) / totalProducts) * 100)
        }));
      } else if (random < 0.15) {
        // 5% 重复
        setProgress(prev => ({
          ...prev,
          duplicate: prev.duplicate + 1,
          percentage: Math.round(((prev.collected + prev.failed + prev.duplicate + 1) / totalProducts) * 100)
        }));
      } else {
        // 85% 成功
        setProgress(prev => ({
          ...prev,
          collected: prev.collected + 1,
          percentage: Math.round(((prev.collected + 1 + prev.failed + prev.duplicate) / totalProducts) * 100)
        }));
      }
    }

    // 采集完成
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        status: 'completed' as const,
        endTime: new Date().toISOString(),
        collectedProducts: progress.collected,
        failedProducts: progress.failed,
        progress: 100
      };
      setCurrentTask(updatedTask);
    }
  };

  const handleStopCollection = () => {
    setIsCollecting(false);
    if (currentTask) {
      const updatedTask = {
        ...currentTask,
        status: 'cancelled' as const,
        endTime: new Date().toISOString()
      };
      setCurrentTask(updatedTask);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('autoCollection.title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('autoCollection.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'shop', name: t('autoCollection.shopCollection'), icon: '🏪', desc: '采集整个店铺的所有商品' },
            { id: 'keyword', name: t('autoCollection.keywordCollection'), icon: '🔍', desc: '根据关键词搜索采集商品' },
            { id: 'scheduled', name: t('autoCollection.scheduledCollection'), icon: '⏰', desc: '设置定时自动采集任务' },
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
          {/* Left Column - Main Settings */}
          <div className="space-y-4">
            {activeMode === 'shop' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('autoCollection.shopUrl')}
                </label>
                <input
                  type="url"
                  value={formData.shopUrl}
                  onChange={(e) => handleInputChange('shopUrl', e.target.value)}
                  placeholder={t('autoCollection.shopUrlPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {activeMode === 'keyword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('autoCollection.keywords')}
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                  placeholder={t('autoCollection.keywordsPlaceholder')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('autoCollection.maxProducts')}
              </label>
              <input
                type="number"
                value={formData.maxProducts}
                onChange={(e) => handleInputChange('maxProducts', Number(e.target.value))}
                min="1"
                max="1000"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('autoCollection.priceRange')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={formData.minPrice}
                  onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
                  placeholder={t('autoCollection.minPrice')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={formData.maxPrice}
                  onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
                  placeholder={t('autoCollection.maxPrice')}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Advanced Settings */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('autoCollection.settings')}
              </label>
              <div className="space-y-3">
                {[
                  { key: 'enableFilters', label: t('autoCollection.enableFilters') },
                  { key: 'downloadImages', label: t('autoCollection.downloadImages') },
                  { key: 'includeVariants', label: t('autoCollection.includeVariants') },
                  { key: 'autoPublish', label: t('autoCollection.autoPublish') },
                ].map((setting) => (
                  <label key={setting.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[setting.key as keyof typeof formData] as boolean}
                      onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {setting.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {activeMode === 'scheduled' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('autoCollection.scheduleTime')}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduleTime}
                    onChange={(e) => handleInputChange('scheduleTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('autoCollection.repeatInterval')}
                  </label>
                  <select
                    value={formData.repeatInterval}
                    onChange={(e) => handleInputChange('repeatInterval', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="daily">{t('autoCollection.daily')}</option>
                    <option value="weekly">{t('autoCollection.weekly')}</option>
                    <option value="monthly">{t('autoCollection.monthly')}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isCollecting ? t('autoCollection.collectionRunning') : '准备开始采集'}
          </div>
          <div className="flex space-x-3">
            {isCollecting ? (
              <button
                onClick={handleStopCollection}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                {t('autoCollection.stopCollection')}
              </button>
            ) : (
              <button
                onClick={handleStartCollection}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('autoCollection.startCollection')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Display */}
      {(isCollecting || currentTask) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('autoCollection.progress')}
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
                {t('autoCollection.collected')}
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {progress.failed}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400">
                {t('autoCollection.failed')}
              </div>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {progress.duplicate}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                {t('autoCollection.duplicate')}
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

export default AutoCollection;
