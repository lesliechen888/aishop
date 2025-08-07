'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: '产品详情', icon: '📝' },
    { id: 'specifications', label: '规格参数', icon: '📏' },
    { id: 'reviews', label: '用户评价', icon: '⭐' },
    { id: 'shipping', label: '配送信息', icon: '🚚' },
    { id: 'care', label: '护理说明', icon: '🧼' },
  ];

  // 模拟评价数据
  const mockReviews = [
    {
      id: '1',
      userName: '张小姐',
      rating: 5,
      date: '2024-01-15',
      comment: '质量很好，穿着很舒适，颜色也很正，推荐购买！',
      helpful: 12,
      images: []
    },
    {
      id: '2',
      userName: '李女士',
      rating: 4,
      date: '2024-01-10',
      comment: '整体不错，就是尺码偏小一点，建议买大一号。',
      helpful: 8,
      images: []
    },
    {
      id: '3',
      userName: '王小姐',
      rating: 5,
      date: '2024-01-05',
      comment: '非常满意，面料柔软，做工精细，会回购的！',
      helpful: 15,
      images: []
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      );
    }
    return stars;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">产品描述</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
              <div className="prose max-w-none">
                <h4 className="font-semibold mb-2">产品特点：</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>采用优质面料，柔软舒适</li>
                  <li>精工细作，品质保证</li>
                  <li>时尚设计，彰显个性</li>
                  <li>多种颜色可选，满足不同需求</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'specifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">规格参数</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">品牌</span>
                  <span className="text-gray-900">{product.brand || 'Fashion Brand'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">材质</span>
                  <span className="text-gray-900">{product.material || '棉质混纺'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">颜色</span>
                  <span className="text-gray-900">{product.color || '多色可选'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">尺码</span>
                  <span className="text-gray-900">{product.sizes?.join(', ') || 'XS-XL'}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">产地</span>
                  <span className="text-gray-900">中国</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">洗涤方式</span>
                  <span className="text-gray-900">机洗/手洗</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">适用季节</span>
                  <span className="text-gray-900">四季通用</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">包装</span>
                  <span className="text-gray-900">精美包装盒</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">用户评价</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                写评价
              </button>
            </div>
            
            {/* 评价统计 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    {renderStars(Math.round(product.rating))}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">总体评分</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 w-8">{star}星</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${Math.random() * 80 + 10}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">{Math.floor(Math.random() * 50)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 评价列表 */}
            <div className="space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {review.userName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="hover:text-blue-600 transition-colors">
                          👍 有用 ({review.helpful})
                        </button>
                        <button className="hover:text-blue-600 transition-colors">
                          回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">配送信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🚚
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">标准配送</h4>
                    <p className="text-sm text-gray-600">3-7个工作日送达，满99元免运费</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">快速配送</h4>
                    <p className="text-sm text-gray-600">1-3个工作日送达，额外收费15元</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    🏪
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">门店自提</h4>
                    <p className="text-sm text-gray-600">下单后2小时可到店自提，免运费</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">退换政策</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 7天无理由退换</li>
                    <li>• 商品需保持原包装</li>
                    <li>• 退货运费由买家承担</li>
                    <li>• 质量问题免费退换</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-3">护理说明</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    🧼
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">清洗方式</h4>
                    <p className="text-sm text-gray-600">30°C以下温水手洗或机洗，使用中性洗涤剂</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    ☀️
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">晾晒方式</h4>
                    <p className="text-sm text-gray-600">避免阳光直射，阴凉通风处自然晾干</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    🔥
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">熨烫方式</h4>
                    <p className="text-sm text-gray-600">低温熨烫，避免直接接触面料</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">注意事项</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 首次清洗前请查看洗涤标签</li>
                    <li>• 深浅色衣物分开洗涤</li>
                    <li>• 避免使用漂白剂</li>
                    <li>• 存放时保持干燥通风</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 标签导航 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 标签内容 */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;
