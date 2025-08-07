'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [orderNumber] = useState(() => 
    'ORD-' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase()
  );

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleViewOrders = () => {
    router.push('/account/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 成功图标 */}
          <div className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* 成功消息 */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">订单提交成功！</h1>
          <p className="text-xl text-gray-600 mb-8">
            感谢您的购买，我们已收到您的订单并开始处理
          </p>

          {/* 订单信息 */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">订单详情</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单号:</span>
                    <span className="font-medium text-gray-900">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">下单时间:</span>
                    <span className="font-medium text-gray-900">
                      {new Date().toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">支付状态:</span>
                    <span className="font-medium text-green-600">已支付</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">订单状态:</span>
                    <span className="font-medium text-blue-600">处理中</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">接下来会发生什么？</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">订单确认</p>
                      <p className="text-xs text-gray-600">我们会发送确认邮件到您的邮箱</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">准备发货</p>
                      <p className="text-xs text-gray-600">1-2个工作日内准备您的订单</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">发货通知</p>
                      <p className="text-xs text-gray-600">发货后会提供物流跟踪号</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">送达</p>
                      <p className="text-xs text-gray-600">3-7个工作日内送达</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 重要提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">重要提示</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 订单确认邮件已发送到您的邮箱，请查收</li>
                  <li>• 您可以随时在"我的订单"中查看订单状态</li>
                  <li>• 如有任何问题，请联系我们的客服团队</li>
                  <li>• 支持7天无理由退换货政策</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewOrders}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              查看我的订单
            </button>
            <button
              onClick={handleContinueShopping}
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              继续购物
            </button>
          </div>

          {/* 客服联系 */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">需要帮助？</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@example.com"
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>发送邮件</span>
              </a>
              
              <a
                href="tel:+1-555-123-4567"
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>电话咨询</span>
              </a>
              
              <a
                href="/contact"
                className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>在线客服</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
