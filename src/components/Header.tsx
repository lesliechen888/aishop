'use client';

import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocalization } from '@/contexts/LocalizationContext';

const Header = () => {
  const { t } = useLocalization();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.products'), href: '/products' },
    { name: t('nav.categories'), href: '/categories' },
    { name: t('nav.news'), href: '/news' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Global Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Search, Cart, Language Switcher */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Cart Button */}
            <button
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors relative"
              aria-label="Shopping Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Login Button */}
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400"
              >
                {t('auth.login')}
              </Link>

              {/* Register Button */}
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t('auth.register')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-700 mt-4">
                <Link
                  href="/login"
                  className="block w-full text-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 text-base font-medium rounded-lg transition-all duration-300 shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('auth.register')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
