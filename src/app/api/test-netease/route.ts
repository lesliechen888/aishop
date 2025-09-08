import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = 'https://www.163.com/dy/article/K8RARMUB055040N3.html?clickfrom=w_yw_dy'
    
    console.log('测试网易新闻URL:', url)
    
    // 1. 测试基本访问
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`
      })
    }
    
    const html = await response.text()
    
    // 2. 使用cheerio解析（如果可用）
    let parseResult = null
    try {
      const cheerio = require('cheerio')
      const $ = cheerio.load(html)
      
      // 尝试多种选择器提取标题
      const titleSelectors = [
        'h1.post_title', '.post_title', 'h1', '.article-title', '.title',
        '.content-title', '.news-title', '.main-title', '.text-title h1'
      ]
      
      let title = ''
      for (const selector of titleSelectors) {
        const element = $(selector).first()
        if (element.length) {
          title = element.text().trim()
          if (title) {
            parseResult = { titleSelector: selector, title }
            break
          }
        }
      }
      
      // 尝试提取内容
      const contentSelectors = [
        '.post_body', '.post_text', '.article-content', '.content', 'article'
      ]
      
      let content = ''
      for (const selector of contentSelectors) {
        const element = $(selector).first()
        if (element.length) {
          content = element.text().trim()
          if (content && content.length > 100) {
            parseResult = { ...parseResult, contentSelector: selector, contentLength: content.length }
            break
          }
        }
      }
      
    } catch (error) {
      console.log('Cheerio解析失败:', error.message)
    }
    
    // 3. 简单的正则表达式提取
    const titleMatch = html.match(/<title[^>]*>([^<]+)/i)
    const title = titleMatch ? titleMatch[1] : '未找到标题'
    
    return NextResponse.json({
      success: true,
      data: {
        url,
        status: response.status,
        contentLength: html.length,
        title,
        parseResult,
        hasPostTitle: html.includes('post_title'),
        hasPostBody: html.includes('post_body'),
        hasArticleContent: html.includes('article-content')
      }
    })
    
  } catch (error) {
    console.error('测试错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 测试完整的新闻采集流程
    const { url = 'https://www.163.com/dy/article/K8RARMUB055040N3.html?clickfrom=w_yw_dy' } = await request.json()
    
    // 动态导入新闻解析引擎
    const { newsParsingEngine } = await import('@/utils/newsParsingEngine')
    
    console.log('开始完整测试新闻采集:', url)
    
    const result = await newsParsingEngine.parseNewsArticle(url, 'test-task')
    
    return NextResponse.json({
      success: true,
      data: {
        url,
        parseResult: result
      }
    })
    
  } catch (error) {
    console.error('完整测试错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}