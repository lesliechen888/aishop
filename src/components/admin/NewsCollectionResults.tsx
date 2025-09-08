'use client'

import React, { useState } from 'react'
import { CollectedNewsArticle } from '@/types/collection'

interface NewsCollectionResultsProps {
  articles: CollectedNewsArticle[]
  onPublish?: (articles: CollectedNewsArticle[]) => void
  onEdit?: (article: CollectedNewsArticle) => void
  onDelete?: (articleId: string) => void
}

export default function NewsCollectionResults({ 
  articles, 
  onPublish, 
  onEdit, 
  onDelete 
}: NewsCollectionResultsProps) {
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)

  // 获取分类列表
  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)))

  // 过滤文章
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchTerm || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory

    return matchesSearch && matchesCategory
  })

  // 分页
  const totalPages = Math.ceil(filteredArticles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize)

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedArticles.size === paginatedArticles.length) {
      setSelectedArticles(new Set())
    } else {
      setSelectedArticles(new Set(paginatedArticles.map(a => a.id)))
    }
  }

  // 切换单个文章选择
  const toggleSelectArticle = (articleId: string) => {
    const newSelected = new Set(selectedArticles)
    if (newSelected.has(articleId)) {
      newSelected.delete(articleId)
    } else {
      newSelected.add(articleId)
    }
    setSelectedArticles(newSelected)
  }

  // 批量发布
  const handleBatchPublish = () => {
    const articlesToPublish = articles.filter(a => selectedArticles.has(a.id))
    onPublish?.(articlesToPublish)
  }

  // 批量删除
  const handleBatchDelete = () => {
    if (window.confirm(`确定要删除选中的 ${selectedArticles.size} 篇文章吗？`)) {
      selectedArticles.forEach(id => onDelete?.(id))
      setSelectedArticles(new Set())
    }
  }

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 截取文本
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (articles.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">📰</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无采集结果</h3>
        <p className="text-gray-600 dark:text-gray-400">请先执行新闻采集任务</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* 头部工具栏 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              采集结果 ({filteredArticles.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              共采集到 {articles.length} 篇文章
            </p>
          </div>
          
          {selectedArticles.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                已选择 {selectedArticles.size} 篇
              </span>
              <button
                onClick={handleBatchPublish}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
              >
                批量发布
              </button>
              <button
                onClick={handleBatchDelete}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                批量删除
              </button>
            </div>
          )}
        </div>

        {/* 搜索和过滤 */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="w-8 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedArticles.size === paginatedArticles.length && paginatedArticles.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                文章信息
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                来源
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                发布时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article.id)}
                    onChange={() => toggleSelectArticle(article.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <div className="font-medium text-gray-900 dark:text-white mb-1">
                      {truncateText(article.title, 60)}
                    </div>
                    {article.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {truncateText(article.excerpt, 100)}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {article.source.toUpperCase()}
                    </div>
                    {article.author && (
                      <div className="text-gray-600 dark:text-gray-400">
                        {article.author.name}
                      </div>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(article.publishedAt || article.collectedAt)}
                </td>
                
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    article.status === 'published'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : article.status === 'approved'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : article.status === 'pending_review'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : article.status === 'rejected'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {article.status === 'published' && '已发布'}
                    {article.status === 'approved' && '已审核'}
                    {article.status === 'pending_review' && '待审核'}
                    {article.status === 'rejected' && '已拒绝'}
                    {article.status === 'draft' && '草稿'}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit?.(article)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => window.open(article.originalUrl, '_blank')}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                    >
                      原文
                    </button>
                    <button
                      onClick={() => onDelete?.(article.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      删除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              显示 {startIndex + 1} - {Math.min(startIndex + pageSize, filteredArticles.length)} 条，
              共 {filteredArticles.length} 条
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}