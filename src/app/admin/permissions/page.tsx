'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'admin';
  permissions: string[];
  createdAt: string;
  lastLogin: string;
  status: 'active' | 'inactive';
}

export default function PermissionsPage() {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查当前用户权限
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      router.push('/admin/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== 'super_admin') {
      router.push('/admin/dashboard');
      return;
    }

    setCurrentUser(user);
    loadAdminUsers();
  }, [router]);

  const loadAdminUsers = () => {
    // 模拟加载管理员用户数据
    const mockUsers: AdminUser[] = [
      {
        id: '1',
        username: 'admin',
        name: '超级管理员',
        role: 'super_admin',
        permissions: ['*'],
        createdAt: '2024-01-01',
        lastLogin: '2024-01-15 10:30',
        status: 'active'
      },
      {
        id: '2',
        username: 'manager',
        name: '商品管理员',
        role: 'admin',
        permissions: ['products', 'orders', 'users'],
        createdAt: '2024-01-05',
        lastLogin: '2024-01-14 16:45',
        status: 'active'
      },
      {
        id: '3',
        username: 'content',
        name: '内容管理员',
        role: 'admin',
        permissions: ['content', 'analytics'],
        createdAt: '2024-01-10',
        lastLogin: '2024-01-13 09:15',
        status: 'inactive'
      }
    ];
    
    setAdminUsers(mockUsers);
    setLoading(false);
  };

  const availablePermissions = [
    { key: 'orders', name: '订单管理', description: '查看和管理所有订单' },
    { key: 'users', name: '用户管理', description: '管理前台用户账户' },
    { key: 'products', name: '商品管理', description: '管理商品信息和库存' },
    { key: 'product_collection', name: '商品采集', description: '自动采集和处理商品' },
    { key: 'image_processing', name: '图像处理', description: '图片清洗和本地化' },
    { key: 'content', name: '内容管理', description: '管理博客和页面内容' },
    { key: 'analytics', name: '数据分析', description: '查看经营数据和报表' },
    { key: 'countries', name: '多国家设置', description: '管理国际化配置' },
    { key: 'settings', name: '系统设置', description: '系统配置和API管理' }
  ];

  const getPermissionNames = (permissions: string[]) => {
    if (permissions.includes('*')) return '全部权限';
    return permissions.map(p => 
      availablePermissions.find(ap => ap.key === p)?.name || p
    ).join(', ');
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status: string) => {
    return status === 'active' ? '活跃' : '停用';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">权限管理</h1>
            <p className="text-gray-600 mt-1">管理系统管理员账户和权限分配</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 创建管理员
          </button>
        </div>

        {/* 权限说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">权限管理说明</h3>
              <p className="text-sm text-yellow-700 mt-1">
                只有超级管理员可以创建和管理其他管理员账户。管理员的权限由超级管理员分配，无法自行修改权限。
              </p>
            </div>
          </div>
        </div>

        {/* 管理员列表 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">管理员账户</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    权限
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后登录
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'super_admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'super_admin' ? '超级管理员' : '管理员'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {getPermissionNames(user.permissions)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.role !== 'super_admin' && (
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">编辑</button>
                          <button className="text-red-600 hover:text-red-900">删除</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
