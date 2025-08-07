'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { authState, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: authState.user?.name || '',
    email: authState.user?.email || '',
    phone: authState.user?.phone || '',
    companyName: authState.user?.companyName || '',
    contactPerson: authState.user?.contactPerson || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 模拟数据
  const mockStats = {
    totalOrders: 12,
    pendingOrders: 2,
    completedOrders: 8,
    totalSpent: 2580.50,
    favoriteItems: 15,
    rewardPoints: 1250,
  };

  const recentOrders = [
    { id: 'ORD-001', date: '2024-01-15', status: 'delivered', total: 299.99, items: 3 },
    { id: 'ORD-002', date: '2024-01-10', status: 'shipped', total: 159.50, items: 2 },
    { id: 'ORD-003', date: '2024-01-05', status: 'processing', total: 89.99, items: 1 },
  ];

  const quickActions = [
    { icon: '📦', title: '我的订单', description: '查看订单状态', href: '/orders', color: 'blue' },
    { icon: '❤️', title: '收藏夹', description: '我的心愿清单', href: '/favorites', color: 'red' },
    { icon: '📍', title: '地址管理', description: '收货地址', href: '/addresses', color: 'green' },
    { icon: '🎁', title: '优惠券', description: '我的优惠券', href: '/coupons', color: 'purple' },
    { icon: '💬', title: '客服中心', description: '联系客服', href: '/support', color: 'orange' },
    { icon: '⚙️', title: '账户设置', description: '安全设置', href: '/settings', color: 'gray' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: '资料更新成功！' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || '更新失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '更新失败，请稍后重试' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return '已送达';
      case 'shipped': return '已发货';
      case 'processing': return '处理中';
      default: return '未知';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 用户欢迎横幅 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {authState.user?.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    欢迎回来，{authState.user?.name}！
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {authState.user?.role === 'b2b' ? '企业会员' : '尊贵会员'} •
                    积分: {mockStats.rewardPoints.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-right">
                  <p className="text-blue-100 text-sm">累计消费</p>
                  <p className="text-2xl font-bold">¥{mockStats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总订单</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">待处理</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.pendingOrders}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">⏳</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">收藏商品</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.favoriteItems}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❤️</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">积分余额</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.rewardPoints.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">快捷操作</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-${action.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* 消息提示 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* 标签页导航 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  概览
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  个人资料
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'security'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  安全设置
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* 最近订单 */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">最近订单</h3>
                      <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        查看全部 →
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">{order.items}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.id}</p>
                              <p className="text-sm text-gray-500">{order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">¥{order.total}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 账户信息概览 */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">账户信息</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">注册时间</p>
                        <p className="font-medium text-gray-900">{formatDate(authState.user?.createdAt!)}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">邮箱验证</p>
                        <p className={`font-medium ${authState.user?.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
                          {authState.user?.isEmailVerified ? '已验证' : '未验证'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">账户类型</p>
                        <p className="font-medium text-gray-900">
                          {authState.user?.role === 'admin' ? '管理员' :
                           authState.user?.role === 'b2b' ? '企业用户' : '个人用户'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">会员等级</p>
                        <p className="font-medium text-gray-900">黄金会员</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">个人资料</h3>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        编辑资料
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData({
                              name: authState.user?.name || '',
                              email: authState.user?.email || '',
                              phone: authState.user?.phone || '',
                              companyName: authState.user?.companyName || '',
                              contactPerson: authState.user?.contactPerson || '',
                            });
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 姓名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        姓名
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    {/* 邮箱 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱地址
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">邮箱地址不可修改</p>
                    </div>

                    {/* 电话 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        联系电话
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="请输入联系电话"
                      />
                    </div>

                    {/* B2B用户额外字段 */}
                    {authState.user?.role === 'b2b' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            公司名称
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="请输入公司名称"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            联系人
                          </label>
                          <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="请输入联系人姓名"
                          />
                        </div>
                      </>
                    )}

                    {/* 保存按钮 */}
                    {isEditing && (
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              保存中...
                            </div>
                          ) : (
                            '保存更改'
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">安全设置</h3>

                  {/* 密码修改 */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">登录密码</h4>
                        <p className="text-sm text-gray-500">定期更换密码可以提高账户安全性</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                        修改密码
                      </button>
                    </div>
                  </div>

                  {/* 两步验证 */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">两步验证</h4>
                        <p className="text-sm text-gray-500">为您的账户添加额外的安全保护</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        启用
                      </button>
                    </div>
                  </div>

                  {/* 登录设备 */}
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">登录设备管理</h4>
                        <p className="text-sm text-gray-500">查看和管理您的登录设备</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        查看设备
                      </button>
                    </div>
                  </div>

                  {/* 注销账户 */}
                  <div className="p-6 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-900">注销账户</h4>
                        <p className="text-sm text-red-600">永久删除您的账户和所有数据</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        注销账户
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
