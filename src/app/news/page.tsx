'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { NewsArticle, NewsCategory } from '@/types';
import { 
  newsCategories,
  getArticlesPaginated,
  searchArticles,
  getArticlesByCategory 
} from '@/data/newsData';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState(false);

  const pageSize = 12;

  useEffect(() => {
    loadArticles();
  }, [currentPage, selectedCategory]);

  const loadArticles = () => {
    setLoading(true);
    
    if (searchMode && searchQuery) {
      const results = searchArticles(searchQuery, 100);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setArticles(results.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(results.length / pageSize));
    } else if (selectedCategory === 'all') {
      const paginatedData = getArticlesPaginated(currentPage, pageSize);
      setArticles(paginatedData.articles);
      setTotalPages(paginatedData.totalPages);
    } else {
      const categoryArticles = getArticlesByCategory(selectedCategory);
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      setArticles(categoryArticles.slice(startIndex, endIndex));
      setTotalPages(Math.ceil(categoryArticles.length / pageSize));
    }
    
    setLoading(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchMode(true);
      setCurrentPage(1);
      setSelectedCategory('all');
      loadArticles();
    } else {
      setSearchMode(false);
      loadArticles();
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
    setSearchMode(false);
    setSearchQuery('');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            时尚资讯
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            探索最新的时尚趋势、行业动态和品牌故事
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索新闻标题、内容或标签..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              搜索
            </button>
          </div>
        </div>

        {/* Main Content - Left Right Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">📂</span>
                资讯分类
              </h3>

              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">📰</span>
                  <span>全部资讯</span>
                </button>

                {newsCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
                      selectedCategory === category.slug
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs opacity-75 mt-1">{category.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Category Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">分类统计</h4>
                <div className="space-y-2">
                  {newsCategories.map((category) => {
                    const categoryCount = articles.filter(article => article.category === category.name).length;
                    return (
                      <div key={category.id} className="flex items-center justify-between text-xs text-gray-600">
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          {category.name}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full">{categoryCount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hot Articles Sidebar */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-red-500">🔥</span>
                热门资讯
              </h3>

              <div className="space-y-4">
                {articles.slice(0, 5).map((article, index) => (
                  <div key={article.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{article.views.toLocaleString()} 浏览</span>
                        <span>•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Articles */}
          <div className="lg:col-span-3">

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Articles Grid */}
            {!loading && (
              <>
                {/* Featured Article */}
                {articles.length > 0 && currentPage === 1 && selectedCategory === 'all' && !searchMode && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <span className="text-blue-600">⭐</span>
                      精选资讯
                    </h2>
                    <NewsCard article={articles[0]} featured={true} />
                  </div>
                )}

                {/* Articles List */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {searchMode ? `搜索结果 "${searchQuery}"` :
                       selectedCategory === 'all' ? '最新资讯' :
                       newsCategories.find(cat => cat.slug === selectedCategory)?.name}
                    </h2>
                    <span className="text-sm text-gray-500">
                      共 {articles.length} 篇文章
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {articles.slice(currentPage === 1 && selectedCategory === 'all' && !searchMode ? 1 : 0).map((article) => (
                      <NewsCard key={article.id} article={article} />
                    ))}
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      上一页
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!loading && articles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无相关资讯</h3>
                <p className="text-gray-600">请尝试其他搜索关键词或选择不同的分类</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
