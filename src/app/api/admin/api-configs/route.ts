import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取API配置列表
export async function GET() {
  try {
    const configs = await prisma.apiConfig.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: configs.map(config => ({
        ...config,
        testResult: config.testResult ? JSON.parse(config.testResult) : null,
      })),
    })
  } catch (error) {
    console.error('获取API配置失败:', error)
    return NextResponse.json(
      { success: false, message: '获取API配置失败' },
      { status: 500 }
    )
  }
}

// 创建或更新API配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, apiKey, baseUrl, isActive } = body

    const config = await prisma.apiConfig.upsert({
      where: { name },
      update: {
        apiKey,
        baseUrl,
        isActive,
      },
      create: {
        name,
        apiKey,
        baseUrl,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...config,
        testResult: config.testResult ? JSON.parse(config.testResult) : null,
      },
    })
  } catch (error) {
    console.error('保存API配置失败:', error)
    return NextResponse.json(
      { success: false, message: '保存API配置失败' },
      { status: 500 }
    )
  }
}
