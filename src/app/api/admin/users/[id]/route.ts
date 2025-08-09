import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// 更新管理员用户
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, role, permissions, status, password } = body

    const updateData: any = {
      name,
      role,
      permissions: JSON.stringify(permissions),
      status,
    }

    // 如果提供了新密码，则加密并更新
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const user = await prisma.adminUser.update({
      where: { id },
      data: updateData,
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
    console.error('更新用户失败:', error)
    return NextResponse.json(
      { success: false, message: '更新用户失败' },
      { status: 500 }
    )
  }
}

// 删除管理员用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.adminUser.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '用户删除成功',
    })
  } catch (error) {
    console.error('删除用户失败:', error)
    return NextResponse.json(
      { success: false, message: '删除用户失败' },
      { status: 500 }
    )
  }
}
