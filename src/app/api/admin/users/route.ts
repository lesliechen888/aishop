import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 获取管理员用户列表
export async function GET() {
  try {
    // 暂时使用模拟数据，避免数据库问题
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        name: '系统管理员',
        role: 'super_admin',
        permissions: ['user_management', 'product_management', 'order_management'],
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: '2',
        username: 'manager',
        name: '运营经理',
        role: 'admin',
        permissions: ['product_management', 'order_management'],
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockUsers
    })
  } catch (error) {
    console.error('获取用户列表失败:', error)
    return NextResponse.json(
      { success: false, message: '获取用户列表失败' },
      { status: 500 }
    )
  }
}

// 创建管理员用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, name, password, role, permissions } = body

    // 检查用户名是否已存在
    const existingUser = await prisma.adminUser.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: '用户名已存在' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.adminUser.create({
      data: {
        username,
        name,
        password: hashedPassword,
        role,
        permissions: JSON.stringify(permissions),
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        permissions: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        permissions: JSON.parse(user.permissions),
      },
    })
  } catch (error) {
    console.error('创建用户失败:', error)
    return NextResponse.json(
      { success: false, message: '创建用户失败' },
      { status: 500 }
    )
  }
}
