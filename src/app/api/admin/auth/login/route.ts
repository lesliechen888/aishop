import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 查找用户
    const user = await prisma.adminUser.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return NextResponse.json(
        { success: false, message: '账户已被禁用' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 更新最后登录时间
    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    })

    // 生成JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // 返回用户信息（不包含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      permissions: JSON.parse(user.permissions),
      status: user.status,
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userInfo,
        token,
      },
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { success: false, message: '登录失败' },
      { status: 500 }
    )
  }
}
