'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthContextType, LoginCredentials, RegisterData, User } from '@/types';

// 初始状态
const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

// Action类型
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGOUT' };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

// 创建Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据库
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: '管理员',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'user@example.com',
    name: '普通用户',
    role: 'customer',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'b2b@example.com',
    name: 'B2B用户',
    role: 'b2b',
    isEmailVerified: true,
    companyName: '时尚贸易有限公司',
    contactPerson: '张经理',
    phone: '+86 138-0000-0000',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Provider组件
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // 初始化时检查本地存储的登录状态
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  // 登录函数
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 查找用户
      const user = mockUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return { success: false, error: '用户不存在' };
      }

      // 简单的密码验证（实际项目中应该使用加密验证）
      if (credentials.password !== 'password123') {
        return { success: false, error: '密码错误' };
      }

      // 生成模拟token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      // 存储到本地存储
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('authToken', token);
      
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      
      return { success: true };
    } catch (error) {
      console.error('登录失败:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: '登录失败，请稍后重试' };
    }
  };

  // 注册函数
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 检查邮箱是否已存在
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: '该邮箱已被注册' };
      }

      // 验证密码
      if (data.password !== data.confirmPassword) {
        return { success: false, error: '两次输入的密码不一致' };
      }

      if (data.password.length < 6) {
        return { success: false, error: '密码长度至少6位' };
      }

      // 创建新用户
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email: data.email,
        name: data.name,
        role: data.userType || 'customer',
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        phone: data.phone,
      };

      // 添加到模拟数据库
      mockUsers.push(newUser);

      // 生成模拟token
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      // 存储到本地存储
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);

      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      
      return { success: true };
    } catch (error) {
      console.error('注册失败:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: '注册失败，请稍后重试' };
    }
  };

  // 登出函数
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户资料
  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!authState.user) {
        return { success: false, error: '用户未登录' };
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...authState.user, ...data, updatedAt: new Date() };
      
      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      return { success: true };
    } catch (error) {
      console.error('更新用户资料失败:', error);
      return { success: false, error: '更新失败，请稍后重试' };
    }
  };

  const contextValue: AuthContextType = {
    authState,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
