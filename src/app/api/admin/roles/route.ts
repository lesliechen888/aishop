import { NextRequest, NextResponse } from 'next/server'

// 模拟角色数据
const mockRoles = [
  {
    id: '1',
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissions: ['*'],
    isSystem: true
  },
  {
    id: '2',
    name: '运营经理',
    description: '负责日常运营管理',
    permissions: ['product_management', 'order_management', 'data_analysis', 'marketing_management'],
    isSystem: false
  },
  {
    id: '3',
    name: '客服专员',
    description: '负责客户服务和订单处理',
    permissions: ['order_management', 'customer_service'],
    isSystem: false
  },
  {
    id: '4',
    name: '内容编辑',
    description: '负责网站内容管理',
    permissions: ['content_management'],
    isSystem: false
  }
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      roles: mockRoles
    })
  } catch (error) {
    console.error('获取角色列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取角色列表失败' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, permissions } = body

    // 验证必填字段
    if (!name || !description || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, message: '角色名称、描述和权限列表为必填项' },
        { status: 400 }
      )
    }

    // 检查角色名称是否已存在
    const existingRole = mockRoles.find(role => role.name === name)
    if (existingRole) {
      return NextResponse.json(
        { success: false, message: '角色名称已存在' },
        { status: 400 }
      )
    }

    // 创建新角色
    const newRole = {
      id: Date.now().toString(),
      name,
      description,
      permissions,
      isSystem: false
    }

    mockRoles.push(newRole)

    return NextResponse.json({
      success: true,
      message: '角色创建成功',
      role: newRole
    })
  } catch (error) {
    console.error('创建角色失败:', error)
    return NextResponse.json(
      { success: false, message: '创建角色失败' },
      { status: 500 }
    )
  }
}
