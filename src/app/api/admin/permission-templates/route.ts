import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取权限模板列表
export async function GET() {
  try {
    const templates = await prisma.permissionTemplate.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: templates.map(template => ({
        ...template,
        permissions: JSON.parse(template.permissions),
      })),
    })
  } catch (error) {
    console.error('获取权限模板失败:', error)
    return NextResponse.json(
      { success: false, message: '获取权限模板失败' },
      { status: 500 }
    )
  }
}

// 创建权限模板
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    const template = await prisma.permissionTemplate.create({
      data: {
        name,
        description,
        permissions: JSON.stringify(permissions),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        permissions: JSON.parse(template.permissions),
      },
    })
  } catch (error) {
    console.error('创建权限模板失败:', error)
    return NextResponse.json(
      { success: false, message: '创建权限模板失败' },
      { status: 500 }
    )
  }
}
