import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 测试API连接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, apiKey, baseUrl } = body

    let testResult: any = {
      success: false,
      message: '',
      timestamp: new Date().toISOString(),
    }

    try {
      switch (name) {
        case 'serpapi':
          testResult = await testSerpApi(apiKey)
          break
        case 'deepseek':
          testResult = await testDeepSeekApi(apiKey, baseUrl)
          break
        case 'doubao':
          testResult = await testDoubaoApi(apiKey, baseUrl)
          break
        default:
          testResult.message = '不支持的API类型'
      }
    } catch (error: any) {
      testResult.message = error.message || '测试失败'
    }

    // 保存测试结果到数据库
    await prisma.apiConfig.upsert({
      where: { name },
      update: {
        testResult: JSON.stringify(testResult),
      },
      create: {
        name,
        apiKey,
        baseUrl,
        isActive: false,
        testResult: JSON.stringify(testResult),
      },
    })

    return NextResponse.json({
      success: true,
      data: testResult,
    })
  } catch (error) {
    console.error('API测试失败:', error)
    return NextResponse.json(
      { success: false, message: 'API测试失败' },
      { status: 500 }
    )
  }
}

async function testSerpApi(apiKey: string) {
  const response = await fetch(`https://serpapi.com/account?api_key=${apiKey}`)
  const data = await response.json()
  
  if (response.ok && data.account_id) {
    return {
      success: true,
      message: '连接成功',
      data: {
        accountId: data.account_id,
        plan: data.plan,
        searches_left: data.searches_left,
      },
      timestamp: new Date().toISOString(),
    }
  } else {
    throw new Error(data.error || '连接失败')
  }
}

async function testDeepSeekApi(apiKey: string, baseUrl?: string) {
  const url = baseUrl || 'https://api.deepseek.com'
  
  const response = await fetch(`${url}/v1/models`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json()
  
  if (response.ok && data.data) {
    return {
      success: true,
      message: '连接成功',
      data: {
        models: data.data.slice(0, 3).map((model: any) => model.id),
        total_models: data.data.length,
      },
      timestamp: new Date().toISOString(),
    }
  } else {
    throw new Error(data.error?.message || '连接失败')
  }
}

async function testDoubaoApi(apiKey: string, baseUrl?: string) {
  const url = baseUrl || 'https://ark.cn-beijing.volces.com'
  
  const response = await fetch(`${url}/api/v3/models`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  })
  
  const data = await response.json()
  
  if (response.ok) {
    return {
      success: true,
      message: '连接成功',
      data: {
        status: 'connected',
        response_time: Date.now(),
      },
      timestamp: new Date().toISOString(),
    }
  } else {
    throw new Error(data.error?.message || '连接失败')
  }
}
