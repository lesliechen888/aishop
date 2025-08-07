// 语言类型
export interface Language {
  code: string;
  name: string;
  flag: string;
}

// 产品相关类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  inStock: boolean;
  discount?: number;
  // 扩展字段
  brand?: string;
  material?: string;
  color?: string;
  sizes?: string[];
  actualName?: string;
  actualDescription?: string;
}

// 品牌介绍类型
export interface BrandValue {
  icon: string;
  title: string;
  description: string;
}

export interface BrandInfo {
  title: string;
  description: string;
  values: BrandValue[];
  heroImage: string;
}

// 活动轮播类型
export interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  backgroundColor?: string;
}

// 导航菜单类型
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

// 多语言内容类型
export interface LocalizedContent {
  [key: string]: {
    [key: string]: string;
  };
}

// 用户偏好类型
export interface UserPreferences {
  language: string;
}

// 新闻资讯类型
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: Date;
  updatedAt: Date;
  readTime: number;
  views: number;
  likes: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  language: string;
  isAIGenerated: boolean;
  sourceUrl?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'b2b';
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  // B2B用户额外字段
  companyName?: string;
  businessLicense?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreeToTerms: boolean;
  // B2B注册额外字段
  userType?: 'customer' | 'b2b';
  companyName?: string;
  contactPerson?: string;
  phone?: string;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}
