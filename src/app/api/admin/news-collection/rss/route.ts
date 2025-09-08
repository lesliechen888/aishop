import { NextRequest, NextResponse } from 'next/server'
import { newsParsingEngine } from '@/utils/newsParsingEngine'
import { NewsCollectionTask, NewsCollectionSettings } from '@/types/collection'

// RSS采集端点
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rssUrl, name, settings } = body

    console.log('RSS采集请求:', { rssUrl, name, settings })

    // 验证输入
    if (!rssUrl || typeof rssUrl !== 'string') {
      return NextResponse.json({
        success: false,
        error: '请提供有效的RSS URL'
      }, { status: 400 })
    }

    if (!name || typeof name !== 'string') {
      return NextResponse.json({
        success: false,
        error: '请提供任务名称'
      }, { status: 400 })
    }

    // 验证RSS URL格式
    try {
      new URL(rssUrl)
    } catch {
      return NextResponse.json({
        success: false,
        error: 'RSS URL格式无效'
      }, { status: 400 })
    }

    // 默认设置
    const defaultSettings: NewsCollectionSettings = {
      maxArticles: 50,
      timeout: 30000,
      retryCount: 3,
      delay: 1000,
      enableContentFilter: true,
      filterKeywords: [],
      minContentLength: 100,
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

    // 生成任务ID
    const taskId = 'rss_task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    const now = new Date().toISOString()

    // 创建任务记录
    const task: NewsCollectionTask = {
      id: taskId,
      name,
      source: 'rss',
      status: 'pending',
      urls: [rssUrl],
      rssUrl,
      keywords: [],
      categories: [],
      totalArticles: 0,
      collectedArticles: 0,
      failedArticles: 0,
      progress: 0,
      startTime: now,
      settings: finalSettings,
      createdBy: 'admin',
      createdAt: now,
      updatedAt: now
    }

    // 立即开始RSS解析
    console.log('开始RSS解析:', rssUrl)
    const parseResult = await newsParsingEngine.parseRSSFeed(rssUrl, taskId)

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: parseResult.error || 'RSS解析失败'
      }, { status: 400 })
    }

    const articles = parseResult.items || []
    
    // 应用文章数量限制
    const limitedArticles = articles.slice(0, finalSettings.maxArticles)

    // 更新任务状态
    task.status = 'completed'
    task.endTime = now
    task.totalArticles = limitedArticles.length
    task.collectedArticles = limitedArticles.length
    task.progress = 100
    task.updatedAt = now

    return NextResponse.json({
      success: true,
      data: {
        task,
        articles: limitedArticles,
        message: `成功从RSS源采集了 ${limitedArticles.length} 篇文章`
      }
    })

  } catch (error) {
    console.error('RSS采集错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'RSS采集失败'
    }, { status: 500 })
  }
}

// 验证RSS源
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rssUrl = searchParams.get('url')

    if (!rssUrl) {
      return NextResponse.json({
        success: false,
        error: '请提供RSS URL'
      }, { status: 400 })
    }

    console.log('验证RSS源:', rssUrl)

    // 简单验证RSS源
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(rssUrl, {
        method: 'HEAD',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        return NextResponse.json({
          success: false,
          error: `RSS源不可访问: HTTP ${response.status}`
        }, { status: 400 })
      }

      const contentType = response.headers.get('content-type') || ''
      const isValidRSS = contentType.includes('xml') || 
                        contentType.includes('rss') || 
                        contentType.includes('atom') ||
                        rssUrl.includes('.xml') ||
                        rssUrl.includes('/rss') ||
                        rssUrl.includes('/feed')

      if (!isValidRSS) {
        return NextResponse.json({
          success: false,
          error: 'URL不是有效的RSS源'
        }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        data: {
          url: rssUrl,
          contentType,
          isValid: true,
          message: 'RSS源验证成功'
        }
      })

    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'RSS源不可访问'
      }, { status: 400 })
    }

  } catch (error) {
    console.error('RSS验证错误:', error)
    return NextResponse.json({
      success: false,
      error: '验证失败'
    }, { status: 500 })
  }
}