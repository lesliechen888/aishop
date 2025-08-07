'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// 订单类型定义
interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const { authState } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 模拟订单数据
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.99,
      items: [
        {
          id: '1',
          name: '经典白色T恤',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop&crop=center',
          price: 89.99,
          quantity: 2,
          size: 'M',
          color: '白色'
        },
        {
          id: '2',
          name: '牛仔裤',
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop&crop=center',
          price: 120.00,
          quantity: 1,
          size: 'L',
          color: '蓝色'
        }
      ],
      shippingAddress: '北京市朝阳区xxx街道xxx号',
      trackingNumber: 'SF1234567890',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 159.50,
      items: [
        {
          id: '3',
          name: '运动鞋',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop&crop=center',
          price: 159.50,
          quantity: 1,
          size: '42',
          color: '黑色'
        }
      ],
      shippingAddress: '上海市浦东新区xxx路xxx号',
      trackingNumber: 'YT9876543210',
      estimatedDelivery: '2024-01-12'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'pending',
      total: 89.99,
      items: [
        {
          id: '4',
          name: '连帽卫衣',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop&crop=center',
          price: 89.99,
          quantity: 1,
          size: 'XL',
          color: '灰色'
        }
      ],
      shippingAddress: '广州市天河区xxx大道xxx号'
    }
  ];

  const statusFilters = [
    { key: 'all', label: '全部订单', count: mockOrders.length },
    { key: 'pending', label: '待付款', count: mockOrders.filter(o => o.status === 'pending').length },
    { key: 'confirmed', label: '待发货', count: mockOrders.filter(o => o.status === 'confirmed').length },
    { key: 'shipped', label: '已发货', count: mockOrders.filter(o => o.status === 'shipped').length },
    { key: 'delivered', label: '已完成', count: mockOrders.filter(o => o.status === 'delivered').length },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'confirmed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'shipped': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      case 'refunded': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待付款';
      case 'confirmed': return '待发货';
      case 'shipped': return '已发货';
      case 'delivered': return '已完成';
      case 'cancelled': return '已取消';
      case 'refunded': return '已退款';
      default: return '未知状态';
    }
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    const matchesSearch = searchQuery === '' || 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">我的订单</h1>
            <p className="mt-2 text-gray-600">查看和管理您的所有订单</p>
          </div>

          {/* 搜索栏 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索订单号或商品名称..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                搜索
              </button>
            </div>
          </div>

          {/* 状态筛选 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              {statusFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeFilter === filter.key ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 订单列表 */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无订单</h3>
                <p className="text-gray-600 mb-6">您还没有任何订单，快去购物吧！</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  开始购物
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* 订单头部 */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                          <p className="text-sm text-gray-500">下单时间: {order.date}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">¥{order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">共 {order.items.length} 件商品</p>
                      </div>
                    </div>
                  </div>

                  {/* 商品列表 */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/100x100/f3f4f6/9ca3af?text=${encodeURIComponent(item.name.slice(0, 2))}`;
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              {item.size && <span>尺码: {item.size}</span>}
                              {item.color && <span>颜色: {item.color}</span>}
                              <span>数量: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">¥{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 订单操作 */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="text-sm text-gray-600">
                        <p>收货地址: {order.shippingAddress}</p>
                        {order.trackingNumber && (
                          <p className="mt-1">物流单号: {order.trackingNumber}</p>
                        )}
                        {order.estimatedDelivery && (
                          <p className="mt-1">预计送达: {order.estimatedDelivery}</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          查看详情
                        </Link>
                        {order.status === 'pending' && (
                          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            立即付款
                          </button>
                        )}
                        {order.status === 'shipped' && order.trackingNumber && (
                          <button className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                            查看物流
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <button className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-700 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                            申请售后
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 分页 */}
          {filteredOrders.length > 0 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  上一页
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
}
