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
