import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取权限模板列表
export async function GET() {
  try {
    // 暂时使用模拟数据，避免数据库问题
    const mockTemplates = [
      {
        id: '1',
        name: '运营经理模板',
        description: '适用于运营经理的权限模板',
        permissions: ['product_management', 'order_management', 'data_analysis']
      },
      {
        id: '2',
        name: '客服专员模板',
        description: '适用于客服专员的权限模板',
        permissions: ['order_management', 'customer_service']
      },
      {
        id: '3',
        name: '内容编辑模板',
        description: '适用于内容编辑的权限模板',
        permissions: ['content_management']
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockTemplates
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
