'use client'

import React, { useState } from 'react'
import { CollectedNewsArticle } from '@/types/collection'
import NewsCollection from '@/components/admin/NewsCollection'
import NewsCollectionResults from '@/components/admin/NewsCollectionResults'

export default function NewsCollectionPage() {
  const [collectedArticles, setCollectedArticles] = useState<CollectedNewsArticle[]>([])
  const [activeView, setActiveView] = useState<'collection' | 'results'>('collection')

  // 处理采集完成
  const handleCollectionComplete = (articles: CollectedNewsArticle[]) => {
    setCollectedArticles(articles)
    setActiveView('results')
  }

  // 处理文章编辑
  const handleEditArticle = (article: CollectedNewsArticle) => {
    // TODO: 实现文章编辑功能
    console.log('编辑文章:', article)
    alert('文章编辑功能开发中...')
  }

  // 处理文章删除
  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      setCollectedArticles(prev => prev.filter(a => a.id !== articleId))
    }
  }

  // 处理文章发布
  const handlePublishArticles = (articles: CollectedNewsArticle[]) => {
    // TODO: 实现发布到新闻系统的功能
    console.log('发布文章:', articles)
    alert(`准备发布 ${articles.length} 篇文章到新闻系统...`)
    
    // 模拟发布过程
    setTimeout(() => {
      // 更新文章状态为已发布
      setCollectedArticles(prev => 
        prev.map(article => 
          articles.some(a => a.id === article.id)
            ? { ...article, status: 'published' as const }
            : article
        )
      )
      alert('文章发布成功！')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  新闻采集管理
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  从各大时尚媒体网站和RSS源采集最新新闻资讯
                </p>
              </div>
              
              {/* 视图切换按钮 */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('collection')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'collection'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  📰 新闻采集
                </button>
                <button
                  onClick={() => setActiveView('results')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === 'results'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  📋 采集结果 {collectedArticles.length > 0 && `(${collectedArticles.length})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 功能说明卡片 */}
        <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="text-2xl">ℹ️</div>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200">
                新闻采集功能说明
              </h3>
              <div className="mt-2 text-blue-800 dark:text-blue-300">
                <p className="mb-2">
                  新闻采集系统支持从主流时尚媒体网站和RSS源自动抓取最新资讯：
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li><strong>支持网站：</strong>Vogue、ELLE、Harper's Bazaar、Cosmopolitan等</li>
                  <li><strong>RSS采集：</strong>支持任何有效的RSS/Atom源</li>
                  <li><strong>智能解析：</strong>自动提取标题、内容、作者、发布时间等信息</li>
                  <li><strong>内容过滤：</strong>支持关键词过滤、长度限制、去重等功能</li>
                  <li><strong>批量管理：</strong>支持批量编辑、发布和删除操作</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {collectedArticles.length > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📰</div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {collectedArticles.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">总文章数</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">✅</div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {collectedArticles.filter(a => a.status === 'published').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">已发布</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📝</div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {collectedArticles.filter(a => a.status === 'draft').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">草稿</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">🏷️</div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {new Set(collectedArticles.flatMap(a => a.tags)).size}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">标签数</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 内容区域 */}
        <div className="space-y-8">
          {activeView === 'collection' && (
            <NewsCollection onCollectionComplete={handleCollectionComplete} />
          )}
          
          {activeView === 'results' && (
            <NewsCollectionResults
              articles={collectedArticles}
              onPublish={handlePublishArticles}
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
            />
          )}
        </div>

        {/* 快速操作面板 */}
        {collectedArticles.length > 0 && activeView === 'collection' && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">快速操作</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveView('results')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                📋 查看采集结果 ({collectedArticles.length})
              </button>
              <button
                onClick={() => handlePublishArticles(collectedArticles.filter(a => a.status === 'draft'))}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                disabled={collectedArticles.filter(a => a.status === 'draft').length === 0}
              >
                🚀 发布所有草稿 ({collectedArticles.filter(a => a.status === 'draft').length})
              </button>
              <button
                onClick={() => {
                  if (window.confirm('确定要清空所有采集结果吗？')) {
                    setCollectedArticles([])
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                🗑️ 清空结果
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}