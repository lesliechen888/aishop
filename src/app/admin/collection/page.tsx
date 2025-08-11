'use client';

import { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { CollectionTask, Platform, CollectionMethod } from '@/types/collection';
import AutoCollectionInterface from '@/components/collection/AutoCollectionInterface';
import CollectionBox from '@/components/collection/CollectionBox';
import { UrlInput } from '@/components/ui/Input';
import { addProductToCollection } from '@/utils/productStorage';

const CollectionPage = () => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<'collect' | 'auto' | 'box' | 'manage'>('collect');
  const [collectionUrl, setCollectionUrl] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('1688');

  const platforms = [
    { id: '1688' as Platform, name: '1688', icon: '🏭', color: 'bg-orange-500' },
    { id: 'taobao' as Platform, name: '淘宝', icon: '🛒', color: 'bg-orange-600' },
    { id: 'pdd' as Platform, name: '拼多多', icon: '🛍️', color: 'bg-red-500' },
    { id: 'jd' as Platform, name: '京东', icon: '🐕', color: 'bg-red-600' },
    { id: 'douyin' as Platform, name: '抖音', icon: '🎵', color: 'bg-black' },
    { id: 'temu' as Platform, name: 'Temu', icon: '🌟', color: 'bg-blue-500' },
  ];

  const handleCollect = async () => {
    if (!collectionUrl.trim()) {
      alert(t('collection.invalidUrl'));
      return;
    }

    setIsCollecting(true);

    try {
      const response = await fetch('/api/collection/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: collectionUrl }),
      });

      const result = await response.json();

      if (result.success) {
        // 保存商品到采集箱
        addProductToCollection(result.data);

        setCollectionUrl('');

        // 只显示一次提示，询问是否查看采集箱
        if (confirm('商品采集成功！是否前往采集箱查看？')) {
          setActiveTab('box'); // 切换到采集箱Tab
        }
      } else {
        if (result.isDuplicate) {
          alert(t('collection.duplicateError'));
        } else {
          alert(result.error || t('collection.error'));
        }
      }

    } catch (error) {
      console.error('Collection error:', error);
      alert(t('collection.error'));
    } finally {
      setIsCollecting(false);
    }
  };

  const detectPlatform = (url: string): Platform | null => {
    if (url.includes('1688.com')) return '1688';
    if (url.includes('taobao.com')) return 'taobao';
    if (url.includes('pinduoduo.com') || url.includes('pdd.com')) return 'pdd';
    if (url.includes('jd.com') || url.includes('item.jd.com')) return 'jd';
    if (url.includes('douyin.com') || url.includes('haohuo.jinritemai.com')) return 'douyin';
    if (url.includes('temu.com')) return 'temu';
    return null;
  };

  const handleUrlChange = (url: string) => {
    setCollectionUrl(url);
    const detected = detectPlatform(url);
    if (detected) {
      setSelectedPlatform(detected);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('collection.title')}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('collection.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'collect', name: '单品采集', icon: '🔍' },
              { id: 'auto', name: '全自动采集', icon: '🤖' },
              { id: 'box', name: '采集箱', icon: '📦' },
              { id: 'manage', name: '商品管理', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'collect' && (
          <div className="space-y-6">
            {/* Platform Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                选择采集平台
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center text-white text-xl mx-auto mb-2`}>
                        {platform.icon}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {platform.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                已选择平台: {platforms.find(p => p.id === selectedPlatform)?.name}
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                现在支持 1688、淘宝、拼多多、京东、抖音、Temu 等主流电商平台的商品采集
              </div>
            </div>

            {/* URL Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('collection.urlInput')}
              </h2>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <UrlInput
                    value={collectionUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder={t('collection.urlPlaceholder')}
                    helperText="支持1688、淘宝、拼多多、京东、抖音、Temu等平台"
                  />
                </div>
                <button
                  onClick={handleCollect}
                  disabled={isCollecting || !collectionUrl.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {isCollecting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('collection.collecting')}
                    </div>
                  ) : (
                    t('collection.collectBtn')
                  )}
                </button>
              </div>
              
              {/* URL Examples */}
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  支持的链接格式示例：
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>• 1688: https://detail.1688.com/offer/123456789.html</div>
                  <div>• 淘宝: https://item.taobao.com/item.htm?id=123456789</div>
                  <div>• 拼多多: https://mobile.pinduoduo.com/goods.html?goods_id=123456789</div>
                  <div>• 京东: https://item.jd.com/123456789.html</div>
                  <div>• 抖音: https://haohuo.jinritemai.com/views/product/detail?id=123456789</div>
                  <div>• Temu: https://www.temu.com/goods.html?goods_id=123456789</div>
                </div>
              </div>
            </div>

            {/* Collection History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                最近采集记录
              </h2>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无采集记录
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auto' && (
          <div className="space-y-6">
            {/* Auto Collection Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('autoCollection.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('autoCollection.subtitle')}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">支持平台</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">1000+</div>
                  <div className="text-sm text-green-600 dark:text-green-400">每小时采集</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">95%</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">成功率</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">自动运行</div>
                </div>
              </div>
            </div>

            {/* Auto Collection Interface */}
            <AutoCollectionInterface />
          </div>
        )}

        {activeTab === 'box' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('collectionBox.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                管理您采集的商品，进行批量编辑和发布操作
              </p>
            </div>

            <CollectionBox
              onBatchEdit={(productIds, updates) => {
                console.log('Batch edit:', productIds, updates);
                // TODO: 实现批量编辑逻辑
              }}
              onBatchPublish={(productIds) => {
                console.log('Batch publish:', productIds);
                // TODO: 实现批量发布逻辑
              }}
              onDelete={(productIds) => {
                console.log('Delete products:', productIds);
                // 删除逻辑已在CollectionBox组件内部处理
              }}
            />
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('productMgmt.title')}
            </h2>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无已发布商品
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
