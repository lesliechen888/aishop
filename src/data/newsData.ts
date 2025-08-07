import { NewsArticle, NewsCategory } from '@/types';

export const newsCategories: NewsCategory[] = [
  {
    id: '1',
    name: '时尚趋势',
    slug: 'fashion-trends',
    description: '最新的时尚潮流和趋势分析',
    color: 'blue',
    icon: '👗'
  },
  {
    id: '2',
    name: '行业动态',
    slug: 'industry-news',
    description: '内衣服装行业的最新动态和发展',
    color: 'green',
    icon: '📈'
  },
  {
    id: '3',
    name: '可持续时尚',
    slug: 'sustainable-fashion',
    description: '环保面料和可持续发展相关资讯',
    color: 'emerald',
    icon: '🌱'
  },
  {
    id: '4',
    name: '品牌故事',
    slug: 'brand-stories',
    description: '知名内衣品牌的发展历程和故事',
    color: 'purple',
    icon: '🏆'
  },
  {
    id: '5',
    name: '穿搭指南',
    slug: 'styling-guide',
    description: '内衣搭配建议和穿着技巧',
    color: 'pink',
    icon: '✨'
  },
  {
    id: '6',
    name: '材质科技',
    slug: 'material-tech',
    description: '新型面料科技和创新材质应用',
    color: 'indigo',
    icon: '🧵'
  }
];

// 导入大量新闻数据
import { generateLargeNewsDataset } from './largeNewsDataset';

export const newsArticles: NewsArticle[] = generateLargeNewsDataset();

// 获取热门文章
export const getFeaturedArticles = (limit: number = 3): NewsArticle[] => {
  return newsArticles
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

// 根据分类获取文章
export const getArticlesByCategory = (categorySlug: string, limit?: number): NewsArticle[] => {
  const category = newsCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  const filtered = newsArticles.filter(article => article.category === category.name);
  return limit ? filtered.slice(0, limit) : filtered;
};

// 获取最新文章
export const getLatestArticles = (limit: number = 6): NewsArticle[] => {
  return newsArticles
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
};

// 根据标签获取相关文章
export const getRelatedArticles = (currentArticleId: string, tags: string[], limit: number = 3): NewsArticle[] => {
  return newsArticles
    .filter(article =>
      article.id !== currentArticleId &&
      article.tags.some(tag => tags.includes(tag))
    )
    .sort((a, b) => {
      const aMatchCount = a.tags.filter(tag => tags.includes(tag)).length;
      const bMatchCount = b.tags.filter(tag => tags.includes(tag)).length;
      return bMatchCount - aMatchCount;
    })
    .slice(0, limit);
};

// 根据ID获取单篇文章
export const getArticleById = (id: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.id === id);
};

// 根据slug获取单篇文章
export const getArticleBySlug = (slug: string): NewsArticle | undefined => {
  return newsArticles.find(article => article.slug === slug);
};

// 搜索文章
export const searchArticles = (query: string, limit: number = 20): NewsArticle[] => {
  const lowercaseQuery = query.toLowerCase();
  return newsArticles
    .filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.excerpt.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      article.category.toLowerCase().includes(lowercaseQuery)
    )
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit);
};

// 分页获取文章
export const getArticlesPaginated = (page: number = 1, pageSize: number = 12): {
  articles: NewsArticle[];
  totalPages: number;
  currentPage: number;
  totalArticles: number;
} => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const sortedArticles = newsArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return {
    articles: sortedArticles.slice(startIndex, endIndex),
    totalPages: Math.ceil(newsArticles.length / pageSize),
    currentPage: page,
    totalArticles: newsArticles.length
  };
};

// 获取热门标签
export const getPopularTags = (limit: number = 20): { tag: string; count: number }[] => {
  const tagCounts: Record<string, number> = {};

  newsArticles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// 获取统计信息
export const getNewsStatistics = () => {
  const categoryStats: Record<string, number> = {};
  const authorStats: Record<string, number> = {};
  let totalViews = 0;
  let totalLikes = 0;

  newsArticles.forEach(article => {
    categoryStats[article.category] = (categoryStats[article.category] || 0) + 1;
    authorStats[article.author.name] = (authorStats[article.author.name] || 0) + 1;
    totalViews += article.views;
    totalLikes += article.likes;
  });

  return {
    totalArticles: newsArticles.length,
    totalViews,
    totalLikes,
    categoryStats,
    authorStats,
    averageReadTime: Math.round(newsArticles.reduce((sum, article) => sum + article.readTime, 0) / newsArticles.length),
    averageViews: Math.round(totalViews / newsArticles.length),
    averageLikes: Math.round(totalLikes / newsArticles.length)
  };
};
