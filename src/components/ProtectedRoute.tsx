'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'customer' | 'admin' | 'b2b';
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRole,
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) => {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果还在加载中，不做任何操作
    if (authState.isLoading) return;

    // 如果需要认证但用户未登录
    if (requireAuth && !authState.isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
      return;
    }

    // 如果需要特定角色但用户角色不匹配
    if (requiredRole && authState.user?.role !== requiredRole) {
      // 根据用户角色重定向到合适的页面
      if (authState.user?.role === 'admin') {
        router.push('/admin');
      } else if (authState.user?.role === 'b2b') {
        router.push('/b2b');
      } else {
        router.push('/');
      }
      return;
    }
  }, [authState, requireAuth, requiredRole, redirectTo, router]);

  // 加载中显示加载状态
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果需要认证但用户未登录，显示空白（因为会重定向）
  if (requireAuth && !authState.isAuthenticated) {
    return null;
  }

  // 如果需要特定角色但用户角色不匹配，显示无权限页面
  if (requiredRole && authState.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">访问被拒绝</h1>
          <p className="text-gray-600 mb-8">您没有权限访问此页面</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  // 渲染受保护的内容
  return <>{children}</>;
};

export default ProtectedRoute;
