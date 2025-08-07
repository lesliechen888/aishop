'use client';

import Link from 'next/link';
import { NewsArticle } from '@/types';
import { newsCategories } from '@/data/newsData';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const category = newsCategories.find(cat => cat.name === categoryName);
    return category?.color || 'blue';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = newsCategories.find(cat => cat.name === categoryName);
    return category?.icon || '📰';
  };

  if (featured) {
    return (
      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <Link href={`/news/${article.slug}`}>
          {/* Featured Image */}
          <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-20">{getCategoryIcon(article.category)}</div>
            </div>
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-600 shadow-lg">
                {article.category}
              </span>
            </div>
            <div className="absolute bottom-6 right-6 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {article.readTime} 分钟阅读
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 hover:text-blue-600 transition-colors">
              {article.title}
            </h2>
            <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed">
              {article.excerpt}
            </p>
            
            {/* Author and Date */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {article.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{article.author.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(article.publishedAt)}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                  {article.views.toLocaleString()} 浏览
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  {article.likes} 点赞
                </span>
              </div>
              <span className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                阅读更多
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Regular card layout
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/news/${article.slug}`}>
        {/* Article Image */}
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-20">{getCategoryIcon(article.category)}</div>
          </div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-blue-600">
              {article.category}
            </span>
          </div>
          <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {article.readTime}分钟
          </div>
        </div>

        {/* Article Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          {/* Article Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {article.author.name.charAt(0)}
              </div>
              <span>{article.author.name}</span>
            </div>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                {article.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                {article.likes}
              </span>
            </div>
            <span className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
              阅读更多
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsCard;
