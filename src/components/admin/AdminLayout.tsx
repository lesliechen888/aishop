'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import UserPermissions from './UserPermissions';
import OrderManagement from './OrderManagement';
import DataAnalytics from './DataAnalytics';
import ApiSettings from './ApiSettings';
import AfterSales from './AfterSales';
import SmartCollection from './SmartCollection';
import CollectionBox from './CollectionBox';
import TestPage from './TestPage';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
}

// 菜单项类型定义
interface SubMenuItem {
  name: string
  key: string
  permission: string
}

interface MenuItem {
  name: string
  key: string
  icon: string
  permission: string
  type: 'single' | 'group'
  children?: SubMenuItem[]
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  const handleMenuClick = (item: any, child?: any) => {
    if (item.type === 'single') {
      setCurrentView(item.key);
      setActiveSubmenu(null);
    } else if (item.type === 'group') {
      if (child) {
        setCurrentView(child.key);
        setActiveSubmenu(item.key);
      } else {
        setActiveSubmenu(activeSubmenu === item.key ? null : item.key);
      }
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'user-permissions':
        return <UserPermissions />;
      case 'orders':
        return <OrderManagement />;
      case 'after-sales':
        return <AfterSales />;
      case 'analytics':
        return <DataAnalytics />;
      case 'smart-collection':
        return <SmartCollection />;
      case 'collection-box':
        return <CollectionBox />;
      case 'api-settings':
        return <ApiSettings />;
      case 'content':
        return <TestPage />;
      case 'countries':
        return <TestPage />;
      case 'basic-settings':
        return <TestPage />;
      case 'dashboard':
      default:
        return children;
    }
  };

  // 导航菜单配置
  const menuItems: MenuItem[] = [
    {
      name: '仪表板',
      key: 'dashboard',
      icon: '📊',
      permission: '*',
      type: 'single'
    },
    {
      name: '订单管理',
      key: 'orders',
      icon: '📦',
      permission: 'order_management',
      type: 'single'
    },
    {
      name: '售后工作台',
      key: 'after-sales',
      icon: '🛠️',
      permission: 'order_management',
      type: 'single'
    },
    {
      name: '数据分析',
      key: 'analytics',
      icon: '📈',
      permission: 'data_analysis',
      type: 'single'
    },
    {
      name: '用户管理',
      key: 'users',
      icon: '👥',
      permission: '*',
      type: 'group',
      children: [
        {
          name: '权限管理',
          key: 'user-permissions',
          permission: 'user_management'
        }
      ]
    },
    {
      name: '商品管理',
      key: 'products',
      icon: '🛍️',
      permission: 'products',
      type: 'group',
      children: [
        {
          name: '商品列表',
          key: 'product-list',
          permission: 'products'
        },
        {
          name: '智能采集',
          key: 'smart-collection',
          permission: 'product_collection'
        },
        {
          name: '采集箱',
          key: 'collection-box',
          permission: 'product_collection'
        }
      ]
    },
    {
      name: '图像处理',
      key: 'image-processing',
      icon: '🖼️',
      permission: 'image_processing',
      type: 'single'
    },
    {
      name: '内容管理',
      key: 'content',
      icon: '📝',
      permission: 'content',
      type: 'single'
    },
    {
      name: '多国家设置',
      key: 'countries',
      icon: '🌍',
      permission: 'countries',
      type: 'single'
    },
    {
      name: '系统设置',
      key: 'settings',
      icon: '⚙️',
      permission: 'settings',
      type: 'group',
      children: [
        {
          name: 'API配置',
          key: 'api-settings',
          permission: 'settings'
        },
        {
          name: '基础设置',
          key: 'basic-settings',
          permission: 'settings'
        }
      ]
    },
    {
      name: '权限管理',
      key: 'permissions',
      icon: '🔐',
      permission: 'super_admin_only',
      type: 'single'
    }
  ];

  // 检查用户权限
  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    if (permission === 'super_admin_only') return user.role === 'super_admin';
    return user.permissions.includes(permission);
  };

  // 过滤菜单项
  const filteredMenuItems = menuItems.filter(item => 
    item.permission === '*' || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className={`fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
          <h1 className="text-xl font-bold text-white">管理后台</h1>
        </div>

        {/* 导航菜单 */}
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <div key={item.key}>
                {item.type === 'single' ? (
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      currentView === item.key
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => handleMenuClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        activeSubmenu === item.key
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </div>
                      <span className={`transform transition-transform ${
                        activeSubmenu === item.key ? 'rotate-90' : ''
                      }`}>
                        ▶
                      </span>
                    </button>
                    {activeSubmenu === item.key && item.children && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((child: any) => (
                          <button
                            key={child.key}
                            onClick={() => handleMenuClick(item, child)}
                            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                              currentView === child.key
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* 用户信息 */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.role === 'super_admin' ? '超级管理员' : '管理员'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="lg:ml-56">
        {/* 顶部导航栏 */}
        <div className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* 移动端菜单按钮 */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">打开侧边栏</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1"></div>
            
            {/* 用户菜单 */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* 通知按钮 */}
              <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">查看通知</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>

              {/* 分隔线 */}
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

              {/* 用户头像和菜单 */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900"
                  onClick={handleLogout}
                >
                  <span className="sr-only">打开用户菜单</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name.charAt(0)}
                    </span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      退出登录
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 页面内容 */}
        <main className="pt-4 pb-2">
          <div className="px-4 sm:px-6 lg:px-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
