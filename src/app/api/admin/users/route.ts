import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 获取管理员用户列表
export async function GET() {
  try {
    const users = await prisma.adminUser.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: users.map(user => ({
        ...user,
        permissions: JSON.parse(user.permissions),
      })),
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
