import { NextRequest, NextResponse } from 'next/server'
import { newsParsingEngine } from '@/utils/newsParsingEngine'
import { NewsCollectionTask, NewsCollectionSettings, CollectedNewsArticle } from '@/types/collection'

// 内存存储（生产环境中应使用数据库）
const newsCollectionTasks: Map<string, NewsCollectionTask> = new Map()
const collectedNews: Map<string, CollectedNewsArticle[]> = new Map()

// 生成任务ID
function generateTaskId(): string {
  return 'news_task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

// 创建新闻采集任务
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls, settings, name } = body

    console.log('新闻采集请求:', { urls, settings, name })

    // 验证输入
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({
        success: false,
        error: '请提供有效的URL列表'
      }, { status: 400 })
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({
        success: false,
        error: '请提供任务名称'
      }, { status: 400 })
    }

    // 默认设置
    const defaultSettings: NewsCollectionSettings = {
      maxArticles: 100,
      timeout: 30000,
      retryCount: 3,
      delay: 2000,
      enableContentFilter: true,
      filterKeywords: [],
      minContentLength: 200,
      maxContentLength: 50000,
      dateRange: {},
      downloadImages: false,
      maxImages: 5,
      imageQuality: 'medium',
      extractSummary: true,
      translateContent: false,
      removeDuplicates: true,
      generateSeoTags: true,
      autoSlug: true
    }

    const finalSettings: NewsCollectionSettings = { ...defaultSettings, ...settings }

    // 创建任务
    const taskId = generateTaskId()
    const now = new Date().toISOString()

    const task: NewsCollectionTask = {
      id: taskId,
      name,
      source: 'custom', // 根据URL检测
      status: 'pending',
      urls,
      keywords: [],
      categories: [],
      totalArticles: 0,
      collectedArticles: 0,
      failedArticles: 0,
      progress: 0,
      startTime: now,
      settings: finalSettings,
      createdBy: 'admin', // TODO: 从认证中获取
      createdAt: now,
      updatedAt: now
    }

    // 保存任务
    newsCollectionTasks.set(taskId, task)
    collectedNews.set(taskId, [])

    // 异步执行采集
    setTimeout(() => processNewsCollectionTask(taskId), 1000)

    return NextResponse.json({
      success: true,
      data: {
        taskId,
        status: 'pending',
        message: '新闻采集任务已创建'
      }
    })

  } catch (error) {
    console.error('新闻采集API错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}

// 获取采集任务状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      // 返回所有任务
      const tasks = Array.from(newsCollectionTasks.values())
      return NextResponse.json({
        success: true,
        data: tasks
      })
    }

    // 返回特定任务
    const task = newsCollectionTasks.get(taskId)
    if (!task) {
      return NextResponse.json({
        success: false,
        error: '任务不存在'
      }, { status: 404 })
    }

    const articles = collectedNews.get(taskId) || []

    return NextResponse.json({
      success: true,
      data: {
        task,
        articles
      }
    })

  } catch (error) {
    console.error('获取任务状态错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}

// 删除采集任务
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')

    if (!taskId) {
      return NextResponse.json({
        success: false,
        error: '请提供任务ID'
      }, { status: 400 })
    }

    const task = newsCollectionTasks.get(taskId)
    if (!task) {
      return NextResponse.json({
        success: false,
        error: '任务不存在'
      }, { status: 404 })
    }

    // 删除任务和数据
    newsCollectionTasks.delete(taskId)
    collectedNews.delete(taskId)

    return NextResponse.json({
      success: true,
      message: '任务已删除'
    })

  } catch (error) {
    console.error('删除任务错误:', error)
    return NextResponse.json({
      success: false,
      error: '服务器内部错误'
    }, { status: 500 })
  }
}

// 处理新闻采集任务
async function processNewsCollectionTask(taskId: string) {
  const task = newsCollectionTasks.get(taskId)
  if (!task) {
    console.error('任务不存在:', taskId)
    return
  }

  try {
    console.log('开始处理新闻采集任务:', taskId)

    // 更新任务状态
    task.status = 'processing'
    task.updatedAt = new Date().toISOString()
    newsCollectionTasks.set(taskId, task)

    const articles: CollectedNewsArticle[] = []
    const totalUrls = task.urls.length
    let processed = 0

    for (const url of task.urls) {
      try {
        console.log(`处理URL: ${url}`)

        // 解析新闻文章
        const result = await newsParsingEngine.parseNewsArticle(url, taskId)
        
        if (result.success && result.article) {
          // 内容过滤
          const filteredArticle = await filterNewsContent(result.article, task.settings)
          
          if (filteredArticle) {
            articles.push(filteredArticle)
            task.collectedArticles++
            console.log(`成功采集文章: ${filteredArticle.title}`)
          } else {
            task.failedArticles++
            console.log(`文章被过滤: ${url}`)
          }
        } else {
          task.failedArticles++
          console.log(`采集失败: ${url}, 错误: ${result.error}`)
        }

        // 更新进度
        processed++
        task.progress = Math.round((processed / totalUrls) * 100)
        task.updatedAt = new Date().toISOString()
        newsCollectionTasks.set(taskId, task)

        // 保存已采集的文章
        collectedNews.set(taskId, articles)

        // 延迟避免过于频繁的请求
        if (processed < totalUrls) {
          await delay(task.settings.delay)
        }

        // 检查是否达到最大文章数
        if (articles.length >= task.settings.maxArticles) {
          console.log(`达到最大文章数限制: ${task.settings.maxArticles}`)
          break
        }

      } catch (error) {
        console.error(`处理URL失败: ${url}`, error)
        task.failedArticles++
      }
    }

    // 完成任务
    task.status = 'completed'
    task.endTime = new Date().toISOString()
    task.totalArticles = articles.length
    task.progress = 100
    task.updatedAt = new Date().toISOString()
    newsCollectionTasks.set(taskId, task)

    console.log(`新闻采集任务完成: ${taskId}, 采集了 ${articles.length} 篇文章`)

  } catch (error) {
    console.error('新闻采集任务失败:', error)
    
    // 更新任务为失败状态
    task.status = 'failed'
    task.errorMessage = error instanceof Error ? error.message : '未知错误'
    task.endTime = new Date().toISOString()
    task.updatedAt = new Date().toISOString()
    newsCollectionTasks.set(taskId, task)
  }
}

// 内容过滤
async function filterNewsContent(article: CollectedNewsArticle, settings: NewsCollectionSettings): Promise<CollectedNewsArticle | null> {
  if (!settings.enableContentFilter) {
    return article
  }

  const filterResults = article.filterResults || []

  // 内容长度过滤
  if (article.content.length < settings.minContentLength) {
    filterResults.push({
      type: 'content',
      field: 'content',
      originalValue: article.content,
      action: 'rejected',
      reason: `内容长度不足 (${article.content.length} < ${settings.minContentLength})`
    })
    return null
  }

  if (article.content.length > settings.maxContentLength) {
    article.content = article.content.substring(0, settings.maxContentLength) + '...'
    filterResults.push({
      type: 'content',
      field: 'content',
      originalValue: article.content,
      filteredValue: article.content,
      action: 'removed',
      reason: `内容长度超限，已截取到 ${settings.maxContentLength} 字符`
    })
  }

  // 关键词过滤
  if (settings.filterKeywords.length > 0) {
    const content = article.title + ' ' + article.content
    const hasFilteredKeyword = settings.filterKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (hasFilteredKeyword) {
      filterResults.push({
        type: 'keyword',
        field: 'content',
        originalValue: content,
        action: 'rejected',
        reason: '包含过滤关键词'
      })
      return null
    }
  }

  // 日期范围过滤
  if (settings.dateRange.start || settings.dateRange.end) {
    const publishDate = article.publishedAt || article.collectedAt
    const articleDate = new Date(publishDate)
    
    if (settings.dateRange.start && articleDate < new Date(settings.dateRange.start)) {
      filterResults.push({
        type: 'date',
        field: 'publishedAt',
        originalValue: publishDate,
        action: 'rejected',
        reason: '发布日期早于设定范围'
      })
      return null
    }
    
    if (settings.dateRange.end && articleDate > new Date(settings.dateRange.end)) {
      filterResults.push({
        type: 'date',
        field: 'publishedAt',
        originalValue: publishDate,
        action: 'rejected',
        reason: '发布日期晚于设定范围'
      })
      return null
    }
  }

  // 重复检测（简化版本）
  if (settings.removeDuplicates) {
    // 这里应该实现更复杂的重复检测逻辑
    // 暂时使用标题相似度检测
  }

  article.filterResults = filterResults
  return article
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}