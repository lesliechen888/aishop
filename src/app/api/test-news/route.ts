import { NextRequest, NextResponse } from 'next/server'
import { newsParsingEngine, detectNewsSource, getNewsSourceConfig } from '@/utils/newsParsingEngine'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    console.log('测试新闻采集:', url)
    
    // 1. 测试新闻源检测
    const detection = detectNewsSource(url)
    console.log('新闻源检测结果:', detection)
    
    // 2. 获取配置
    const config = detection.config || getNewsSourceConfig('custom')
    console.log('使用的配置:', config?.name)
    
    // 3. 尝试解析
    const result = await newsParsingEngine.parseNewsArticle(url, 'test-task')
    
    return NextResponse.json({
      success: true,
      data: {
        detection,
        config: config?.name,
        parseResult: result,
        url
      }
    })
    
  } catch (error) {
    console.error('测试错误:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

// 测试获取页面内容
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json({ error: '缺少URL参数' }, { status: 400 })
    }
    
    console.log('测试获取页面:', url)
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    const html = await response.text()
    
    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      contentLength: html.length,
      title: html.match(/<title[^>]*>([^<]+)</i)?.[1] || '未找到标题',
      url
    })
    
  } catch (error) {
    console.error('获取页面失败:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
}