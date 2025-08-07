'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getFacebookUserInfo } from '@/lib/socialAuth';

export default function FacebookCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleFacebookCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Facebook登录被取消或失败');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('未收到Facebook授权码');
          return;
        }

        setMessage('正在处理Facebook登录...');

        // 在实际项目中，这里应该调用后端API来交换access token
        // 这里我们模拟一个成功的登录流程
        
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模拟Facebook用户信息
        const mockFacebookUser = {
          id: 'facebook_123456',
          email: 'user@facebook.com',
          name: 'Facebook用户',
          avatar: 'https://via.placeholder.com/100',
          provider: 'facebook' as const
        };

        // 使用现有的登录系统
        const result = await login({
          email: mockFacebookUser.email,
          password: 'social_login_token', // 社交登录使用特殊token
          rememberMe: true
        });

        if (result.success) {
          setStatus('success');
          setMessage('Facebook登录成功！正在跳转...');
          
          // 获取重定向URL
          const redirectUrl = localStorage.getItem('socialLoginRedirect') || '/';
          localStorage.removeItem('socialLoginRedirect');
          
          setTimeout(() => {
            router.push(redirectUrl);
          }, 1500);
        } else {
          setStatus('error');
          setMessage(result.error || 'Facebook登录失败');
        }

      } catch (error) {
        console.error('Facebook登录回调处理失败:', error);
        setStatus('error');
        setMessage('Facebook登录处理失败，请稍后重试');
      }
    };

    handleFacebookCallback();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            {status === 'loading' && (
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {status === 'success' && (
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Facebook登录处理中'}
          {status === 'success' && '登录成功'}
          {status === 'error' && '登录失败'}
        </h2>

        <p className="text-gray-600 mb-6">{message}</p>

        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              返回登录页面
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              重试
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="text-sm text-gray-500">
            请稍候，正在验证您的Facebook账户...
          </div>
        )}

        {status === 'success' && (
          <div className="text-sm text-green-600">
            即将跳转到您之前访问的页面...
          </div>
        )}
      </div>
    </div>
  );
}
