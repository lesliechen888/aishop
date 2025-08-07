'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { languages, localizedContent } from '@/data/mockData';
import { Language } from '@/types';

interface LocalizationContextType {
  language: string;
  currentLanguage: Language | undefined;
  languages: Language[];
  isLoading: boolean;
  setLanguage: (languageCode: string) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

// 检测用户的首选语言
const detectUserLanguage = (): string => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs = languages.map(lang => lang.code);
  
  return supportedLangs.includes(browserLang) ? browserLang : 'en';
};

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);

  // 初始化用户语言偏好
  useEffect(() => {
    const savedLanguage = localStorage.getItem('userLanguage');
    
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      // 自动检测用户语言
      const detectedLang = detectUserLanguage();
      setLanguageState(detectedLang);
      localStorage.setItem('userLanguage', detectedLang);
    }
    
    setIsLoading(false);
  }, []);

  // 更新语言
  const setLanguage = useCallback((languageCode: string) => {
    setLanguageState(languageCode);
    localStorage.setItem('userLanguage', languageCode);
  }, []);

  // 获取翻译文本
  const t = useCallback((key: string): string => {
    const langContent = localizedContent[language];
    return langContent?.[key] || key;
  }, [language]);

  // 格式化价格（使用USD作为默认货币）
  const formatPrice = useCallback((price: number): string => {
    const formatter = new Intl.NumberFormat(language, {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(price);
  }, [language]);

  // 获取当前语言信息
  const currentLanguage = languages.find(lang => lang.code === language);

  const value: LocalizationContextType = {
    language,
    currentLanguage,
    languages,
    isLoading,
    setLanguage,
    t,
    formatPrice,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
